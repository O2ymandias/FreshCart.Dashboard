import { Component, inject, input } from '@angular/core';
import {
  OrderResult,
  OrderStatus,
  PaymentStatus,
} from '../../../../../../shared/models/orders-model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { OrderService } from '../../../../../../core/services/order-service';

@Component({
  selector: 'app-order-summary',
  imports: [DatePipe, CurrencyPipe, TagModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  private readonly _ordersService = inject(OrderService);

  order = input.required<OrderResult>();

  statusToSeverity(orderStatus: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(orderStatus);
  }
}
