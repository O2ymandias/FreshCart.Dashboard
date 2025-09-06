import { BrandOption } from './../../../../shared/brands-model';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsService } from '../../../../core/services/products-service';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { IProductDetails } from '../../../../shared/product-details.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BrandsService } from '../../../../core/services/brands-service';
import { SelectModule } from 'primeng/select';
import { CategoriesService } from '../../../../core/services/categories-service';
import { CategoryOption } from '../../../../shared/categories.model';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EditProductGallery } from './edit-product-gallery/edit-product-gallery';
import { ImageUploaderService } from '../../../../core/services/image-uploader-service';
import { EditProductImage } from './edit-product-image/edit-product-image';

@Component({
  selector: 'app-edit-product',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    FloatLabelModule,
    TextareaModule,
    IftaLabelModule,
    InputNumberModule,
    FileUploadModule,
    FormErrors,
    BreadcrumbModule,
    EditProductGallery,
    EditProductImage,
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _brandsService = inject(BrandsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _imageUploaderService = inject(ImageUploaderService);
  private readonly _messageService = inject(MessageService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      // Read product details signal
      const productDetails = this.productDetails();

      // Read brandOption signal
      const brandOption = this.brandsOptions().find(
        (b) => b.id === productDetails?.brandId,
      );

      // Read categoryOption signal
      const categoryOption = this.categoriesOptions().find(
        (c) => c.id === productDetails?.categoryId,
      );

      this.productUpdateForm.patchValue({
        name: productDetails?.name,
        description: productDetails?.description,
        brand: brandOption,
        category: categoryOption,
        unitsInStock: productDetails?.unitsInStock,
        price: productDetails?.price,
      });
    });

    // effect(() => {
    //   const image = this.uploadedImage();
    //   if (image) {
    //     const imageValidation = this._imageUploaderService.validateImage(image);
    //     this.imageErrorMessage.set(imageValidation.error);
    //   } else {
    //     this.imageErrorMessage.set(undefined);
    //   }
    // });
  }

  id = input.required<number>();
  productDetails = signal<IProductDetails | null>(null);
  brandsOptions = signal<BrandOption[]>([]);
  categoriesOptions = signal<CategoryOption[]>([]);
  // uploadedImage = signal<File | undefined>(undefined);
  // previewImage = computed(() => {
  //   const fetchedImage = this.productDetails()?.pictureUrl;
  //   const uploadedImage = this.uploadedImage();
  //   const defaultImage = '/default-product-image.png';

  //   return uploadedImage
  //     ? URL.createObjectURL(uploadedImage)
  //     : (fetchedImage ?? defaultImage);
  // });

  // imageErrorMessage = signal<string | undefined>(undefined);

  uploadedImage = signal<File | null>(null);
  onUploadImage(image: File) {
    this.uploadedImage.set(image);
  }

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
      label: 'Edit Product',
      disabled: true,
    },
  ];

  productUpdateForm = new FormGroup({
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
    description: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    this._getProductDetails();
    this._getBrands();
    this._getCategories();
  }

  updateProduct(): void {
    if (this.productUpdateForm.invalid) return;
    const { name, description, price, unitsInStock, brand, category } =
      this.productUpdateForm.value;

    const formData = new FormData();
    formData.append('id', this.id().toString());
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (price) formData.append('price', price.toString());
    if (unitsInStock) formData.append('unitsInStock', unitsInStock.toString());
    if (brand) formData.append('brandId', brand.id.toString());
    if (category) formData.append('categoryId', category.id.toString());
    const image = this.uploadedImage();
    if (image) formData.append('image', image);

    this._productsService
      .updateProduct$(formData)
      .pipe(
        tap((res) => {
          if (res.updated) {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
              key: 'br',
            });
            this._router.navigate(['/products', 'details', this.id()]);
          }
        }),
        catchError((err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            icon: 'pi pi-times',
            key: 'br',
          });
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  // onFileUpload(event: Event): void {
  //   const uploadFileInput = event.target as HTMLInputElement;
  //   const files = uploadFileInput.files;
  //   if (files && files.length > 0) {
  //     this.uploadedImage.set(files[0]);
  //   }
  // }

  private _getProductDetails(): void {
    this._productsService
      .getProduct$(this.id())
      .pipe(
        tap((res) => this.productDetails.set(res)),
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
