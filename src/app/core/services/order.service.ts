import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrderPayload, Order, OrderQueryParams, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(payload: CreateOrderPayload): Observable<ApiResponse<{ order: Order }>> {
    return this.http.post<ApiResponse<{ order: Order }>>(this.apiUrl, payload);
  }

  getMyOrders(query: OrderQueryParams = {}): Observable<ApiResponse<{ orders: Order[] }>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.status) params = params.set('status', query.status);
    return this.http.get<ApiResponse<{ orders: Order[] }>>(`${this.apiUrl}/my`, { params });
  }

  getById(id: string): Observable<ApiResponse<{ order: Order }>> {
    return this.http.get<ApiResponse<{ order: Order }>>(`${this.apiUrl}/${id}`);
  }

  cancelOrder(id: string): Observable<ApiResponse<{ order: Order }>> {
    return this.http.patch<ApiResponse<{ order: Order }>>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Admin only
  getAllOrders(query: OrderQueryParams = {}): Observable<ApiResponse<{ orders: Order[] }>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.status) params = params.set('status', query.status);
    return this.http.get<ApiResponse<{ orders: Order[] }>>(this.apiUrl, { params });
  }

  updateStatus(id: string, status: OrderStatus): Observable<ApiResponse<{ order: Order }>> {
    return this.http.patch<ApiResponse<{ order: Order }>>(`${this.apiUrl}/${id}/status`, { status });
  }
}
