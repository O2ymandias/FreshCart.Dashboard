import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { passwordPattern } from '../../../../shared/models/account.model';
import { equalValuesValidator } from './change-password.validators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordRequest } from '../../../../shared/models/auth.model';

@Component({
  selector: 'app-change-password',
  imports: [
    CardModule,
    PasswordModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  changePasswordForm!: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmNewPassword: FormControl<string>;
  }>;

  loading = signal(false);

  passwordChanged = output();

  ngOnInit(): void {
    this._initializeFormData();
  }

  submit() {
    if (this.changePasswordForm.invalid) return;

    const { currentPassword, newPassword } = this.changePasswordForm.value;
    if (!currentPassword || !newPassword) return;

    this._changePassword({
      currentPassword,
      newPassword,
    });
  }

  private _initializeFormData() {
    this.changePasswordForm = new FormGroup(
      {
        currentPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
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

  private _changePassword(data: ChangePasswordRequest) {
    this.loading.set(true);

    this._authService
      .changePassword$(data)
      .pipe(
        tap((res) => {
          this.changePasswordForm.reset();
          this.passwordChanged.emit();
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
}
