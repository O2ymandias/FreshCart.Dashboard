import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  OrderResponse,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
} from '../../shared/models/orders-model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);

  getOrders$(options: OrdersQueryOptions) {
    const url = `${environment.apiUrl}/orders`;

    let params = new HttpParams()
      .append('pageNumber', options.pageNumber.toString())
      .append('pageSize', options.pageSize.toString());

    if (options.userId)
      params = params.append('userId', options.userId.toString());

    return this._httpClient.get<OrderResponse>(url, { params });
  }

  statusToSeverity(status: OrderStatus | PaymentStatus): string {
    switch (status) {
      case 'Pending':
        return 'primary';

      case 'Processing':
      case 'AwaitingPayment':
        return 'info';

      case 'Shipped':
        return 'secondary';

      case 'Delivered':
      case 'PaymentReceived':
        return 'success';

      case 'Cancelled':
      case 'PaymentFailed':
        return 'danger';

      default:
        return 'primary';
    }
  }
}
