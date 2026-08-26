import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AddCartItemPayload, Cart, UpdateCartItemPayload } from '../models/cart.model';

const EMPTY_CART: Cart = { items: [], totalPrice: 0 };

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  // Central cart signal so the navbar badge updates automatically
  // wherever the cart is mutated from.
  private readonly cartSignal = signal<Cart>(EMPTY_CART);
  readonly cart = this.cartSignal.asReadonly();
  readonly itemCount = computed(() =>
    this.cartSignal().items.reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor(private http: HttpClient) {}

  loadCart(): Observable<ApiResponse<{ cart: Cart }>> {
    return this.http
      .get<ApiResponse<{ cart: Cart }>>(this.apiUrl)
      .pipe(tap((res) => this.setCart(res.data?.cart)));
  }

  addItem(payload: AddCartItemPayload): Observable<ApiResponse<{ cart: Cart }>> {
    return this.http
      .post<ApiResponse<{ cart: Cart }>>(`${this.apiUrl}/items`, payload)
      .pipe(tap((res) => this.setCart(res.data?.cart)));
  }

  // Backend route is PUT /cart/items/:foodId (not PATCH /:itemId)
  updateItemQuantity(foodId: string, payload: UpdateCartItemPayload): Observable<ApiResponse<{ cart: Cart }>> {
    return this.http
      .put<ApiResponse<{ cart: Cart }>>(`${this.apiUrl}/items/${foodId}`, payload)
      .pipe(tap((res) => this.setCart(res.data?.cart)));
  }

  removeItem(foodId: string): Observable<ApiResponse<{ cart: Cart }>> {
    return this.http
      .delete<ApiResponse<{ cart: Cart }>>(`${this.apiUrl}/items/${foodId}`)
      .pipe(tap((res) => this.setCart(res.data?.cart)));
  }

  clearCart(): Observable<ApiResponse<{ cart: Cart }>> {
    return this.http
      .delete<ApiResponse<{ cart: Cart }>>(this.apiUrl)
      .pipe(tap((res) => this.setCart(res.data?.cart ?? EMPTY_CART)));
  }

  resetLocalState(): void {
    this.cartSignal.set(EMPTY_CART);
  }

  private setCart(cart?: Cart): void {
    this.cartSignal.set(cart ?? EMPTY_CART);
  }
}
