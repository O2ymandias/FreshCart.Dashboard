import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../core/services/users-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth-service';
import { DialogModule } from 'primeng/dialog';
import { UpdateProfile } from './update-profile/update-profile';

@Component({
  selector: 'app-admin',
  imports: [
    CardModule,
    AvatarModule,
    ButtonModule,
    DialogModule,
    UpdateProfile,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly _usersService = inject(UsersService);
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  admin = this._authService.admin;

  ngOnInit(): void {
    this._loadUser();
  }

  private _loadUser(): void {
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
