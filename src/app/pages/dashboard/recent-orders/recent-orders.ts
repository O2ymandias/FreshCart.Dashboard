import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OrdersService } from '../../../core/services/orders-service';
import {
  OrderResult,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
} from '../../../shared/models/orders-model';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-recent-orders',
  imports: [
    CardModule,
    TableModule,
    TagModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
  ],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders implements OnInit {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  orders = signal<OrderResult[]>([]);

  ngOnInit(): void {
    this._initializeOrders();
  }

  getSeverity(status: OrderStatus | PaymentStatus) {
    return this._ordersService.statusToSeverity(status);
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
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
