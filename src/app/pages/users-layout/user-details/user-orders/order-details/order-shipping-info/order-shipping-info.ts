import { Component, inject, input } from '@angular/core';
import {
  OrderResult,
  OrderStatus,
  PaymentStatus,
} from '../../../../../../shared/models/orders-model';
import { TagModule } from 'primeng/tag';
import { OrderService } from '../../../../../../core/services/order-service';

@Component({
  selector: 'app-order-shipping-info',
  imports: [TagModule],
  templateUrl: './order-shipping-info.html',
  styleUrl: './order-shipping-info.scss',
})
export class OrderShippingInfo {
  private readonly _ordersService = inject(OrderService);
  order = input.required<OrderResult>();

  statusToSeverity(orderStatus: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(orderStatus);
  }
}
