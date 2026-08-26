import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';

// Attaches "Authorization: Bearer <token>" to every outgoing request and
// centrally reacts to auth/authorization failures returned by the backend.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cartService = inject(CartService);
  const toast = inject(ToastService);

  const token = authService.token;
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const backendMessage = error.error?.message as string | undefined;

      if (error.status === 401) {
        // Token missing/invalid/expired: clear session and send to login.
        authService.logout();
        cartService.resetLocalState();
        toast.error(backendMessage || 'Your session has expired. Please log in again.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toast.error(backendMessage || 'You are not allowed to perform this action.');
      } else if (error.status === 404) {
        toast.error(backendMessage || 'Resource not found.');
      } else if (error.status === 409) {
        toast.error(backendMessage || 'This resource already exists.');
      } else if (error.status === 400) {
        toast.error(backendMessage || 'Please check the submitted data.');
      } else if (error.status === 0) {
        toast.error('Network error: could not reach the server.');
      } else if (error.status >= 500) {
        toast.error('Server error. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};
