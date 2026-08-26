export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash' | 'Card';

export interface OrderItem {
  food: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  totalPrice: number;
  address: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  address: string;
  paymentMethod: PaymentMethod;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'OutForDelivery',
  'Delivered',
];
