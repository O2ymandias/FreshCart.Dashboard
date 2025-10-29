import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth/auth-service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToasterService } from '../../../core/services/toaster-service';

@Component({
  selector: 'app-forget-password',
  imports: [
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    MessageModule,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {
  private readonly _authService = inject(AuthService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  forgetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  loading = signal(false);

  submit() {
    if (this.forgetPasswordForm.invalid) return;

    const { email } = this.forgetPasswordForm.value;
    if (!email) return;

    this._forgetPassword(email);
  }

  private _forgetPassword(email: string) {
    this.loading.set(true);

    this._authService
      .forgetPassword$(email)
      .pipe(
        tap((res) => {
          this._toasterService.success(res.message);
          this.forgetPasswordForm.reset();
        }),

        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),

        finalize(() => this.loading.set(false)),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
