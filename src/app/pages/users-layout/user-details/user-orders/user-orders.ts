import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { OrderService } from '../../../../core/services/order-service';
import {
  OrderResult,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
} from '../../../../shared/models/orders-model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe, isPlatformServer } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { OrderDetails } from './order-details/order-details';

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
    OrderDetails,
  ],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.scss',
})
export class UserOrders {
  private readonly _ordersService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

  userId = input.required<string>();
  orders = signal<OrderResult[]>([]);

  selectedOrder = signal<OrderResult | null>(null);
  showOrderDetails = signal(false);

  // Pagination
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  totalRecords = signal(0);
  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    this.DEFAULT_PAGE_SIZE * 0.5,
    this.DEFAULT_PAGE_SIZE * 1,
    this.DEFAULT_PAGE_SIZE * 2,
  ];

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) return;

    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
      userId: this.userId(),
    });
  }

  onSelectOrder(order: OrderResult): void {
    this.selectedOrder.set(order);
    this.showOrderDetails.set(true);
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

  statusToSeverity(status: OrderStatus | PaymentStatus): string {
    switch (status) {
      case 'Pending':
        return 'primary';

      case 'Processing':
      case 'AwaitingPayment':
        return 'info';

      case 'Shipped':
        return 'secondary';

      case 'Delivered':
      case 'PaymentReceived':
        return 'success';

      case 'Cancelled':
      case 'PaymentFailed':
        return 'danger';

      default:
        return 'primary';
    }
  }
}
