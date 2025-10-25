import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environment';
import {
  Pagination,
  SalesQueryOptions,
  SalesSummary,
} from '../../shared/models/sales.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  // Dependencies
  private readonly _httpClient = inject(HttpClient);

  // Constants
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

  sales = signal<SalesSummary[]>([]);

  // Pagination
  pageNumber = signal<number>(this.DEFAULT_PAGE_NUMBER);
  pageSize = signal<number>(this.DEFAULT_PAGE_SIZE);
  totalRecords = signal<number>(0);

  getSales$(salesQueryOptions: SalesQueryOptions) {
    const url = `${environment.apiUrl}/sales`;
    let params = new HttpParams()
      .set('pageNumber', salesQueryOptions.pageNumber.toString())
      .set('pageSize', salesQueryOptions.pageSize.toString());

    if (salesQueryOptions.sort)
      params = params
        .set('sort.key', salesQueryOptions.sort.key)
        .set('sort.dir', salesQueryOptions.sort.dir);

    if (salesQueryOptions.startDate)
      params = params.set('startDate', salesQueryOptions.startDate);

    if (salesQueryOptions.endDate)
      params = params.set('endDate', salesQueryOptions.endDate);

    return this._httpClient.get<Pagination<SalesSummary>>(url, { params }).pipe(
      tap((res) => {
        this.sales.set(res.results);
        this.pageNumber.set(res.pageNumber);
        this.pageSize.set(res.pageSize);
        this.totalRecords.set(res.total);
      }),
    );
  }

  getTotalSales$(totalSalesQueryOptions: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const url = `${environment.apiUrl}/sales/total`;
    let params = new HttpParams();
    if (totalSalesQueryOptions.userId) {
      params = params.set('userId', totalSalesQueryOptions.userId);
    }
    if (totalSalesQueryOptions.startDate) {
      params = params.set('startDate', totalSalesQueryOptions.startDate);
    }
    if (totalSalesQueryOptions.endDate) {
      params = params.set('endDate', totalSalesQueryOptions.endDate);
    }
    return this._httpClient.get<number>(url, { params });
  }
}
