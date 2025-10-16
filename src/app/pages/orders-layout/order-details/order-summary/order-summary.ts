import { Component, inject, input, signal } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { OrdersService } from '../../../../core/services/orders-service';
import {
  OrderResult,
  OrderStatus,
  PaymentStatus,
} from '../../../../shared/models/orders-model';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { OrderStatusSelectOptions } from '../../orders/order-status-select-options/order-status-select-options';
import { DialogModule } from 'primeng/dialog';
import { PaymentStatusSelectOptions } from "../../orders/payment-status-select-options/payment-status-select-options";

@Component({
  selector: 'app-order-summary',
  imports: [
    DatePipe,
    CurrencyPipe,
    TagModule,
    ButtonModule,
    Card,
    OrderStatusSelectOptions,
    DialogModule,
    PaymentStatusSelectOptions
],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  private readonly _ordersService = inject(OrdersService);

  order = input.required<OrderResult>();

  visible = signal(false);

  statusToSeverity(orderStatus: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(orderStatus);
  }
}
