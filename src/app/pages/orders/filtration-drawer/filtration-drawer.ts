import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import {
  OrdersQueryOptions,
  OrderStatusOption,
  PaymentMethodOption,
  PaymentStatusOption,
} from '../../../shared/models/orders-model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { OrderService } from '../../../core/services/Orders/order-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-filtration-drawer',
  imports: [
    DrawerModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
  ],
  templateUrl: './filtration-drawer.html',
  styleUrl: './filtration-drawer.scss',
})
export class FiltrationDrawer {
  private readonly _ordersService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  visible = signal(false);

  orderStatus = signal<OrderStatusOption | undefined>(undefined);
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

  paymentStatus = signal<PaymentStatusOption | undefined>(undefined);
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

  paymentMethod = signal<PaymentMethodOption | undefined>(undefined);
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

  noFilters = computed(
    () =>
      !this.orderStatus() &&
      !this.paymentStatus() &&
      !this.paymentMethod() &&
      !this.minSubTotal() &&
      !this.maxSubTotal(),
  );

  loading = signal(false);

  applyFilters() {
    this.loading.set(true);

    // Reset to first page BUT keep the current page size.
    const query: OrdersQueryOptions = {
      pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
      pageSize: this._ordersService.pageSize(),
      orderStatus: this.orderStatus()?.value,
      paymentStatus: this.paymentStatus()?.value,
      paymentMethod: this.paymentMethod()?.value,
      minSubTotal: this.minSubTotal(),
      maxSubTotal: this.maxSubTotal(),
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
    this.orderStatus.set(undefined);
    this.paymentStatus.set(undefined);
    this.paymentMethod.set(undefined);
    this.minSubTotal.set(undefined);
    this.maxSubTotal.set(undefined);
  }
}
