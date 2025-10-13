import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

import { catchError, finalize, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../../../core/services/order-service';
import { ToasterService } from '../../../core/services/toaster-service';
import { OrderResult, PaymentStatus } from '../../models/orders-model';

@Component({
  selector: 'app-payment-status-select-options',
  imports: [SelectModule, FormsModule],
  templateUrl: './payment-status-select-options.html',
  styleUrl: './payment-status-select-options.scss',
})
export class PaymentStatusSelectOptions {
  private readonly _ordersService = inject(OrderService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  order = input.required<OrderResult>();
  updated = output();
  loading = signal(false);
  selectOptions: PaymentStatus[] = [
    'Pending',
    'AwaitingPayment',
    'PaymentReceived',
    'PaymentFailed',
  ];

  updatePaymentStatus() {
    this.loading.set(true);

    const { orderId, paymentStatus: newPaymentStatus } = this.order();

    this._ordersService
      .updatePaymentStatus$({
        orderId,
        newPaymentStatus,
      })
      .pipe(
        tap((res) => {
          if (res.success) {
            this._toasterService.success(res.message);
            this.updated.emit();
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
