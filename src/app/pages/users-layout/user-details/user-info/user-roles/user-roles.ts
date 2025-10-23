import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../../../../shared/models/users-model';
import { RolesService } from '../../../../../core/services/roles-service';
import { Role } from '../../../../../shared/models/roles.model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AssignToRole } from './assign-to-role/assign-to-role';

@Component({
  selector: 'app-user-roles',
  imports: [ButtonModule, TagModule, DialogModule, AssignToRole],
  templateUrl: './user-roles.html',
  styleUrl: './user-roles.scss',
})
export class UserRoles implements OnInit {
  private readonly _roleService = inject(RolesService);
  private readonly _destroyRef = inject(DestroyRef);

  user = input.required<User>();
  allRoles = signal<Role[]>([]);
  showAssignToRoleDialog = signal(false);
  userRolesUpdate = output();

  ngOnInit(): void {
    this._loadRoles();
  }

  onUserRolesUpdate(): void {
    this.showAssignToRoleDialog.set(false);
    this.userRolesUpdate.emit();
  }

  private _loadRoles(): void {
    this._roleService
      .getRoles$()
      .pipe(
        tap((res) => this.allRoles.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
