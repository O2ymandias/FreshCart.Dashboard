import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  OrderResult,
  OrderStatus,
} from '../../../../../../shared/models/orders-model';
import { OrdersService } from '../../../../../../core/services/orders/orders-service';
import { ToasterService } from '../../../../../../core/services/toaster-service';
import { catchError, finalize, tap, throwError } from 'rxjs';
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
export class UpdateOrderStatus implements OnInit {
  private readonly _ordersService = inject(OrdersService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  order = input.required<OrderResult>();

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

  ngOnInit(): void {
    this.orderStatus.set(this.order().orderStatus);
  }

  onOrderStatusUpdate(): void {
    const orderStatus = this.orderStatus();
    if (!orderStatus) return;

    this.loading.set(true);

    this._ordersService
      .updateOrderStatus$({
        orderId: this.order().orderId,
        newOrderStatus: orderStatus,
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
