import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { ChangePassword } from './change-password/change-password';
import { ChangeEmail } from './change-email/change-email';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth-service';
import { UsersService } from '../../../core/services/users-service';

@Component({
  selector: 'app-update-profile',
  imports: [
    DialogModule,
    ButtonModule,
    TabsModule,
    ChangePassword,
    ChangeEmail,
  ],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss',
})
export class UpdateProfile {
  private readonly _authService = inject(AuthService);
  private readonly _usersService = inject(UsersService);
  private readonly _destroyRef = inject(DestroyRef);

  admin = this._authService.admin;
  visible = signal(false);

  onChange() {
    this.visible.set(false);
    this._refresh();
  }

  private _refresh(): void {
    const adminId = this._authService.jwtPayload()?.sub;
    if (!adminId) return;

    this._usersService
      .getUser$(adminId)
      .pipe(
        tap((res) => this.admin.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
