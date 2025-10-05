import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';
import {
  AuthResponse,
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

  login$(requestData: LoginRequestData) {
    const url = `${environment.apiUrl}/auth/login`;
    return this._httpClient
      .post<AuthResponse>(url, requestData, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.jwtToken.set(res.token);
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

  clearToken() {
    this.jwtToken.set(null);
    this.refreshTokenExpiresOn.set(null);
  }
}
