import { AbstractControl } from '@angular/forms';
import { ImageUploaderService } from '../../../../core/services/image-uploader-service';

export function validateImage(imageUploaderService: ImageUploaderService) {
  return (control: AbstractControl) => {
    const image = control.value;
    if (image) {
      const imageValidation = imageUploaderService.validateImage(image);
      if (!imageValidation.isValid) {
        return { image: imageValidation.error ?? null };
      }
    }
    return null;
  };
}
