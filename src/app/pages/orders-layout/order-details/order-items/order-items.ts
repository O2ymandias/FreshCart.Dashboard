import { Component, input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { OrderResult } from '../../../../shared/models/orders-model';
import { Fieldset } from 'primeng/fieldset';
import { Card } from "primeng/card";

@Component({
  selector: 'app-order-items',
  imports: [BadgeModule, RouterLink, CurrencyPipe, Fieldset, Card],
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
  order = input.required<OrderResult>();
}
