import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import {
  OrdersQueryOptions,
  OrderStatusOption,
  PaymentMethodOption,
  PaymentStatusOption,
} from '../../../../shared/models/orders-model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { OrdersService } from '../../../../core/services/orders-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { finalize, tap } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { Fieldset } from 'primeng/fieldset';

@Component({
  selector: 'app-orders-filtration',
  imports: [
    DrawerModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    DatePickerModule,
    Fieldset,
  ],
  templateUrl: './orders-filtration.html',
  styleUrl: './orders-filtration.scss',
})
export class OrdersFiltration {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  visible = signal(false);

  orderStatusOption = this._ordersService.orderStatusOption;
  OrderStatusOptions: OrderStatusOption[] = [
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

  paymentStatusOption = this._ordersService.paymentStatusOption;
  PaymentStatusOptions: PaymentStatusOption[] = [
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

  paymentMethodOption = this._ordersService.paymentMethodOption;
  PaymentMethodOptions: PaymentMethodOption[] = [
    {
      label: 'Cash',
      value: 'Cash',
    },
    {
      label: 'Online',
      value: 'Online',
    },
  ];

  minSubTotal = signal<number | undefined>(undefined);
  maxSubTotal = signal<number | undefined>(undefined);

  startDate = signal<Date | undefined>(undefined);
  endDate = signal<Date | undefined>(undefined);

  noFilters = computed(
    () =>
      !this.orderStatusOption() &&
      !this.paymentStatusOption() &&
      !this.paymentMethodOption() &&
      !this.minSubTotal() &&
      !this.maxSubTotal() &&
      !this.startDate() &&
      !this.endDate(),
  );

  loading = signal(false);

  applyFilters() {
    this.loading.set(true);

    // Reset to first page BUT keep the current page size.
    const query: OrdersQueryOptions = {
      pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
      pageSize: this._ordersService.pageSize(),

      orderStatus: this.orderStatusOption()?.value,
      paymentStatus: this.paymentStatusOption()?.value,
      paymentMethod: this.paymentMethodOption()?.value,

      minSubTotal: this.minSubTotal(),
      maxSubTotal: this.maxSubTotal(),

      startDate: this.startDate()?.toISOString(),
      endDate: this.endDate()?.toISOString(),
    };

    this._ordersService
      .getOrders$(query)
      .pipe(
        tap(() => this.visible.set(false)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  clearFilters() {
    this.orderStatusOption.set(undefined);
    this.paymentStatusOption.set(undefined);
    this.paymentMethodOption.set(undefined);
    this.minSubTotal.set(undefined);
    this.maxSubTotal.set(undefined);
    this.startDate.set(undefined);
    this.endDate.set(undefined);
  }
}
