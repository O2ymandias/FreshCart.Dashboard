import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ImageUploaderService } from '../../../../../core/services/image-uploader-service';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-edit-product-image',
  imports: [Message],
  templateUrl: './edit-product-image.html',
  styleUrl: './edit-product-image.scss',
})
export class EditProductImage {
  private readonly _imageUploaderService = inject(ImageUploaderService);

  constructor() {
    effect(() => {
      const image = this.uploadedImage();
      if (image) {
        const imageValidation = this._imageUploaderService.validateImage(image);
        if (!imageValidation.isValid) {
          this.errorMessage.set(imageValidation.error ?? null);
          return;
        }
      }
      this.errorMessage.set(null);
    });

    effect(() => {
      const uploadedImage = this.uploadedImage();
      if (uploadedImage) {
        this.onUploadImage.emit(uploadedImage);
      }
    });
  }

  onUploadImage = output<File>();
  fetchedImage = input.required<string | null>();
  uploadedImage = signal<File | null>(null);
  previewImage = computed(() => {
    const fetchedImage = this.fetchedImage();
    const uploadedImage = this.uploadedImage();
    const defaultImage = '/default-product-image.png';

    return uploadedImage
      ? URL.createObjectURL(uploadedImage)
      : (fetchedImage ?? defaultImage);
  });
  errorMessage = signal<string | null>(null);

  onFileUpload(event: Event): void {
    const uploadFileInput = event.target as HTMLInputElement;
    const files = uploadFileInput.files;
    if (files && files.length > 0) {
      this.uploadedImage.set(files[0]);
    }
  }
}
