import { Component, input, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-product-gallery-image',
  imports: [ButtonDirective],
  templateUrl: './product-gallery-image.html',
  styleUrl: './product-gallery-image.scss',
})
export class ProductGalleryImage {
  imageSrc = input.required<string>();
  imageAlt = input.required<string>();

  onRemoved = output();

  onRemoveImage() {
    this.onRemoved.emit();
  }
}
