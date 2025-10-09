import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import {
  OrderStatusOption,
  PaymentMethodOption,
  PaymentStatusOption,
} from '../../../shared/models/orders-model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { OrderService } from '../../../core/services/order-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filtration-drawer',
  imports: [
    DrawerModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    FloatLabelModule,
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

  filter() {
    // Reset to first page BUT keep the current page size.
    this._ordersService
      .getOrders$({
        pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
        pageSize: this._ordersService.pageSize(),
        orderStatus: this.orderStatus()?.value,
        paymentStatus: this.paymentStatus()?.value,
        paymentMethod: this.paymentMethod()?.value,
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
