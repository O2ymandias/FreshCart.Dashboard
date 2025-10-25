import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SalesService } from '../../core/services/sales-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SalesSortOption } from '../../shared/models/sales.model';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SalesPagination } from './sales-pagination/sales-pagination';

@Component({
  selector: 'app-sales',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    CurrencyPipe,
    PaginatorModule,
    SalesPagination,
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class Sales implements OnInit {
  private readonly _salesService = inject(SalesService);
  private readonly _destroyRef = inject(DestroyRef);

  sales = this._salesService.sales;

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Users',
      disabled: true,
    },
  ];

  sortOptions: SalesSortOption[] = [
    {
      label: 'Units Sold: Low to High',
      value: { key: 'unitsSold', dir: 'asc' },
    },
    {
      label: 'Units Sold: High to Low',
      value: { key: 'unitsSold', dir: 'desc' },
    },
    {
      label: 'Total Sales: Low to High',
      value: { key: 'totalSales', dir: 'asc' },
    },
    {
      label: 'Total Sales: High to Low',
      value: { key: 'totalSales', dir: 'desc' },
    },
  ];
  selectedSortOption = signal<SalesSortOption | undefined>(undefined);

  ngOnInit(): void {
    this._loadData();
  }

  private _loadData(): void {
    this._salesService
      .getSales$({
        pageNumber: this._salesService.DEFAULT_PAGE_NUMBER,
        pageSize: this._salesService.DEFAULT_PAGE_SIZE,
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  refresh() {}

  sort() {}
}
