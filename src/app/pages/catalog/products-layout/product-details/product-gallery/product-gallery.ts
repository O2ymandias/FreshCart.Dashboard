import { ButtonModule } from 'primeng/button';
import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ProductGalleryResult } from '../../../../../shared/models/product-details.model';
import { ToasterService } from '../../../../../core/services/toaster-service';
import { ProductsService } from '../../../../../core/services/products-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-gallery',
  imports: [GalleriaModule, ButtonModule],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
})
export class ProductGallery implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  productId = input.required<number>();
  gallery = signal<ProductGalleryResult[]>([]);
  galleryVisible = signal(false);

  ngOnInit(): void {
    this._getProductGallery();
  }

  showGallery(): void {
    if (this.gallery().length === 0) {
      this._toasterService.info('No images found');
      return;
    }
    this.galleryVisible.set(true);
  }

  private _getProductGallery(): void {
    this._productsService
      .getProductGallery$(this.productId())
      .pipe(
        tap((res) => this.gallery.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
