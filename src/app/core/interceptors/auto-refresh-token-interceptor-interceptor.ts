import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environment';

export const autoRefreshTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Auth endpoints that should not trigger token refresh
  const authEndpoints = [
    `${environment.apiUrl}/auth/refresh-token`,
    `${environment.apiUrl}/auth/revoke-token`,
    `${environment.apiUrl}/auth/login`,
  ];

  // Check if this request is to an auth endpoint
  const isAuthEndPoint = authEndpoints.some((endpoint) =>
    req.url.includes(endpoint),
  );

  // Skip auto-refresh for auth endpoints to prevent infinite loops
  if (isAuthEndPoint) return next(req);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 Unauthorized errors when user has a token
      if (error.status === 401 && authService.jwtToken()) {
        console.log('Token expired, attempting refresh...');

        // Attempt to refresh the token
        return authService.refreshToken$().pipe(
          switchMap((res) => {
            console.log('Token refreshed successfully, retrying request');

            // Clone the original request with the new token
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`,
              },
            });

            // Retry the original request with the new token
            return next(clonedReq);
          }),

          catchError((refreshError) => {
            console.error('Token refresh failed:', refreshError);

            // Token refresh failed - this means:
            // 1. Refresh token is expired/invalid (user needs to login)
            // 2. Network error
            // 3. Server error

            // The refreshToken() method already clears tokens on 401/400
            // So we just need to redirect to login
            router.navigate(['/login'], {
              queryParams: { returnUrl: router.url },
            });

            return throwError(() => refreshError);
          }),
        );
      }

      // For all other errors, just return the error
      return throwError(() => error);
    }),
  );
};
