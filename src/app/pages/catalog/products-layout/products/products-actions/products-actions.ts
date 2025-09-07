import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products-actions',
  imports: [ButtonModule, RouterLink],
  templateUrl: './products-actions.html',
  styleUrl: './products-actions.scss',
})
export class ProductsActions {
  productId = input.required<number>();
}
