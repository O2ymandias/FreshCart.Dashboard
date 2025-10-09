import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  OrderResponse,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
} from '../../shared/models/orders-model';
import { environment } from '../../environment';
import { SaveResult } from '../../shared/models/shared.model';

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

    if (options.orderId)
      params = params.append('orderId', options.orderId.toString());

    if (options.sort) {
      params = params.append('sort.key', options.sort.key);
      params = params.append('sort.dir', options.sort.dir);
    }

    if (options.paymentStatus)
      params = params.append('paymentStatus', options.paymentStatus);

    if (options.orderStatus)
      params = params.append('orderStatus', options.orderStatus);

    return this._httpClient.get<OrderResponse>(url, { params });
  }

  updateOrderStatus$(requestData: UpdateOrderStatusRequest) {
    const url = `${environment.apiUrl}/orders/order-status`;
    return this._httpClient.put<SaveResult>(url, requestData);
  }

  updatePaymentStatus$(requestData: UpdatePaymentStatusRequest) {
    const url = `${environment.apiUrl}/orders/payment-status`;
    return this._httpClient.put<SaveResult>(url, requestData);
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
