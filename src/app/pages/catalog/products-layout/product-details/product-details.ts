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
import { GalleriaModule } from 'primeng/galleria';

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
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-product-details',
  imports: [
    Image,
    ButtonModule,
    GalleriaModule,
    TagModule,
    RatingModule,
    FormsModule,
    FieldsetModule,
    DividerModule,
    RouterLink,
    Breadcrumb,
  ],

  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _messageService = inject(MessageService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<number>();
  productDetails = signal<IProductDetails>({} as IProductDetails);
  gallery = signal<IProductGallery[]>([]);
  galleryVisible = signal(false);
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

  ngOnInit(): void {
    this._initialize();
  }

  showGallery(): void {
    if (this.gallery().length === 0) {
      this._messageService.add({
        key: 'br',
        severity: 'info',
        summary: 'No Gallery',
        detail: 'This product has no gallery',
      });
      return;
    }
    this.galleryVisible.set(true);
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

  private _getProductGallery(): void {
    this._productsService
      .getProductGallery$(this.id())
      .pipe(
        tap((res) => this.gallery.set(res)),
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

  private _getProductTranslations(): void {
    this._productsService
      .getProductTranslations$(this.id())
      .pipe(
        tap((res) => this.translations.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initialize(): void {
    this._getProductDetails();
    this._getProductGallery();
    this._getProductAverageRating();
    this._getProductTranslations();
  }
}
