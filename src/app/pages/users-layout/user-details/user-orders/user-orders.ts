import {
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
} from './../../../../shared/models/orders-model';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { OrdersService } from '../../../../core/services/orders-service';
import { OrderResult } from '../../../../shared/models/orders-model';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe, isPlatformServer } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Card } from "primeng/card";

@Component({
  selector: 'app-user-orders',
  imports: [
    TableModule,
    PaginatorModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    TagModule,
    MessageModule,
    DialogModule,
    SelectModule,
    FormsModule,
    RouterLink,
    Card
],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.scss',
})
export class UserOrders {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

  userId = input.required<string>();
  orders = signal<OrderResult[]>([]);

  // Pagination
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  totalRecords = signal(0);
  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    this._ordersService.DEFAULT_PAGE_SIZE * 0.5,
    this._ordersService.DEFAULT_PAGE_SIZE,
    this._ordersService.DEFAULT_PAGE_SIZE * 2,
  ];

  // View Order
  orderToView = signal<OrderResult | null>(null);
  showOrderToViewDialog = signal(false);

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) return;

    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
      userId: this.userId(),
    });
  }

  onViewOrder(order: OrderResult): void {
    this.orderToView.set(order);
    this.showOrderToViewDialog.set(true);
  }

  onPageChange(event: PaginatorState): void {
    let pageNumber = this.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    this._loadOrders({
      pageNumber,
      pageSize,
    });
  }

  private _loadOrders(options: OrdersQueryOptions): void {
    this._ordersService
      .getOrders$(options)
      .pipe(
        tap((res) => {
          this.orders.set(res.results);
          this.pageNumber.set(res.pageNumber);
          this.pageSize.set(res.pageSize);
          this.totalRecords.set(res.total);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  statusToSeverity(status: OrderStatus | PaymentStatus): string {
    return this._ordersService.statusToSeverity(status);
  }
}
