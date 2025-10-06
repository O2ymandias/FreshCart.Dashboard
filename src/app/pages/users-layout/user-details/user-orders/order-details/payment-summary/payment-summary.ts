import { Component, input } from '@angular/core';
import { OrderResult } from '../../../../../../shared/models/orders-model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment-summary',
  imports: [CurrencyPipe],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.scss',
})
export class PaymentSummary {
  order = input.required<OrderResult>();
}
