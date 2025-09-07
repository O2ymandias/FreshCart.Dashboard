import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '../../../../../core/services/products-service';
import { IProductGallery } from '../../../../../shared/product-details.model';
import { EMPTY, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../../environment';
import { ProductGalleryUploader } from './product-gallery-uploader/product-gallery-uploader';
import { ProductGalleryImage } from './product-gallery-image/product-gallery-image';

@Component({
  selector: 'app-edit-product-gallery',
  imports: [Dialog, ButtonModule, ProductGalleryUploader, ProductGalleryImage],
  templateUrl: './edit-product-gallery.html',
  styleUrl: './edit-product-gallery.scss',
})
export class EditProductGallery implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  productId = input.required<number>();
  visible = signal(false);
  gallery = signal<IProductGallery[]>([]);

  ngOnInit(): void {
    this._getProductGallery();
  }

  private _getProductGallery() {
    return this._productsService
      .getProductGallery$(this.productId())
      .pipe(
        tap((res) => this.gallery.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  onUpload() {
    this._getProductGallery();
  }

  deleteFromProductGallery(imagePath: string) {
    imagePath = imagePath.replace(environment.serverBaseUrl, '');

    this._productsService
      .deleteFromProductGallery$(this.productId(), imagePath)
      .pipe(
        switchMap((deleted) => {
          if (deleted) {
            return this._productsService.getProductGallery$(this.productId());
          } else return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
