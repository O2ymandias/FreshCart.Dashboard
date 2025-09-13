import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products-service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrandOption } from '../../../../shared/brands-model';
import { CategoryOption } from '../../../../shared/categories.model';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { EditProductImage } from '../edit-product/edit-product-image/edit-product-image';
import { InputTextModule } from 'primeng/inputtext';

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
    EditProductImage,
    InputTextModule,
  ],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

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

  brandsOptions = signal<BrandOption[]>([]);
  categoriesOptions = signal<CategoryOption[]>([]);

  createProductForm = new FormGroup({
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
      Validators.min(3),
    ]),
  });

  ngOnInit(): void {}

  onUploadImage(image: File) {}

  createProduct() {}
}
