import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../core/services/users-service';
import { User } from '../../shared/models/users-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth-service';

@Component({
  selector: 'app-admin',
  imports: [CardModule, AvatarModule, ButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly _usersService = inject(UsersService);
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);

  ngOnInit(): void {
    this._loadUser();
  }

  private _loadUser(): void {
    const adminId = this._authService.jwtPayload()?.sub;
    if (!adminId) return;

    this._usersService
      .getUser$(adminId)
      .pipe(
        tap((res) => this.user.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
