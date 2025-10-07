import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';
import {
  AuthResponse,
  JwtPayload,
  LoginRequestData,
} from '../../../shared/models/auth.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

  jwtToken = signal<string | null>(null);
  refreshTokenExpiresOn = signal<Date | null>(null);

  isAuthenticated = computed(() => {
    const token = this.jwtToken();
    if (!token) return false;

    const refreshTokenExpiresOn = this.refreshTokenExpiresOn();
    if (!refreshTokenExpiresOn) return false;

    return new Date(refreshTokenExpiresOn) > new Date();
  });

  jwtPayload = computed(() => {
    const token = this.jwtToken();
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  });

  login$(requestData: LoginRequestData) {
    const url = `${environment.apiUrl}/auth/login`;
    return this._httpClient
      .post<AuthResponse>(url, requestData, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.jwtToken.set(res.token);
          this.refreshTokenExpiresOn.set(res.refreshTokenExpiresOn);
        }),
      );
  }

  refreshToken$() {
    return this._httpClient
      .get<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.jwtToken.set(res.token);
          this.refreshTokenExpiresOn.set(res.refreshTokenExpiresOn);
        }),

        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 400) {
            this.clearToken();
          }
          return throwError(() => err);
        }),
      );
  }

  revokeToken$() {
    return this._httpClient
      .get<boolean>(`${environment.apiUrl}/auth/revoke-token`, {
        withCredentials: true,
      })
      .pipe(tap(() => this.clearToken()));
  }

  clearToken() {
    this.jwtToken.set(null);
    this.refreshTokenExpiresOn.set(null);
  }
}
