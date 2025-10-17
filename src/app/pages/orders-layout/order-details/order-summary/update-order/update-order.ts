import { Component, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UpdateOrderStatus } from './update-order-status/update-order-status';
import { OrderResult } from '../../../../../shared/models/orders-model';
import { DialogModule } from 'primeng/dialog';
import { UpdatePaymentStatus } from "./update-payment-status/update-payment-status";
import { MessageModule } from "primeng/message";

@Component({
  selector: 'app-update-order',
  imports: [ButtonModule, DialogModule, UpdateOrderStatus, UpdatePaymentStatus, MessageModule],
  templateUrl: './update-order.html',
  styleUrl: './update-order.scss',
})
export class UpdateOrder {
  order = input.required<OrderResult>();
  visible = signal(false);
}
