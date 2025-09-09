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
  IProductDetails,
  IProductGallery,
  IProductTranslation,
} from '../../../../shared/product-details.model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ProductTranslations } from './product-translations/product-translations';
import { ProductGallery } from './product-gallery/product-gallery';
import { CurrencyPipe } from '@angular/common';

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
  ],

  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<number>();
  productDetails = signal<IProductDetails>({} as IProductDetails);
  gallery = signal<IProductGallery[]>([]);
  averageRating = signal(0);
  translations = signal<IProductTranslation[]>([]);
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

  navigateToEditProduct(): void {
    this._router.navigate(['/products', 'edit', this.id()]);
  }

  navigateToProducts(): void {
    this._router.navigate(['/products']);
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
