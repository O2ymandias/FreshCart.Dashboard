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
import { MessageModule } from 'primeng/message';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrors } from '../../../../../shared/components/form-errors/form-errors';

@Component({
  selector: 'app-edit-product-image',
  imports: [MessageModule, FormsModule, ReactiveFormsModule, FormErrors],
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

    effect(() => {
      const errMsg = this.errorMessage();
      if (errMsg) {
        this.onValidateImage.emit(false);
      } else {
        this.onValidateImage.emit(true);
      }
    });
  }

  imageControl = input<FormControl<File | null>>();
  fetchedImage = input.required<string | null>();
  onUploadImage = output<File>();
  onValidateImage = output<boolean>();
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
