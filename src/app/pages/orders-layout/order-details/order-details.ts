import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { OrderSummary } from './order-summary/order-summary';
import { OrderShippingInfo } from './order-shipping-info/order-shipping-info';
import { OrderItems } from './order-items/order-items';
import { PaymentSummary } from './payment-summary/payment-summary';
import { OrderResult } from '../../../shared/models/orders-model';
import { OrdersService } from '../../../core/services/orders-service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-order-details',
  imports: [
    OrderSummary,
    OrderShippingInfo,
    OrderItems,
    PaymentSummary,
    BreadcrumbModule,
    ButtonModule,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails implements OnInit {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<number>();
  order = signal<OrderResult | null>(null);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Orders',
      routerLink: '/orders',
    },
    {
      label: 'Order Details',
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this._initOrderDetails();
  }

  private _initOrderDetails() {
    this._ordersService
      .getOrder$(this.id())
      .pipe(
        tap((res) => this.order.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
