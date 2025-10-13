import { OrderService } from '../../core/services/order-service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  OrderResult,
  OrdersQueryOptions,
} from '../../shared/models/orders-model';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { OrderStatusSelectOptions } from '../../shared/components/order-status-select-options/order-status-select-options';
import { PaymentStatusSelectOptions } from '../../shared/components/payment-status-select-options/payment-status-select-options';
import { DialogModule } from 'primeng/dialog';
import { OrderDetails } from '../../shared/components/order-details/order-details';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tag } from 'primeng/tag';
import { OrdersPagination } from './orders-pagination/orders-pagination';
import { OrdersSearch } from './orders-search/orders-search';
import { OrdersSort } from './orders-sort/orders-sort';
import { OrdersFiltration } from './orders-filtration/orders-filtration';
import { TooltipModule } from 'primeng/tooltip';
import { ToasterService } from '../../core/services/toaster-service';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    OrderStatusSelectOptions,
    PaymentStatusSelectOptions,
    DialogModule,
    OrderDetails,
    Tag,
    OrdersPagination,
    OrdersSearch,
    OrdersSort,
    OrdersFiltration,
    TooltipModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly _ordersService = inject(OrderService);
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

  onCancelOrder(event: Event, order: OrderResult): void {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to cancel this order?`,
      header: `Cancel Order #${order.orderId}`,
      icon: 'pi pi-info-circle',

      rejectButtonProps: {
        label: 'Hide',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Cancel Order',
        severity: 'danger',
      },

      accept: () => {
        this.cancelOrder(order);
      },
    });
  }

  cancelOrder(order: OrderResult): void {
    this._ordersService
      .cancelOrder$(order.orderId, order.userId)
      .pipe(
        tap((res) => {
          if (res.manageToCancelOrder) {
            this._toasterService.success(
              res.cancelMessage ?? 'Order cancelled successfully',
            );
          }
          this.refresh();
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
