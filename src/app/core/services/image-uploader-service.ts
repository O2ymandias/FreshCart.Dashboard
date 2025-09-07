import { Injectable } from '@angular/core';

type ImageValidation = {
  isValid: boolean;
  error?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ImageUploaderService {
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  readonly MAX_FILE_COUNT = 5;
  readonly ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];
  readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

  validateImage(file: File): ImageValidation {
    if (!this.isMimeTypeValid(file)) {
      return {
        isValid: false,
        error: `Invalid mime type. Allowed: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
      };
    } else if (!this.isFileSizeValid(file)) {
      return {
        isValid: false,
        error: `File size exceeds the limit of ${this.MAX_FILE_SIZE / 1024 / 1024} MB`,
      };
    } else if (!this.isFileExtensionValid(file)) {
      return {
        isValid: false,
        error: `Invalid file extension. Allowed: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
      };
    } else {
      return { isValid: true };
    }
  }

  validateImages(files: File[]): ImageValidation {
    if (!this.isFileCountValid(files)) {
      return {
        isValid: false,
        error: `Too many files. Max: ${this.MAX_FILE_COUNT} images are allowed.`,
      };
    }

    for (let i = 0; i < files.length; i++) {
      const imageValidation = this.validateImage(files[i]);
      if (!imageValidation.isValid) {
        return imageValidation;
      }
    }

    return {
      isValid: true,
    };
  }

  isFileSizeValid(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  isFileExtensionValid(file: File): boolean {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
    return this.ALLOWED_EXTENSIONS.includes(fileExtension);
  }

  isFileCountValid(files: File[]): boolean {
    return files.length <= this.MAX_FILE_COUNT;
  }

  isMimeTypeValid(file: File): boolean {
    return this.ALLOWED_MIME_TYPES.includes(file.type);
  }
}
