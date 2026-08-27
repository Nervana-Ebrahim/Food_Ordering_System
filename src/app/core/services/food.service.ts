import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginationMeta } from '../models/api-response.model';
import { Food, FoodPayload, FoodQueryParams } from '../models/food.model';

export interface FoodListResult {
  foods: Food[];
  meta?: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly apiUrl = `${environment.apiUrl}/foods`;

  constructor(private http: HttpClient) {}

  getAll(query: FoodQueryParams = {}): Observable<ApiResponse<{ foods: Food[] }>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.category) params = params.set('category', query.category);
    if (query.available !== undefined) params = params.set('available', query.available);
    if (query.minPrice !== undefined) params = params.set('minPrice', query.minPrice);
    if (query.maxPrice !== undefined) params = params.set('maxPrice', query.maxPrice);
    return this.http.get<ApiResponse<{ foods: Food[] }>>(this.apiUrl, { params });
  }

  // Backend exposes search as its own endpoint: GET /foods/search?q=term
  search(term: string, page = 1, limit = 10): Observable<ApiResponse<{ foods: Food[] }>> {
    const params = new HttpParams().set('q', term).set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<{ foods: Food[] }>>(`${this.apiUrl}/search`, { params });
  }

  getById(id: string): Observable<ApiResponse<{ food: Food }>> {
    return this.http.get<ApiResponse<{ food: Food }>>(`${this.apiUrl}/${id}`);
  }

  getByCategory(categoryId: string, page = 1, limit = 10): Observable<ApiResponse<{ foods: Food[] }>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<{ foods: Food[] }>>(`${this.apiUrl}/category/${categoryId}`, { params });
  }

  // Admin only
  create(payload: FoodPayload): Observable<ApiResponse<{ food: Food }>> {
    return this.http.post<ApiResponse<{ food: Food }>>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<FoodPayload>): Observable<ApiResponse<{ food: Food }>> {
    return this.http.put<ApiResponse<{ food: Food }>>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
