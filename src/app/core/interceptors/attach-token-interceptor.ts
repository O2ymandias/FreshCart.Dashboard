import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth/auth-service';
import { inject } from '@angular/core';

export const attachTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.jwtToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
