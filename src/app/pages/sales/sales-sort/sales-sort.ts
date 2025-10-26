import { Component, DestroyRef, inject } from '@angular/core';
import { SelectModule } from 'primeng/select';
import {
  SalesQueryOptions,
  SalesSortOption,
} from '../../../shared/models/sales.model';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../core/services/sales-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sales-sort',
  imports: [SelectModule, FormsModule],
  templateUrl: './sales-sort.html',
  styleUrl: './sales-sort.scss',
})
export class SalesSort {
  private readonly _salesService = inject(SalesService);
  private readonly _destroyRef = inject(DestroyRef);

  sortOption = this._salesService.sort;

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

  sort(): void {
    const sortOption = this.sortOption();

    if (!sortOption) {
      this._loadData({
        pageNumber: this._salesService.DEFAULT_PAGE_NUMBER,
        pageSize: this._salesService.pageSize(),
      });
      return;
    }

    // Reset to first page BUT keep the current page size.
    this._loadData({
      pageNumber: this._salesService.DEFAULT_PAGE_NUMBER,
      pageSize: this._salesService.pageSize(),
      sort: sortOption,
    });
  }

  private _loadData(query: SalesQueryOptions): void {
    this._salesService
      .getSales$(query)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
