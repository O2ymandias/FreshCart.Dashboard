import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { OrderSummary } from './order-summary/order-summary';
import { OrderShippingInfo } from './order-shipping-info/order-shipping-info';
import { OrderItems } from './order-items/order-items';
import { PaymentSummary } from './payment-summary/payment-summary';
import { OrderResult } from '../../models/orders-model';
import { OrdersService } from '../../../core/services/orders-service';

@Component({
  selector: 'app-order-details',
  imports: [OrderSummary, OrderShippingInfo, OrderItems, PaymentSummary],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<OrderResult>();
  order = signal<OrderResult | null>(null);

  private _initOrderDetails() {
    // this._ordersService.getOrders$();
  }
}
