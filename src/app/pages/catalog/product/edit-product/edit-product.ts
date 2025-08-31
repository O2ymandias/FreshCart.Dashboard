import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../../core/services/products-service';

@Component({
  selector: 'app-edit-product',
  imports: [],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct {
  private readonly _productsService = inject(ProductsService);
}
