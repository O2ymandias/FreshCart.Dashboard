import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  OrderResponse,
  OrdersQueryOptions,
} from '../../shared/models/orders-model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);

  getOrders$(options: OrdersQueryOptions) {
    const url = `${environment.apiUrl}/orders`;

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDg1NGM4NS1mMmE4LTQ3ODUtYWQ1Ni03ZjE2MDdlNzMwOWEiLCJpYXQiOjE3NTk0MjQxNzYsInN1YiI6Ijc4YThjZDU2LWIzZDMtNDE1OC1hYTdhLTg1MzQyY2I0MzcyYiIsInVuaXF1ZV9uYW1lIjoiQWRtaW4iLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFwcC5mcmVzaGNhcnRAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiZXhwIjoxNzU5NDI3Nzc2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxMTUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.WpsewpoE9m_gm7kY5JXfW6rZ1pcj7tBaKwt4l1CXJQU';

    let params = new HttpParams();
    params.append('pageNumber', options.pageNumber.toString());
    params.append('pageSize', options.pageSize.toString());
    if (options.userId)
      params = params.append('userId', options.userId.toString());

    return this._httpClient.get<OrderResponse>(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  }
}
