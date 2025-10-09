import { OrderService } from './../../core/services/order-service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderResult } from '../../shared/models/orders-model';
import { MenuItem } from 'primeng/api';
import { OrderStatusSelectOptions } from '../../shared/components/order-status-select-options/order-status-select-options';
import { PaymentStatusSelectOptions } from '../../shared/components/payment-status-select-options/payment-status-select-options';
import { DialogModule } from 'primeng/dialog';
import { OrderDetails } from '../../shared/components/order-details/order-details';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToasterService } from '../../core/services/toaster-service';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { FiltrationDrawer } from './filtration-drawer/filtration-drawer';
import { OrdersPagination } from './orders-pagination/orders-pagination';
import { OrdersSearch } from './orders-search/orders-search';
import { OrdersSort } from './orders-sort/orders-sort';

@Component({
  selector: 'app-orders',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
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
    OrdersPagination,
    OrdersSearch,
    OrdersSort,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly _ordersService = inject(OrderService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  // Orders
  orders = this._ordersService.orders;

  // Search Query
  searchByOrderId = this._ordersService.searchByOrderId;

  // Pagination
  pageSize = this._ordersService.pageSize;
  pageNumber = this._ordersService.pageNumber;
  totalRecords = this._ordersService.totalRecords;

  // Sort
  selectedSortOption = this._ordersService.selectedSortOption;

  orderToView = signal<OrderResult | null>(null);
  showOrderToViewDialog = signal(false);

  // Filter by
  // selectedOrderStatus = signal<
  //   { label: string; value: OrderStatus } | undefined
  // >(undefined);
  // selectedPaymentStatus = signal<string | null>(null);
  // selectedPaymentMethod = signal<string | null>(null);

  // OrderStatusOptions: { label: string; value: OrderStatus }[] = [
  //   {
  //     label: 'Pending',
  //     value: 'Pending',
  //   },
  //   {
  //     label: 'Processing',
  //     value: 'Processing',
  //   },
  //   {
  //     label: 'Shipped',
  //     value: 'Shipped',
  //   },
  //   {
  //     label: 'Delivered',
  //     value: 'Delivered',
  //   },
  //   {
  //     label: 'Cancelled',
  //     value: 'Cancelled',
  //   },
  // ];

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
    this._ordersService
      .getOrders$({
        pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
        pageSize: this._ordersService.DEFAULT_PAGE_SIZE,
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  refresh(): void {
    this._ordersService
      .reset$()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  viewOrder(order: OrderResult): void {
    this.orderToView.set(order);
    this.showOrderToViewDialog.set(true);
  }

  // filterByOrderStatus(): void {
  //   this._loadOrders({
  //     pageNumber: this.DEFAULT_PAGE_NUMBER,
  //     pageSize: this.pageSize(),
  //     orderId: this.searchByOrderId(),
  //     orderStatus: this.selectedOrderStatus()?.value,
  //   });
  // }
}
