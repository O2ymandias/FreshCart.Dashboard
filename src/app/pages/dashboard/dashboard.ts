import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { OrdersService } from '../../core/services/orders-service';
import {
  OrderResult,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
} from '../../shared/models/orders-model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EmailLink } from "../../shared/components/email-link/email-link";

@Component({
  selector: 'app-dashboard',
  imports: [
    CardModule,
    TableModule,
    TagModule,
    ChartModule,
    CurrencyPipe,
    RouterLink,
    ButtonModule,
    DatePipe,
    EmailLink
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  orders = signal<OrderResult[]>([]);

  ngOnInit() {
    this._initializeOrders();
  }

  private _initializeOrders() {
    const query: OrdersQueryOptions = {
      pageNumber: 1,
      pageSize: 5,
      sort: { key: 'createdAt', dir: 'desc' },
    };

    this._ordersService
      .getOrders$(query)
      .pipe(
        tap((res) => this.orders.set(res.results)),
        tap((res) => console.log(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  getSeverity(status: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(status);
  }
}
