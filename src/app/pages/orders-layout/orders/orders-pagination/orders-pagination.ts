import { Component, computed, DestroyRef, inject } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { OrdersService } from '../../../../core/services/orders-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersQueryOptions } from '../../../../shared/models/orders-model';

@Component({
  selector: 'app-orders-pagination',
  imports: [PaginatorModule],
  templateUrl: './orders-pagination.html',
  styleUrl: './orders-pagination.scss',
})
export class OrdersPagination {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  // Data
  orders = this._ordersService.orders;

  // Search
  searchQuery = this._ordersService.searchQuery;

  // Sort
  sort = computed(() => this._ordersService.sortOption()?.value);

  // Pagination
  pageSize = this._ordersService.pageSize;
  pageNumber = this._ordersService.pageNumber;
  totalRecords = this._ordersService.totalRecords;

  // Filtration
  orderStatus = computed(() => this._ordersService.orderStatusOption()?.value);
  paymentStatus = computed(
    () => this._ordersService.paymentStatusOption()?.value,
  );
  paymentMethod = computed(
    () => this._ordersService.paymentMethodOption()?.value,
  );
  minSubTotal = this._ordersService.minSubTotal;
  maxSubTotal = this._ordersService.maxSubTotal;

  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    this._ordersService.DEFAULT_PAGE_SIZE * 0.5,
    this._ordersService.DEFAULT_PAGE_SIZE * 1,
    this._ordersService.DEFAULT_PAGE_SIZE * 2,
  ];

  onPageChange(event: PaginatorState): void {
    // Set the page number and page size
    let pageNumber = this._ordersService.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this._ordersService.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    const query: OrdersQueryOptions = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    };

    // Considers:
    // [1] filtration
    query.orderStatus = this.orderStatus();
    query.paymentStatus = this.paymentStatus();
    query.paymentMethod = this.paymentMethod();
    query.minSubTotal = this.minSubTotal();
    query.maxSubTotal = this.maxSubTotal();

    // [2] sort options
    query.sort = this.sort();

    // [3] search query
    query.search = this.searchQuery();

    this._ordersService
      .getOrders$(query)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
