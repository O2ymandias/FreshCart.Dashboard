import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly _httpClient = inject(HttpClient);

  getTotalSales$(totalSalesQueryOptions: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const url = `${environment.apiUrl}/sales/total`;
    let params = new HttpParams();
    if (totalSalesQueryOptions.userId) {
      params = params.append('userId', totalSalesQueryOptions.userId);
    }
    if (totalSalesQueryOptions.startDate) {
      params = params.append('startDate', totalSalesQueryOptions.startDate);
    }
    if (totalSalesQueryOptions.endDate) {
      params = params.append('endDate', totalSalesQueryOptions.endDate);
    }
    return this._httpClient.get<number>(url, { params });
  }
}
