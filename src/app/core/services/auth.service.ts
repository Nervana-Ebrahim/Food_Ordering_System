import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResult, LoginPayload, RegisterPayload, User } from '../models/user.model';

const TOKEN_KEY = 'food_ordering_token';
const USER_KEY = 'food_ordering_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signals hold the live authentication state for the whole app.
  private readonly currentUserSignal = signal<User | null>(this.readStoredUser());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  // The frontend reads the role only for UI convenience (menus/routes);
  // the backend remains the final authority on every protected request.
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'Admin');

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return this.tokenSignal();
  }

  register(payload: RegisterPayload): Observable<ApiResponse<AuthResult>> {
    return this.http
      .post<ApiResponse<AuthResult>>(`${this.apiUrl}/register`, payload)
      .pipe(tap((res) => this.persistSession(res.data)));
  }

  login(payload: LoginPayload): Observable<ApiResponse<AuthResult>> {
    return this.http
      .post<ApiResponse<AuthResult>>(`${this.apiUrl}/login`, payload)
      .pipe(tap((res) => this.persistSession(res.data)));
  }

  fetchMe(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res.data?.user) {
          this.currentUserSignal.set(res.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
      })
    );
  }

  updateLocalUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private persistSession(data?: AuthResult): void {
    if (!data) return;
    this.tokenSignal.set(data.token);
    this.currentUserSignal.set(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
