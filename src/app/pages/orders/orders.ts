import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  OrderResult,
  OrderSortOption,
  OrdersQueryOptions,
  OrderStatus,
} from '../../shared/models/orders-model';
import { OrderService } from '../../core/services/order-service';
import { MenuItem } from 'primeng/api';
import { OrderStatusSelectOptions } from '../../shared/components/order-status-select-options/order-status-select-options';
import { PaymentStatusSelectOptions } from '../../shared/components/payment-status-select-options/payment-status-select-options';
import { DialogModule } from 'primeng/dialog';
import { OrderDetails } from '../../shared/components/order-details/order-details';
import { catchError, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../../core/services/toaster-service';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { FiltrationDrawer } from './filtration-drawer/filtration-drawer';

@Component({
  selector: 'app-orders',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    InputGroup,
    FormsModule,
    SelectModule,
    InputGroupAddonModule,
    PaginatorModule,
    CurrencyPipe,
    DatePipe,
    OrderStatusSelectOptions,
    PaymentStatusSelectOptions,
    DialogModule,
    OrderDetails,
    InputNumberModule,
    Tag,
    MultiSelectModule,
    FiltrationDrawer,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly _ordersService = inject(OrderService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_PAGE_SIZE = 10;

  orders = signal<OrderResult[]>([]);

  // Search Query
  searchByOrderId = signal<number | undefined>(undefined);

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

  orderToView = signal<OrderResult | null>(null);
  showOrderToViewDialog = signal(false);

  // Sort
  sortOptions: OrderSortOption[] = [
    {
      label: 'Created At: New to Old',
      value: {
        key: 'createdAt',
        dir: 'desc',
      },
    },
    {
      label: 'Created At: Old to New',
      value: {
        key: 'createdAt',
        dir: 'asc',
      },
    },
    {
      label: 'SubTotal: High to Low',
      value: {
        key: 'subTotal',
        dir: 'desc',
      },
    },
    {
      label: 'SubTotal: Low to High',
      value: {
        key: 'subTotal',
        dir: 'asc',
      },
    },
  ];
  selectedSortOption = signal<OrderSortOption | null>(null);

  // Filter by
  selectedOrderStatus = signal<
    { label: string; value: OrderStatus } | undefined
  >(undefined);
  selectedPaymentStatus = signal<string | null>(null);
  selectedPaymentMethod = signal<string | null>(null);

  OrderStatusOptions: { label: string; value: OrderStatus }[] = [
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'Processing',
      value: 'Processing',
    },
    {
      label: 'Shipped',
      value: 'Shipped',
    },
    {
      label: 'Delivered',
      value: 'Delivered',
    },
    {
      label: 'Cancelled',
      value: 'Cancelled',
    },
  ];

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Orders',
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });
  }

  onPageChange(event: PaginatorState): void {
    let pageNumber = this.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    // Considers: searchByOrderId and sort options
    const orderId = this.searchByOrderId();

    const sortOption = this.selectedSortOption();
    const sort = sortOption
      ? { key: sortOption.value.key, dir: sortOption.value.dir }
      : undefined;

    this._loadOrders({
      pageNumber,
      pageSize,
      orderId,
      sort,
    });
  }

  search(): void {
    // Reset the sort option
    this.selectedSortOption.set(null);

    // Reset to first page BUT keep the current page size.
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      orderId: this.searchByOrderId(),
    });
  }

  refresh(): void {
    // Reset the search query.
    this.searchByOrderId.set(undefined);

    // Reset the sort option.
    this.selectedSortOption.set(null);

    // Reset to first page.
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });
  }

  sort(): void {
    const sortOption = this.selectedSortOption();
    if (!sortOption) {
      this._loadOrders({
        pageNumber: this.DEFAULT_PAGE_NUMBER,
        pageSize: this.pageSize(),
        orderId: this.searchByOrderId(),
      });
      return;
    }

    const { key, dir } = sortOption.value;

    // Reset to first page BUT keep the current page size.
    // Keep the current search query.
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      orderId: this.searchByOrderId(),
      sort: { key, dir },
    });
  }

  viewOrder(order: OrderResult): void {
    this.orderToView.set(order);
    this.showOrderToViewDialog.set(true);
  }

  filterByOrderStatus(): void {
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      orderId: this.searchByOrderId(),
      orderStatus: this.selectedOrderStatus()?.value,
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
        catchError((err: HttpErrorResponse) => {
          let errorMessage = err.message;
          if (err.error.errors) {
            errorMessage = err.error.errors.join(', ');
          }
          this._toasterService.error(errorMessage);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
