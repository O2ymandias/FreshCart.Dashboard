import { Component, computed, DestroyRef, inject } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { OrderService } from '../../../core/services/order-service';
import { ToasterService } from '../../../core/services/toaster-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-orders-pagination',
  imports: [PaginatorModule],
  templateUrl: './orders-pagination.html',
  styleUrl: './orders-pagination.scss',
})
export class OrdersPagination {
  private readonly _ordersService = inject(OrderService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  // Data
  orders = this._ordersService.orders;

  // Search
  searchByOrderId = this._ordersService.searchByOrderId;

  // Sort
  selectedSortOption = this._ordersService.selectedSortOption;

  // Pagination
  pageSize = this._ordersService.pageSize;
  pageNumber = this._ordersService.pageNumber;
  totalRecords = this._ordersService.totalRecords;

  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    2,
    this._ordersService.DEFAULT_PAGE_SIZE * 0.5,
    this._ordersService.DEFAULT_PAGE_SIZE * 1,
    this._ordersService.DEFAULT_PAGE_SIZE * 2,
  ];

  onPageChange(event: PaginatorState): void {
    let pageNumber = this._ordersService.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this._ordersService.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    // Considers:
    // [1] searchByOrderId
    const orderId = this.searchByOrderId();

    // [2] sort options
    const sortOption = this.selectedSortOption();
    const sort = sortOption
      ? { key: sortOption.value.key, dir: sortOption.value.dir }
      : undefined;

    this._ordersService
      .getOrders$({ pageNumber, pageSize, orderId, sort })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  // private _loadOrders(options: OrdersQueryOptions): void {
  //   this._ordersService
  //     .getOrders$(options)
  //     .pipe(
  //       tap((res) => {
  //         this.orders.set(res.results);
  //         this.pageNumber.set(res.pageNumber);
  //         this.pageSize.set(res.pageSize);
  //         this.totalRecords.set(res.total);
  //       }),
  //       catchError((err: HttpErrorResponse) => {
  //         let errorMessage = err.message;
  //         if (err.error.errors) {
  //           errorMessage = err.error.errors.join(', ');
  //         }
  //         this._toasterService.error(errorMessage);
  //         return throwError(() => err);
  //       }),
  //       takeUntilDestroyed(this._destroyRef),
  //     )
  //     .subscribe();
  // }
}
