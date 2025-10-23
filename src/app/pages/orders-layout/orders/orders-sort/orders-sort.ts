import { FormsModule } from '@angular/forms';
import { Component, DestroyRef, inject } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { OrdersService } from '../../../../core/services/orders/orders-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  OrderSortOption,
  OrdersQueryOptions,
} from '../../../../shared/models/orders-model';

@Component({
  selector: 'app-orders-sort',
  imports: [SelectModule, FormsModule],
  templateUrl: './orders-sort.html',
  styleUrl: './orders-sort.scss',
})
export class OrdersSort {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  sort = this._ordersService.sort;
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

  applySort(): void {
    // Reset to first page BUT keep the current page size.
    const sort = this.sort();
    if (!sort) {
      this._loadOrders({
        pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
        pageSize: this._ordersService.pageSize(),
      });
      return;
    }

    this._loadOrders({
      pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
      pageSize: this._ordersService.pageSize(),
      sort,
    });
  }

  private _loadOrders(options: OrdersQueryOptions): void {
    this._ordersService
      .getOrders$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
