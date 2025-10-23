import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';
import {
  Pagination,
  SalesQueryOptions,
  SalesSummary,
} from '../../shared/models/sales.model';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly _httpClient = inject(HttpClient);

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

    return this._httpClient.get<Pagination<SalesSummary>>(url, { params });
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
