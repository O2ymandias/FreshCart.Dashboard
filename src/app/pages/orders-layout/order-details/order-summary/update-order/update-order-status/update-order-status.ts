import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { OrderStatus } from '../../../../../../shared/models/orders-model';
import { OrdersService } from '../../../../../../core/services/orders/orders-service';
import { ToasterService } from '../../../../../../core/services/toaster-service';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-order-status',
  imports: [SelectModule, FormsModule],
  templateUrl: './update-order-status.html',
  styleUrl: './update-order-status.scss',
})
export class UpdateOrderStatus {
  private readonly _ordersService = inject(OrdersService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const order = this.order();
      if (order) this.orderStatus.set(order.orderStatus);
    });
  }

  order = this._ordersService.order;

  selectOptions: { label: string; value: OrderStatus }[] = [
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'Processing',
      value: 'Processing',
    },
    {
      label: 'Shipped',
      value: 'Shipped',
    },
    {
      label: 'Delivered',
      value: 'Delivered',
    },
    {
      label: 'Cancelled',
      value: 'Cancelled',
    },
  ];

  loading = signal(false);

  orderStatus = signal<OrderStatus | undefined>(undefined);

  onOrderStatusUpdate(): void {
    const order = this.order();
    if (!order) return;

    const orderStatus = this.orderStatus();
    if (!orderStatus) return;

    this.loading.set(true);

    this._ordersService
      .updateOrderStatus$({
        orderId: order.orderId,
        newOrderStatus: orderStatus,
      })
      .pipe(
        tap((res) => {
          if (res.success) this._toasterService.success(res.message);
        }),

        switchMap(() => this._ordersService.getOrder$(order.orderId)),

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
