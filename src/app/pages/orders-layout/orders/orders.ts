import { OrdersService } from '../../../core/services/orders-service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  OrderResult,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
} from '../../../shared/models/orders-model';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersPagination } from './orders-pagination/orders-pagination';
import { OrdersSearch } from './orders-search/orders-search';
import { OrdersSort } from './orders-sort/orders-sort';
import { OrdersFiltration } from './orders-filtration/orders-filtration';
import { TooltipModule } from 'primeng/tooltip';
import { ToasterService } from '../../../core/services/toaster-service';
import { RouterLink } from '@angular/router';
import { TagModule } from "primeng/tag";

@Component({
  selector: 'app-orders',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    OrdersPagination,
    OrdersSearch,
    OrdersSort,
    OrdersFiltration,
    TooltipModule,
    RouterLink,
    TagModule
],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly _ordersService = inject(OrdersService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toasterService = inject(ToasterService);
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

  statusToSeverity(status: OrderStatus | PaymentStatus): string {
    return this._ordersService.statusToSeverity(status);
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
