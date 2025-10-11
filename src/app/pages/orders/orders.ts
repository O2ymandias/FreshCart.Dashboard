import { OrderService } from '../../core/services/Orders/order-service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  OrderResult,
  OrdersQueryOptions,
} from '../../shared/models/orders-model';
import { MenuItem } from 'primeng/api';
import { OrderStatusSelectOptions } from '../../shared/components/order-status-select-options/order-status-select-options';
import { PaymentStatusSelectOptions } from '../../shared/components/payment-status-select-options/payment-status-select-options';
import { DialogModule } from 'primeng/dialog';
import { OrderDetails } from '../../shared/components/order-details/order-details';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrdersPagination } from './orders-pagination/orders-pagination';
import { OrdersSearch } from './orders-search/orders-search';
import { OrdersSort } from './orders-sort/orders-sort';
import { OrdersFiltration } from './orders-filtration/orders-filtration';

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
    OrdersPagination,
    OrdersSearch,
    OrdersSort,
    OrdersFiltration,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly _ordersService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  // Orders
  orders = this._ordersService.orders;

  orderToView = signal<OrderResult | null>(null);
  showOrderToViewDialog = signal(false);

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
    this._loadInitialOrders();
  }

  refresh(): void {
    this._ordersService.reset();
    this._loadInitialOrders();
  }

  viewOrder(order: OrderResult): void {
    this.orderToView.set(order);
    this.showOrderToViewDialog.set(true);
  }

  private _loadInitialOrders(): void {
    const options: OrdersQueryOptions = {
      pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
      pageSize: this._ordersService.DEFAULT_PAGE_SIZE,
    };

    this._ordersService
      .getOrders$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
