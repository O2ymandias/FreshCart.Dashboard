import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { OrdersService } from '../../../../../../core/services/orders/orders-service';
import { ToasterService } from '../../../../../../core/services/toaster-service';
import {
  OrderResult,
  PaymentStatus,
} from '../../../../../../shared/models/orders-model';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-payment-status',
  imports: [SelectModule, FormsModule],
  templateUrl: './update-payment-status.html',
  styleUrl: './update-payment-status.scss',
})
export class UpdatePaymentStatus {
  private readonly _ordersService = inject(OrdersService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  order = input.required<OrderResult>();

  selectOptions: { label: string; value: PaymentStatus }[] = [
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'Awaiting Payment',
      value: 'AwaitingPayment',
    },
    {
      label: 'Payment Received',
      value: 'PaymentReceived',
    },
    {
      label: 'Payment Failed',
      value: 'PaymentFailed',
    },
  ];

  loading = signal(false);

  paymentStatus = signal<PaymentStatus | undefined>(undefined);

  updated = output();

  ngOnInit(): void {
    this.paymentStatus.set(this.order().paymentStatus);
  }

  onPaymentStatusUpdate(): void {
    const paymentStatus = this.paymentStatus();
    if (!paymentStatus) return;

    this.loading.set(true);

    this._ordersService
      .updatePaymentStatus$({
        orderId: this.order().orderId,
        newPaymentStatus: paymentStatus,
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
