import { Component, DestroyRef, inject, input, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../../core/services/order-service';
import { ToasterService } from '../../../core/services/toaster-service';
import { OrderResult, OrderStatus } from '../../models/orders-model';

@Component({
  selector: 'app-order-status-select-options',
  imports: [FormsModule, SelectModule],
  templateUrl: './order-status-select-options.html',
  styleUrl: './order-status-select-options.scss',
})
export class OrderStatusSelectOptions {
  private readonly _ordersService = inject(OrderService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  order = input.required<OrderResult>();

  loading = signal(false);

  selectOptions: OrderStatus[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  updateOrderStatus() {
    this.loading.set(true);

    const { orderId, orderStatus: newOrderStatus } = this.order();

    this._ordersService
      .updateOrderStatus$({
        orderId,
        newOrderStatus,
      })
      .pipe(
        tap((res) => {
          if (res.success) {
            this._toasterService.success(res.message);
          }
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        finalize(() => this.loading.set(false)),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
