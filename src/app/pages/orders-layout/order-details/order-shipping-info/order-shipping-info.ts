import { Component, inject, input } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { OrdersService } from '../../../../core/services/orders-service';
import {
  OrderResult,
  OrderStatus,
  PaymentStatus,
} from '../../../../shared/models/orders-model';
import { FieldsetModule } from 'primeng/fieldset';
import { EmailLink } from './email-link/email-link';
import { PhoneLink } from './phone-link/phone-link';

@Component({
  selector: 'app-order-shipping-info',
  imports: [TagModule, FieldsetModule, EmailLink, PhoneLink],
  templateUrl: './order-shipping-info.html',
  styleUrl: './order-shipping-info.scss',
})
export class OrderShippingInfo {
  private readonly _ordersService = inject(OrdersService);
  order = input.required<OrderResult>();

  statusToSeverity(orderStatus: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(orderStatus);
  }
}
