import { RolesConstants } from './../../../shared/models/shared.model';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';
import {
  AuthResponse,
  ChangeEmailRequest,
  ChangePasswordRequest,
  JwtPayload,
  LoginRequestData,
  NotAdminError,
} from '../../../shared/models/auth.model';
import { catchError, tap, throwError } from 'rxjs';
import { User } from '../../../shared/models/users-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

  admin = signal<User | null>(null);
  jwtToken = signal<string | null>(null);
  refreshTokenExpiresOn = signal<Date | null>(null);
  isAuthenticated = computed(() => {
    const token = this.jwtToken();
    if (!token) return false;

    const refreshTokenExpiresOn = this.refreshTokenExpiresOn();
    if (!refreshTokenExpiresOn) return false;

    const payload = jwtDecode<JwtPayload>(token);
    if (!payload) return false;

    const isAdmin = Array.isArray(payload.role)
      ? payload.role.includes(RolesConstants.Admin)
      : payload.role.toLowerCase() === RolesConstants.Admin.toLowerCase();

    const isActiveRefreshToken = new Date(refreshTokenExpiresOn) > new Date();

    return isAdmin && isActiveRefreshToken;
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
          if (res.roles.includes(RolesConstants.Admin)) {
            this.jwtToken.set(res.token);
            this.refreshTokenExpiresOn.set(res.refreshTokenExpiresOn);
          } else {
            throw new NotAdminError();
          }
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

  changePassword$(requestData: ChangePasswordRequest) {
    const url = `${environment.apiUrl}/account/change-password`;
    return this._httpClient.put<{ message: string }>(url, requestData);
  }

  requestEmailChange$(requestData: ChangeEmailRequest) {
    const url = `${environment.apiUrl}/account/request-email-change`;
    return this._httpClient.post<{ message: string }>(url, requestData);
  }

  confirmEmailChange$(verificationCode: string) {
    const url = `${environment.apiUrl}/account/confirm-email-change`;
    return this._httpClient.post<{ message: string }>(url, {
      verificationCode,
    });
  }

  clearToken() {
    this.jwtToken.set(null);
    this.refreshTokenExpiresOn.set(null);
  }
}
