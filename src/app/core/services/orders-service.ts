import {
  OrderStatusOption,
  PaymentMethod,
  PaymentMethodOption,
  PaymentStatusOption,
} from '../../shared/models/orders-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  OrderResponse,
  OrderResult,
  OrderSortOption,
  OrdersQueryOptions,
  OrderStatus,
  PaymentStatus,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
} from '../../shared/models/orders-model';
import { environment } from '../../environment';
import { SaveResult } from '../../shared/models/shared.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly _httpClient = inject(HttpClient);

  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

  orders = signal<OrderResult[]>([]);

  // Pagination
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  totalRecords = signal(0);

  // Search
  searchQuery = signal<string | undefined>(undefined);

  // Sort
  sortOption = signal<OrderSortOption | undefined>(undefined);

  // Filtration
  orderStatusOption = signal<OrderStatusOption | undefined>(undefined);
  paymentStatusOption = signal<PaymentStatusOption | undefined>(undefined);
  paymentMethodOption = signal<PaymentMethodOption | undefined>(undefined);
  minSubTotal = signal<number | undefined>(undefined);
  maxSubTotal = signal<number | undefined>(undefined);

  getOrders$(options: OrdersQueryOptions) {
    const url = `${environment.apiUrl}/orders`;

    let params = new HttpParams()
      .append('pageNumber', options.pageNumber.toString())
      .append('pageSize', options.pageSize.toString());

    if (options.search) params = params.append('search', options.search);

    if (options.userId)
      params = params.append('userId', options.userId.toString());

    if (options.orderId)
      params = params.append('orderId', options.orderId.toString());

    if (options.sort) {
      params = params.append('sort.key', options.sort.key);
      params = params.append('sort.dir', options.sort.dir);
    }

    if (options.orderStatus)
      params = params.append('orderStatus', options.orderStatus);

    if (options.paymentStatus)
      params = params.append('paymentStatus', options.paymentStatus);

    if (options.paymentMethod)
      params = params.append('paymentMethod', options.paymentMethod);

    if (options.minSubTotal)
      params = params.append('minSubTotal', options.minSubTotal.toString());

    if (options.maxSubTotal)
      params = params.append('maxSubTotal', options.maxSubTotal.toString());

    if (options.startDate)
      params = params.append('startDate', options.startDate);

    if (options.endDate) params = params.append('endDate', options.endDate);

    return this._httpClient.get<OrderResponse>(url, { params }).pipe(
      tap((res) => {
        this.orders.set(res.results);
        this.pageSize.set(res.pageSize);
        this.pageNumber.set(res.pageNumber);
        this.totalRecords.set(res.total);
      }),
    );
  }

  getOrder$(orderId: number) {
    const url = `${environment.apiUrl}/orders/${orderId}`;
    return this._httpClient.get<OrderResult>(url);
  }

  getOrdersCount$(options?: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
  }) {
    const url = `${environment.apiUrl}/orders/count`;

    let params = new HttpParams();

    if (options) {
      const { orderStatus, paymentStatus, paymentMethod } = options;
      if (orderStatus) params = params.append('orderStatus', orderStatus);
      if (paymentStatus) params = params.append('paymentStatus', paymentStatus);
      if (paymentMethod) params = params.append('paymentMethod', paymentMethod);
    }

    return this._httpClient.get<number>(url, { params });
  }

  updateOrderStatus$(requestData: UpdateOrderStatusRequest) {
    const url = `${environment.apiUrl}/orders/order-status`;
    return this._httpClient.put<SaveResult>(url, requestData);
  }

  updatePaymentStatus$(requestData: UpdatePaymentStatusRequest) {
    const url = `${environment.apiUrl}/orders/payment-status`;
    return this._httpClient.put<SaveResult>(url, requestData);
  }

  reset() {
    this.orders.set([]);
    this.pageSize.set(this.DEFAULT_PAGE_SIZE);
    this.pageNumber.set(this.DEFAULT_PAGE_NUMBER);
    this.totalRecords.set(0);
    this.searchQuery.set(undefined);
    this.sortOption.set(undefined);
    this.orderStatusOption.set(undefined);
    this.paymentStatusOption.set(undefined);
    this.paymentMethodOption.set(undefined);
    this.minSubTotal.set(undefined);
    this.maxSubTotal.set(undefined);
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
