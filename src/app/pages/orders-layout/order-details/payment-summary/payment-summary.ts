import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderResult } from '../../../../shared/models/orders-model';
import { FieldsetModule } from "primeng/fieldset";

@Component({
  selector: 'app-payment-summary',
  imports: [CurrencyPipe, FieldsetModule],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.scss',
})
export class PaymentSummary {
  order = input.required<OrderResult>();
}
