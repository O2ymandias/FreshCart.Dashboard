import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products-service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrandOption } from '../../../../shared/models/brands-model';
import { CategoryOption } from '../../../../shared/models/categories.model';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToasterService } from '../../../../core/services/toaster-service';
import { CategoriesService } from '../../../../core/services/categories-service';
import { BrandsService } from '../../../../core/services/brands-service';
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { FormImage } from '../../../../shared/components/form-image/form-image';

@Component({
  selector: 'app-create-product',
  imports: [
    ReactiveFormsModule,
    Breadcrumb,
    FormErrors,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    FormImage,
  ],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct implements OnInit {
  // Fields
  private readonly _productsService = inject(ProductsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _brandsService = inject(BrandsService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  // Properties
  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Products',
      routerLink: '/products',
    },
    {
      label: 'Create Product',
      disabled: true,
    },
  ];
  uploadedImage = signal<File | null>(null);
  isValidUploadedImage = signal(true);
  brandsOptions = signal<BrandOption[]>([]);
  categoriesOptions = signal<CategoryOption[]>([]);
  loading = signal(false);
  createProductForm = new FormGroup({
    // Just for validation, its value won't be used.
    image: new FormControl<string | null>(null, [Validators.required]),

    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),

    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),

    brand: new FormControl<BrandOption | null>(null, [Validators.required]),

    category: new FormControl<CategoryOption | null>(null, [
      Validators.required,
    ]),

    unitsInStock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),

    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  get canSubmit() {
    return (
      this.createProductForm.valid &&
      this.uploadedImage() !== null &&
      this.isValidUploadedImage()
    );
  }

  // Lifecycle
  ngOnInit(): void {
    this._getBrands();
    this._getCategories();
  }

  // Methods
  onUploadImage(image: File) {
    this.uploadedImage.set(image);
    this.createProductForm.patchValue({ image: image.name });
  }

  onValidateImage(isValid: boolean) {
    this.isValidUploadedImage.set(isValid);
  }

  createProduct() {
    if (!this.canSubmit) {
      this.createProductForm.markAllAsDirty();
      return;
    }

    this.loading.set(true);

    const { name, price, brand, category, unitsInStock, description } =
      this.createProductForm.value;

    const formData = new FormData();

    const uploadedImage = this.uploadedImage();
    if (uploadedImage) formData.append('image', uploadedImage);

    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (price) formData.append('price', price.toString());
    if (unitsInStock) formData.append('unitsInStock', unitsInStock.toString());
    if (brand) formData.append('brandId', brand.id.toString());
    if (category) formData.append('categoryId', category.id.toString());

    this._productsService
      .createProduct$(formData)
      .pipe(
        tap((res) => {
          if (res.success) {
            this._toasterService.success(res.message);
            this._router.navigate(['/products']);
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        finalize(() => this.loading.set(false)),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getBrands(): void {
    this._brandsService
      .getBrands$()
      .pipe(
        map((res) => res.map((b) => ({ id: b.id, name: b.name }))),
        tap((res: BrandOption[]) => this.brandsOptions.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getCategories(): void {
    this._categoriesService
      .getCategories$()
      .pipe(
        map((res) => res.map((c) => ({ id: c.id, name: c.name }))),
        tap((res: CategoryOption[]) => this.categoriesOptions.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
