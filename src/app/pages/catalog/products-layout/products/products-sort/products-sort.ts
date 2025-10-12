import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import {
  ProductSortOption,
  ProductsQueryOptions,
} from '../../../../../shared/models/products.model';
import { ProductsService } from '../../../../../core/services/products-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-sort',
  imports: [SelectModule, FormsModule],
  templateUrl: './products-sort.html',
  styleUrl: './products-sort.scss',
})
export class ProductsSort {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  selectedSortOption = this._productsService.selectedSortOption;

  sortOptions: ProductSortOption[] = [
    {
      label: 'Name: A to Z',
      value: {
        key: 'name',
        dir: 'asc',
      },
    },
    {
      label: 'Name: Z to A',
      value: {
        key: 'name',
        dir: 'desc',
      },
    },
    {
      label: 'Price: High to Low',
      value: {
        key: 'price',
        dir: 'desc',
      },
    },
    {
      label: 'Price: Low to High',
      value: {
        key: 'price',
        dir: 'asc',
      },
    },
    {
      label: 'Stock: Low to High',
      value: {
        key: 'unitsInStock',
        dir: 'asc',
      },
    },
    {
      label: 'Stock: High to Low',
      value: {
        key: 'unitsInStock',
        dir: 'desc',
      },
    },
  ];

  sort(): void {
    const sortOption = this.selectedSortOption();
    if (!sortOption) {
      this._loadProducts({
        pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
        pageSize: this._productsService.pageSize(),
      });
      return;
    }

    // Reset to first page BUT keep the current page size.
    this._loadProducts({
      pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productsService.pageSize(),
      sort: sortOption.value,
    });
  }

  private _loadProducts(options: ProductsQueryOptions): void {
    this._productsService
      .getProducts$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
