import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  OrderResult,
  OrdersQueryOptions,
} from '../../shared/models/orders-model';
import { OrderService } from '../../core/services/order-service';
import { MenuItem } from 'primeng/api';
import { OrderStatusSelectOptions } from '../../shared/components/order-status-select-options/order-status-select-options';
import { PaymentStatusSelectOptions } from '../../shared/components/payment-status-select-options/payment-status-select-options';
import { DialogModule } from 'primeng/dialog';
import { OrderDetails } from '../../shared/components/order-details/order-details';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-orders',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    RouterLink,
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
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly _ordersService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_PAGE_SIZE = 10;

  orders = signal<OrderResult[]>([]);

  // Search Query
  // searchQuery = signal('');

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
  // sortOptions: ProductSortOption[] = [
  //   {
  //     label: 'Name: A to Z',
  //     value: {
  //       key: 'name',
  //       dir: 'asc',
  //     },
  //   },
  //   {
  //     label: 'Name: Z to A',
  //     value: {
  //       key: 'name',
  //       dir: 'desc',
  //     },
  //   },
  //   {
  //     label: 'Price: High to Low',
  //     value: {
  //       key: 'price',
  //       dir: 'desc',
  //     },
  //   },
  //   {
  //     label: 'Price: Low to High',
  //     value: {
  //       key: 'price',
  //       dir: 'asc',
  //     },
  //   },
  //   {
  //     label: 'Stock: Low to High',
  //     value: {
  //       key: 'unitsInStock',
  //       dir: 'asc',
  //     },
  //   },
  //   {
  //     label: 'Stock: High to Low',
  //     value: {
  //       key: 'unitsInStock',
  //       dir: 'desc',
  //     },
  //   },
  // ];
  // selectedSortOption = signal<ProductSortOption | null>(null);

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

    // Considers: search query and sort options
    // const search = this.searchQuery();
    // const sortOption = this.selectedSortOption();
    // const sort = sortOption
    //   ? { key: sortOption.value.key, dir: sortOption.value.dir }
    //   : undefined;

    this._loadOrders({
      pageNumber,
      pageSize,
      // search,
      // sort,
    });
  }

  search(): void {
    // Reset the sort option
    // this.selectedSortOption.set(null);

    // Reset to first page BUT keep the current page size.
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      // search: this.searchQuery(),
    });
  }

  refresh(): void {
    // Reset the search query.
    // this.searchQuery.set('');

    // Reset the sort option.
    // this.selectedSortOption.set(null);

    // Reset to first page.
    this._loadOrders({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });
  }

  // sort(): void {
  //   const sortOption = this.selectedSortOption();
  //   if (!sortOption) return;

  //   const { key, dir } = sortOption.value;

  //   // Reset to first page BUT keep the current page size.
  //   // Keep the current search query.
  //   this._loadProducts({
  //     pageNumber: this.DEFAULT_PAGE_NUMBER,
  //     pageSize: this.pageSize(),
  //     search: this.searchQuery(),
  //     sort: { key, dir },
  //   });
  // }

  viewOrder(order: OrderResult): void {
    this.orderToView.set(order);
    this.showOrderToViewDialog.set(true);
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
}
