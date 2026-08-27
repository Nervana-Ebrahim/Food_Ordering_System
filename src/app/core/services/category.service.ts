import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category, CategoryPayload } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<{ categories: Category[] }>> {
    return this.http.get<ApiResponse<{ categories: Category[] }>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<{ category: Category }>> {
    return this.http.get<ApiResponse<{ category: Category }>>(`${this.apiUrl}/${id}`);
  }

  // Admin only
  create(payload: CategoryPayload): Observable<ApiResponse<{ category: Category }>> {
    return this.http.post<ApiResponse<{ category: Category }>>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<CategoryPayload>): Observable<ApiResponse<{ category: Category }>> {
    return this.http.put<ApiResponse<{ category: Category }>>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
