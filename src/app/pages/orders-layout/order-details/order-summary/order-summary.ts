import { Component, inject, input, signal } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { OrdersService } from '../../../../core/services/orders-service';
import {
  OrderResult,
  OrderStatus,
  PaymentStatus,
} from '../../../../shared/models/orders-model';
import { Card } from 'primeng/card';
import { UpdateOrder } from './update-order/update-order';

@Component({
  selector: 'app-order-summary',
  imports: [DatePipe, CurrencyPipe, TagModule, Card, UpdateOrder],
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
