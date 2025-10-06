import {
  Component,
  DestroyRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { UserService } from '../../../../core/services/user-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { User } from '../../../../shared/models/users-model';
import { isPlatformServer } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { UserRoles } from './user-roles/user-roles';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Role } from '../../../../shared/models/roles.model';

@Component({
  selector: 'app-user-info',
  imports: [TagModule, MessageModule, UserRoles, ButtonModule, DialogModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
})
export class UserInfo {
  private readonly _userService = inject(UserService);

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  userId = input.required<string>();
  user = signal<User | null>(null);

  availableRoles = signal<Role[]>([]);
  showAssignToRoleDialog = signal(false);

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) return;
    this._getUserDetails();
  }

  onUserRolesUpdate(): void {
    this._getUserDetails();
  }

  private _getUserDetails(): void {
    this._userService
      .getUser$(this.userId())
      .pipe(
        tap((res) => this.user.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
