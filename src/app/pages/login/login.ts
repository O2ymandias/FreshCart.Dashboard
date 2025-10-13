import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/services/auth/auth-service';
import { ToasterService } from '../../core/services/toaster-service';
import { catchError, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotAdminError } from '../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  loginForm = new FormGroup({
    userNameOrEmail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsDirty();
      return;
    }

    const { userNameOrEmail, password } = this.loginForm.value;
    if (!userNameOrEmail || !password) {
      return;
    }

    console.log({ userNameOrEmail, password });

    this._authService
      .login$({
        userNameOrEmail,
        password,
      })
      .pipe(
        tap((res) => {
          this._router.navigate(['/']);
          this._toasterService.success(res.message);
        }),
        catchError((err: HttpErrorResponse | NotAdminError) => {
          if (err instanceof NotAdminError)
            this._toasterService.error(err.message);
          else if (err instanceof HttpErrorResponse)
            this._toasterService.error(err.error.message);

          return throwError(() => err);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
