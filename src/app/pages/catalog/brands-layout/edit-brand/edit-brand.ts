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
} from '../../../../../shared/models/brands-model';
import { catchError, map, tap, throwError } from 'rxjs';

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
import { LanguageCode } from '../../../../../shared/models/shared.model';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToasterService } from '../../../../../core/services/toaster-service';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { FormImage } from "../../../../../shared/components/form-image/form-image";

@Component({
  selector: 'app-edit-brand',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormErrors,
    BreadcrumbModule,
    InputTextModule,
    FieldsetModule,
    FloatLabelModule,
    MessageModule,
    FormImage
],
  templateUrl: './edit-brand.html',
  styleUrl: './edit-brand.scss',
})
export class EditBrand implements OnInit {
  private readonly _brandsService = inject(BrandsService);
  private readonly _commonService = inject(CommonService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _router = inject(Router);
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
  uploadedImage = signal<File | null>(null);
  isValidUploadedImage = signal(true);
  editBrandForm = new FormGroup({
    id: new FormControl<number>(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    translations: new FormArray<FormGroup>([]),
  });

  get canSubmit() {
    return this.editBrandForm.valid && this.isValidUploadedImage();
  }

  ngOnInit(): void {
    this._getBrand();
    this._getBrandTranslations();
    this._getTranslationsKeys();
  }

  getControl(group: FormGroup, controlName: string) {
    return group.controls[controlName] as FormControl;
  }

  onUploadImage(image: File) {
    this.uploadedImage.set(image);
  }

  onValidateImage(isValid: boolean) {
    this.isValidUploadedImage.set(isValid);
  }

  updateBrand() {
    if (!this.canSubmit) {
      this.editBrandForm.markAllAsDirty();
      return;
    }

    const { id, name, translations } = this.editBrandForm.value;

    const formData = new FormData();

    const uploadedImage = this.uploadedImage();
    if (uploadedImage) formData.append('image', uploadedImage);

    if (id) formData.append('brandId', id.toString());
    if (name) formData.append('name', name);
    if (translations) {
      translations.forEach((t: BrandTranslation, i: number) => {
        formData.append(`translations[${i}].languageCode`, t.languageCode);
        formData.append(`translations[${i}].name`, t.name);
      });
    }

    this._brandsService
      .updateBrand(formData)
      .pipe(
        tap((res) => {
          this._router.navigate(['/brands']);
          this._toasterService.success(res.message);
        }),

        catchError((err) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
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
