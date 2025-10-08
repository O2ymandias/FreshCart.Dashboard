import { Component, input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { OrderResult } from '../../../models/orders-model';

@Component({
  selector: 'app-order-items',
  imports: [BadgeModule, RouterLink, CurrencyPipe],
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
  order = input.required<OrderResult>();
}
