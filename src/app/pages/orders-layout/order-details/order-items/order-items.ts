import { Component, input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass } from '@angular/common';
import { OrderResult } from '../../../../shared/models/orders-model';
import { Fieldset } from 'primeng/fieldset';

@Component({
  selector: 'app-order-items',
  imports: [BadgeModule, RouterLink, CurrencyPipe, Fieldset, NgClass],
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
  order = input.required<OrderResult>();
  productId = input<number>();

  ngOnInit(): void {
    console.log('Highlighted Product ID:', this.productId());
  }
}
