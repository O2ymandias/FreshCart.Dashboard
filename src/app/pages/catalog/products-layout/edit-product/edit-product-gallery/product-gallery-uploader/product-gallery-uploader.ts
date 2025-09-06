import { ButtonModule } from 'primeng/button';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ProductGalleryImage } from '../product-gallery-image/product-gallery-image';
import { ImageUploaderService } from '../../../../../../core/services/image-uploader-service';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-product-gallery-uploader',
  imports: [ButtonModule, ProductGalleryImage, Message],
  templateUrl: './product-gallery-uploader.html',
  styleUrl: './product-gallery-uploader.scss',
})
export class ProductGalleryUploader {
  private readonly _imageUploaderService = inject(ImageUploaderService);

  constructor() {
    effect(() => {
      const selectedFiles = this.selectedFiles();
      this._validateSelectedFiles(selectedFiles);
    });
  }

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

  uploadImages() {}

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
