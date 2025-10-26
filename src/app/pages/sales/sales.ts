import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SalesService } from '../../core/services/sales-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SalesPagination } from './sales-pagination/sales-pagination';
import { SalesSort } from './sales-sort/sales-sort';
import { RouterLink } from '@angular/router';
import { SalesFiltration } from './sales-filtration/sales-filtration';

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
    SalesSort,
    RouterLink,
    SalesFiltration,
    DatePipe
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
      label: 'Sales',
      disabled: true,
    },
  ];

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

  refresh() {
    this._salesService.reset();
    this._loadData();
  }
}
