import { ButtonModule } from 'primeng/button';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ProductGalleryImage } from '../product-gallery-image/product-gallery-image';
import { ImageUploaderService } from '../../../../../../core/services/image-uploader-service';
import { Message } from 'primeng/message';
import { ProductsService } from '../../../../../../core/services/products-service';
import { catchError, tap, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-gallery-uploader',
  imports: [ButtonModule, ProductGalleryImage, Message],
  templateUrl: './product-gallery-uploader.html',
  styleUrl: './product-gallery-uploader.scss',
})
export class ProductGalleryUploader {
  private readonly _imageUploaderService = inject(ImageUploaderService);
  private readonly _productsService = inject(ProductsService);
  private readonly _messageService = inject(MessageService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const selectedFiles = this.selectedFiles();
      this._validateSelectedFiles(selectedFiles);
    });
  }

  productId = input.required<number>();
  onUpload = output();
  selectedFiles = signal<File[]>([]);
  previewImages = computed(() =>
    this.selectedFiles().map((f) => URL.createObjectURL(f)),
  );
  errorMessage = signal<string | null>(null);
  disabledUploadBtn = computed(
    () => this.selectedFiles().length === 0 || this.errorMessage() !== null,
  );

  onFileSelect(event: Event) {
    const newFiles = (event.target as HTMLInputElement).files;
    if (newFiles) {
      this.selectedFiles.update((oldFiles) => [...oldFiles, ...newFiles]);
    }
  }

  onRemoveSelectedImage(index: number) {
    this.selectedFiles.update((oldFiles) =>
      oldFiles.filter((_, i) => i !== index),
    );
  }

  uploadImages() {
    const formData = new FormData();
    formData.append('productId', this.productId().toString());
    this.selectedFiles().forEach((f) => formData.append('images', f));

    this._productsService
      .addToProductGallery$(formData)
      .pipe(
        tap((res) => {
          if (res.updated) {
            this.selectedFiles.set([]);
            this.errorMessage.set(null);
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
              key: 'br',
            });
          }
          this.onUpload.emit();
        }),

        catchError((err: HttpErrorResponse) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            key: 'br',
          });
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _validateSelectedFiles(selectedFiles: File[]) {
    const imageValidation =
      this._imageUploaderService.validateImages(selectedFiles);
    if (!imageValidation.isValid) {
      this.errorMessage.set(imageValidation.error ?? null);
    } else {
      this.errorMessage.set(null);
    }
  }
}
