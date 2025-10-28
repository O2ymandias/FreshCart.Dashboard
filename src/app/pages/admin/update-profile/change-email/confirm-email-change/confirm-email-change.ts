import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { tap, catchError, throwError, finalize } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth/auth-service';
import { ToasterService } from '../../../../../core/services/toaster-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-confirm-email-change',
  imports: [
    CardModule,
    MessageModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './confirm-email-change.html',
  styleUrl: './confirm-email-change.scss',
})
export class ConfirmEmailChange {
  private readonly _authService = inject(AuthService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  confirmEmailChangeForm!: FormGroup<{
    verificationCode: FormControl<string>;
  }>;

  loading = signal(false);

  emailChangeConfirmed = output();

  ngOnInit(): void {
    this._initializeFormData();
  }

  confirmEmailChange(): void {
    if (this.confirmEmailChangeForm.invalid) return;
    const { verificationCode } = this.confirmEmailChangeForm.value;

    if (!verificationCode) return;

    this.loading.set(true);

    this._authService
      .confirmEmailChange$(verificationCode)
      .pipe(
        tap((res) => {
          this.confirmEmailChangeForm.reset();
          this.emailChangeConfirmed.emit();
          this._toasterService.success(res.message);
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
    this.confirmEmailChangeForm = new FormGroup({
      verificationCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
