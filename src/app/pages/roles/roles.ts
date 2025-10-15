import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RolesService } from '../../../core/services/roles-service';
import { ToasterService } from '../../../core/services/toaster-service';
import { Role } from '../../../shared/models/roles.model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-roles',
  imports: [
    TableModule,
    BreadcrumbModule,
    ButtonModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles implements OnInit {
  private readonly _rolesService = inject(RolesService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  table = viewChild.required<Table>('dt');

  roles = signal<Role[]>([]);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Roles',
      disabled: true,
    },
  ];

  selectedRoleToEdit = signal<Role | undefined>(undefined);
  editRoleDialogVisible = signal(false);

  ngOnInit(): void {
    this._initializeRoles();
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.table().filterGlobal(val, 'contains');
  }

  onEditRole(role: Role) {
    this.selectedRoleToEdit.set(role);
    this.editRoleDialogVisible.set(true);
  }

  private _initializeRoles(): void {
    this._rolesService
      .getRoles$()
      .pipe(
        tap((res) => this.roles.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
