import { Component, input } from '@angular/core';
import { OrderResult } from '../../../../../shared/models/orders-model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Badge } from 'primeng/badge';
import { OrderSummary } from './order-summary/order-summary';
import { OrderShippingInfo } from './order-shipping-info/order-shipping-info';

@Component({
  selector: 'app-order-details',
  imports: [CurrencyPipe, RouterLink, Badge, OrderSummary, OrderShippingInfo],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  order = input.required<OrderResult>();
}
