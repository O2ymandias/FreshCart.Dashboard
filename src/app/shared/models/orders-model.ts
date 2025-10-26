import { SortDirection } from './shared.model';

export type OrdersQueryOptions = {
  pageNumber: number;
  pageSize: number;

  search?: string;

  userId?: string;
  orderId?: number;

  sort?: {
    key: OrderSortKey;
    dir: SortDirection;
  };

  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
  paymentMethod?: PaymentMethod;

  minSubTotal?: number;
  maxSubTotal?: number;

  startDate?: string;
  endDate?: string;
};

export type OrderSortKey = 'createdAt' | 'subTotal';

export type OrderResult = {
  orderId: number;
  userEmail: string;
  orderDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  deliveryMethodCost: number;
  items: OrderItem[];
  subTotal: number;
  total: number;
  isCancellable: boolean;
  checkoutSessionId: string;
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
  total: number;
};

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Pending'
  | 'AwaitingPayment'
  | 'PaymentReceived'
  | 'PaymentFailed';

export type PaymentMethod = 'Cash' | 'Online';

export type ShippingAddress = {
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  country: string;
};

export type UpdateOrderStatusRequest = {
  orderId: number;
  newOrderStatus: OrderStatus;
};

export type UpdatePaymentStatusRequest = {
  orderId: number;
  newPaymentStatus: PaymentStatus;
};

export type OrderSort = {
  key: OrderSortKey;
  dir: SortDirection;
};

export type OrderSortOption = {
  label: string;
  value: {
    key: OrderSortKey;
    dir: SortDirection;
  };
};

export type OrderStatusOption = {
  label: string;
  value: OrderStatus;
};

export type PaymentStatusOption = {
  label: string;
  value: PaymentStatus;
};

export type PaymentMethodOption = {
  label: string;
  value: PaymentMethod;
};

export type CancelOrderResult = {
  manageToCancelOrder: boolean;
  manageToExpireSession: boolean | null;
  cancelMessage: string | null;
  expireMessage: string | null;
};

export type StatusCount<T> = {
  status: T;
  count: number;
};
