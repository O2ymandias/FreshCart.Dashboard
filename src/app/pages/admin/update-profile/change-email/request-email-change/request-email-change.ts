import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { tap, catchError, throwError, finalize } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth/auth-service';
import { ToasterService } from '../../../../../core/services/toaster-service';
import { ChangeEmailRequest } from '../../../../../shared/models/auth.model';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-request-email-change',
  imports: [
    CardModule,
    ReactiveFormsModule,
    MessageModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './request-email-change.html',
  styleUrl: './request-email-change.scss',
})
export class RequestEmailChange {
  private readonly _authService = inject(AuthService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  requestEmailChangeForm!: FormGroup<{
    newEmail: FormControl<string>;
    password: FormControl<string>;
  }>;

  loading = signal(false);

  emailChangeRequested = output();

  ngOnInit(): void {
    this._initializeFormData();
  }

  requestEmailChange(): void {
    if (this.requestEmailChangeForm.invalid) return;
    const { newEmail, password } = this.requestEmailChangeForm.value;

    if (!newEmail || !password) return;

    this._requestEmailChange({ newEmail, password });
  }

  private _requestEmailChange(data: ChangeEmailRequest): void {
    this.loading.set(true);
    this._authService
      .requestEmailChange$(data)
      .pipe(
        tap(() => {
          this.requestEmailChangeForm.reset();
          this.emailChangeRequested.emit();
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        finalize(() => this.loading.set(false)),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initializeFormData(): void {
    this.requestEmailChangeForm = new FormGroup({
      newEmail: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
