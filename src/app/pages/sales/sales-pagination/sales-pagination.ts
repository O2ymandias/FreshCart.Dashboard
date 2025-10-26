import { Component, computed, DestroyRef, inject } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SalesService } from '../../../core/services/sales-service';
import { SalesQueryOptions } from '../../../shared/models/sales.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sales-pagination',
  imports: [PaginatorModule],
  templateUrl: './sales-pagination.html',
  styleUrl: './sales-pagination.scss',
})
export class SalesPagination {
  private readonly _salesService = inject(SalesService);
  private readonly _destroyRef = inject(DestroyRef);

  pageNumber = this._salesService.pageNumber;
  pageSize = this._salesService.pageSize;
  totalRecords = this._salesService.totalRecords;
  first = computed(() => (this.pageNumber() - 1) * this.pageSize());
  rowsPerPageOptions = [
    this._salesService.DEFAULT_PAGE_SIZE * 0.5,
    this._salesService.DEFAULT_PAGE_SIZE * 1,
    this._salesService.DEFAULT_PAGE_SIZE * 2,
  ];

  sort = this._salesService.sort;

  onPageChange(event: PaginatorState): void {
    let pageNumber = this._salesService.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this._salesService.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    const query: SalesQueryOptions = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    };

    // Consider:
    // [1] Sort
    const sort = this.sort();
    if (sort) query.sort = sort;

    this._loadData(query);
  }

  private _loadData(query: SalesQueryOptions): void {
    this._salesService
      .getSales$(query)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
