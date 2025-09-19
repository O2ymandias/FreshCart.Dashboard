import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { BrandsService } from '../../../../../core/services/brands-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BrandResult,
  BrandTranslation,
} from '../../../../../shared/brands-model';
import { map, tap } from 'rxjs';
import { CreateUpdateProductImage } from '../../../products-layout/create-update-product-image/create-update-product-image';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FormErrors } from '../../../../../shared/components/form-errors/form-errors';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CommonService } from '../../../../../core/services/common-service';
import { LanguageCode } from '../../../../../shared/shared.model';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-edit-brand',
  imports: [
    ReactiveFormsModule,
    CreateUpdateProductImage,
    ButtonModule,
    FormErrors,
    BreadcrumbModule,
    InputTextModule,
    FieldsetModule,
    FloatLabelModule,
  ],
  templateUrl: './edit-brand.html',
  styleUrl: './edit-brand.scss',
})
export class EditBrand implements OnInit {
  private readonly _brandsService = inject(BrandsService);
  private readonly _commonService = inject(CommonService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const brand = this.brand();
      const brandTranslations = this.brandTranslations();

      if (brand) {
        this.editBrandForm.patchValue({
          id: brand.id,
          name: brand.name,
          translations: brandTranslations.map((bt) => ({
            languageCode: bt.languageCode,
            name: bt.name,
          })),
        });
      }
    });
  }

  id = input.required<number>();
  brand = signal<BrandResult | null>(null);
  brandTranslations = signal<BrandTranslation[]>([]);
  translationsKeys = signal<LanguageCode[]>([]);
  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Brands',
      routerLink: '/brands',
    },
    {
      label: 'Edit Brand',
      disabled: true,
    },
  ];
  editBrandForm = new FormGroup({
    id: new FormControl<number>(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    translations: new FormArray<FormGroup>([]),
  });

  ngOnInit(): void {
    this._getBrand();
    this._getBrandTranslations();
    this._getTranslationsKeys();
  }

  onUploadImage(image: File) {}

  updateBrand() {
    console.log(this.editBrandForm.value);
  }

  getControl(group: FormGroup, controlName: string) {
    return group.controls[controlName] as FormControl;
  }

  private _initTranslationsGroup(keys: LanguageCode[]) {
    const translationsGroup = this.editBrandForm.controls.translations;
    for (const key of keys) {
      translationsGroup.push(
        new FormGroup({
          languageCode: new FormControl<LanguageCode>(key, [
            Validators.required,
          ]),

          name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        }),
      );
    }
  }

  private _getBrand() {
    this._brandsService
      .getBrands$()
      .pipe(
        map(
          (res) =>
            res.find((b) => b.id.toString() === this.id().toString()) ?? null,
        ),
        tap((res) => {
          this.brand.set(res);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getBrandTranslations() {
    this._brandsService
      .getBrandTranslations$(this.id())
      .pipe(
        tap((res) => this.brandTranslations.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getTranslationsKeys() {
    this._commonService
      .getTranslationsKeys$()
      .pipe(
        tap((res) => {
          this.translationsKeys.set(res);
          this._initTranslationsGroup(res);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
