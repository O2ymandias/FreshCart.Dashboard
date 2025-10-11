import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsService } from '../../../../core/services/products-service';
import { Image } from 'primeng/image';
import { ButtonModule } from 'primeng/button';

import {
  ProductGalleryResult,
  ProductTranslationResult,
} from '../../../../shared/models/product-details.model';
import { catchError, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ProductTranslations } from './product-translations/product-translations';
import { ProductGallery } from './product-gallery/product-gallery';
import { CurrencyPipe } from '@angular/common';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { Product } from '../../../../shared/models/products.model';

@Component({
  selector: 'app-product-details',
  imports: [
    Image,
    ButtonModule,
    TagModule,
    RatingModule,
    FormsModule,
    RouterLink,
    Breadcrumb,
    ProductTranslations,
    ProductGallery,
    CurrencyPipe,
    MessageModule,
  ],

  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);

  id = input.required<number>();
  productDetails = signal<Product | null>(null);
  gallery = signal<ProductGalleryResult[]>([]);
  averageRating = signal(0);
  translations = signal<ProductTranslationResult[]>([]);
  nameTranslations = computed(() =>
    this.translations().map((t) => ({
      languageCode: t.languageCode,
      name: t.name,
    })),
  );
  descriptionTranslations = computed(() =>
    this.translations().map((t) => ({
      languageCode: t.languageCode,
      description: t.description,
    })),
  );

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
      label: 'Product Details',
      disabled: true,
    },
  ];

  translationsVisible = signal(false);

  ngOnInit(): void {
    this._initialize();
  }

  onDeleteProduct(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this product?',
      header: 'Delete Product',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => this.deleteProduct(),
    });
  }

  deleteProduct() {
    this._productsService
      .deleteProduct(this.id())
      .pipe(
        tap((res) => {
          if (res) {
            this._toasterService.success('Product deleted successfully');
            this._router.navigate(['/products']);
          }
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getProductDetails(): void {
    this._productsService
      .getProduct$(this.id())
      .pipe(
        tap((res) => this.productDetails.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getProductAverageRating(): void {
    this._productsService
      .getProductAverageRating$(this.id())
      .pipe(
        tap((res) => this.averageRating.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initialize(): void {
    this._getProductDetails();
    this._getProductAverageRating();
  }
}
