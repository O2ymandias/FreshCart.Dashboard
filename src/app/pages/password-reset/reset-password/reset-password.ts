import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { equalValuesValidator } from '../../admin/update-profile/change-password/change-password.validators';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth-service';
import { ToasterService } from '../../../core/services/toaster-service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { passwordPattern } from '../../../shared/models/account.model';

@Component({
  selector: 'app-reset-password',
  imports: [
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    RouterLink,
    PasswordModule,
    MessageModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  email = input.required<string>();
  token = input.required<string>();

  resetPasswordForm!: FormGroup<{
    newPassword: FormControl<string>;
    confirmNewPassword: FormControl<string>;
  }>;

  loading = signal(false);
  ngOnInit(): void {
    this._initializeFormData();
  }

  submit() {
    if (this.resetPasswordForm.invalid) return;

    const { newPassword } = this.resetPasswordForm.value;

    if (!newPassword) return;

    this._resetPassword(newPassword);
  }

  private _initializeFormData() {
    this.resetPasswordForm = new FormGroup(
      {
        newPassword: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(passwordPattern),
          ],
        }),
        confirmNewPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: equalValuesValidator('newPassword', 'confirmNewPassword'),
      },
    );
  }

  private _resetPassword(newPassword: string) {
    this.loading.set(true);
    this._authService
      .resetPassword$(this.token(), newPassword, this.email())
      .pipe(
        tap((res) => {
          this._toasterService.success(res.message);
          this._router.navigate(['/login']);
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
