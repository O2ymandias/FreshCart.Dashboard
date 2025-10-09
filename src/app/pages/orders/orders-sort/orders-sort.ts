import { FormsModule } from '@angular/forms';
import { Component, DestroyRef, inject } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { OrderService } from '../../../core/services/order-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  OrderSortOption,
  OrdersQueryOptions,
} from '../../../shared/models/orders-model';

@Component({
  selector: 'app-orders-sort',
  imports: [SelectModule, FormsModule],
  templateUrl: './orders-sort.html',
  styleUrl: './orders-sort.scss',
})
export class OrdersSort {
  private readonly _ordersService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  pageSize = this._ordersService.pageSize;
  searchByOrderId = this._ordersService.searchByOrderId;

  selectedSortOption = this._ordersService.selectedSortOption;
  sortOptions: OrderSortOption[] = [
    {
      label: 'Created At: New to Old',
      value: {
        key: 'createdAt',
        dir: 'desc',
      },
    },
    {
      label: 'Created At: Old to New',
      value: {
        key: 'createdAt',
        dir: 'asc',
      },
    },
    {
      label: 'SubTotal: High to Low',
      value: {
        key: 'subTotal',
        dir: 'desc',
      },
    },
    {
      label: 'SubTotal: Low to High',
      value: {
        key: 'subTotal',
        dir: 'asc',
      },
    },
  ];

  sort(): void {
    const sortOption = this.selectedSortOption();
    if (!sortOption) {
      this._loadOrders({
        pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
        pageSize: this.pageSize(),
        orderId: this.searchByOrderId(),
      });
      return;
    }

    const { key, dir } = sortOption.value;

    // Reset to first page BUT keep the current page size.
    // Keep the current search query.
    this._loadOrders({
      pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      orderId: this.searchByOrderId(),
      sort: { key, dir },
    });
  }

  private _loadOrders(options: OrdersQueryOptions): void {
    this._ordersService
      .getOrders$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
