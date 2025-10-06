import { Component, input } from '@angular/core';
import { OrderResult } from '../../../../../shared/models/orders-model';
import { OrderSummary } from './order-summary/order-summary';
import { OrderShippingInfo } from './order-shipping-info/order-shipping-info';
import { OrderItems } from './order-items/order-items';
import { PaymentSummary } from './payment-summary/payment-summary';

@Component({
  selector: 'app-order-details',
  imports: [OrderSummary, OrderShippingInfo, OrderItems, PaymentSummary],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  order = input.required<OrderResult>();
}
