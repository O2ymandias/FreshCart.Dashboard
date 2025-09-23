import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ImageUploaderService } from '../../../core/services/image-uploader-service';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-image',
  imports: [MessageModule, FormsModule],
  templateUrl: './form-image.html',
  styleUrl: './form-image.scss',
})
export class FormImage {
  private readonly _imageUploaderService = inject(ImageUploaderService);

  constructor() {
    effect(() => {
      const image = this.uploadedImage();
      if (image) {
        const validation = this._imageUploaderService.validateImage(image);
        if (!validation.isValid) {
          this.errorMessage.set(validation.error ?? null);
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

    effect(() => {
      const isValid = this.isValid();
      this.valid.emit(isValid);
    });
  }

  fetchedImage = input<string | undefined>();
  onUploadImage = output<File>();
  valid = output<boolean>();

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
  isValid = computed(() => this.errorMessage() === null);

  onFileUpload(event: Event): void {
    const uploadFileInput = event.target as HTMLInputElement;
    const files = uploadFileInput.files;
    if (files && files.length > 0) {
      this.uploadedImage.set(files[0]);
    }
  }
}
