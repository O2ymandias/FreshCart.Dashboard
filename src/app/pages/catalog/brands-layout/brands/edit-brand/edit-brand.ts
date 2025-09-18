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
import { EditBrandTranslations } from "./edit-brand-translations/edit-brand-translations";

@Component({
  selector: 'app-edit-brand',
  imports: [
    ReactiveFormsModule,
    CreateUpdateProductImage,
    ButtonModule,
    FormErrors,
    BreadcrumbModule,
    InputTextModule,
    EditBrandTranslations
],
  templateUrl: './edit-brand.html',
  styleUrl: './edit-brand.scss',
})
export class EditBrand implements OnInit {
  private readonly _brandsService = inject(BrandsService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const brand = this.brand();
      if (brand) {
        this.editBrandForm.patchValue({
          name: brand.name,
        });
      }
    });
  }

  id = input.required<number>();
  brand = signal<BrandResult | null>(null);
  brandTranslations = signal<BrandTranslation[]>([]);
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
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this._getBrand();
    this._getBrandTranslations();
  }

  onUploadImage(image: File) {}

  updateBrand() {}

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
}
