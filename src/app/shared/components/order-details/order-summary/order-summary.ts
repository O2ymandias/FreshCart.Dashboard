import { Component, inject, input } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { OrdersService } from '../../../../core/services/orders-service';
import {
  OrderResult,
  OrderStatus,
  PaymentStatus,
} from '../../../models/orders-model';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-order-summary',
  imports: [DatePipe, CurrencyPipe, TagModule, ButtonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  private readonly _ordersService = inject(OrdersService);

  order = input.required<OrderResult>();

  statusToSeverity(orderStatus: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(orderStatus);
  }
}
