import { Component, computed, DestroyRef, inject } from '@angular/core';
import { ProductsService } from '../../../../../core/services/products-service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProductsQueryOptions } from '../../../../../shared/models/products.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-pagination',
  imports: [PaginatorModule],
  templateUrl: './products-pagination.html',
  styleUrl: './products-pagination.scss',
})
export class ProductsPagination {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  // Pagination
  pageNumber = this._productsService.pageNumber;
  pageSize = this._productsService.pageSize;
  totalRecords = this._productsService.totalRecords;

  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    this._productsService.DEFAULT_PAGE_SIZE * 0.5,
    this._productsService.DEFAULT_PAGE_SIZE * 1,
    this._productsService.DEFAULT_PAGE_SIZE * 2,
  ];

  // Search
  searchQuery = this._productsService.searchQuery;

  // Sort
  selectedSortOption = this._productsService.selectedSortOption;

  // Filters
  selectedBrandOption = this._productsService.selectedBrandOption;
  selectedCategoryOption = this._productsService.selectedCategoryOption;
  minPrice = this._productsService.minPrice;
  maxPrice = this._productsService.maxPrice;

  onPageChange(event: PaginatorState): void {
    let pageNumber = this._productsService.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this._productsService.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    const query: ProductsQueryOptions = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    };

    // Consider:
    // [1] search query
    const search = this.searchQuery();
    if (search) query.search = search;

    // [2] sort options
    const sortOption = this.selectedSortOption();
    const sort = sortOption
      ? { key: sortOption.value.key, dir: sortOption.value.dir }
      : undefined;
    if (sort) query.sort = sort;

    // [3] filters
    const brandId = this.selectedBrandOption()?.id;
    const categoryId = this.selectedCategoryOption()?.id;
    const minPrice = this.minPrice();
    const maxPrice = this.maxPrice();

    if (brandId) query.brandId = brandId;
    if (categoryId) query.categoryId = categoryId;
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;

    console.log(query);

    this._loadProducts(query);
  }

  private _loadProducts(options: ProductsQueryOptions): void {
    this._productsService
      .getProducts$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
