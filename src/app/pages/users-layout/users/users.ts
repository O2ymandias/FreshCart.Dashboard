import { Role } from '../../../shared/models/roles.model';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { UserInfo, UsersQueryOptions } from '../../../shared/models/users-model';
import { MenuItem } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { UserService } from '../../../core/services/user-service';
import { RoleService } from '../../../core/services/role-service';
import { DialogModule } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { AssignToRole } from './assign-to-role/assign-to-role';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    InputGroup,
    FormsModule,
    InputGroupAddonModule,
    PaginatorModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    Tooltip,
    ReactiveFormsModule,
    CheckboxModule,
    FieldsetModule,
    AssignToRole,
    RouterLink
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  // Dependencies
  private readonly _userService = inject(UserService);
  private readonly _roleService = inject(RoleService);
  private readonly _destroyRef = inject(DestroyRef);

  // Constants
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 10;

  // Properties
  users = signal<UserInfo[]>([]);
  roles = signal<Role[]>([]);

  // Pagination
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  totalRecords = signal(0);
  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    this.DEFAULT_PAGE_SIZE * 0.5,
    this.DEFAULT_PAGE_SIZE * 1,
    this.DEFAULT_PAGE_SIZE * 2,
  ];

  // Search
  searchQuery = signal('');

  // Filter
  selectedRole = signal<Role | null>(null);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Users',
      disabled: true,
    },
  ];

  // Assign To Role Dialog
  userToAssignRoles = signal<UserInfo | null>(null);
  showAssignToRoleDialog = signal(false);

  ngOnInit(): void {
    this._loadUsers({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });

    this._loadRoles();
  }

  onPageChange(event: PaginatorState): void {
    let pageNumber = this.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    // Considers: search query and sort options
    const search = this.searchQuery();

    this._loadUsers({
      pageNumber,
      pageSize,
      search,
    });
  }

  search(): void {
    // Reset to first page BUT keep the current page size.
    this._loadUsers({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      search: this.searchQuery(),
    });
  }

  filter(): void {
    // Reset to first page BUT keep the current page size.
    const role = this.selectedRole();
    if (!role) {
      this._loadUsers({
        pageNumber: this.DEFAULT_PAGE_NUMBER,
        pageSize: this.pageSize(),
      });
      return;
    }

    this._loadUsers({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      roleId: role.id,
    });
  }

  refresh(): void {
    // Reset the search query.
    this.searchQuery.set('');

    // Reset the selected role.
    this.selectedRole.set(null);

    // Reset the pagination.
    this.pageNumber.set(this.DEFAULT_PAGE_NUMBER);
    this.pageSize.set(this.DEFAULT_PAGE_SIZE);

    // Reset user to assign roles
    this.userToAssignRoles.set(null);

    // Reset to first page.
    this._loadUsers({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    });
  }

  assignToRole(user: UserInfo): void {
    this.showAssignToRoleDialog.set(true);
    this.userToAssignRoles.set(user);
  }

  onAssignToRole(): void {
    this.showAssignToRoleDialog.set(false);
    this.refresh();
  }

  private _loadUsers(options: UsersQueryOptions): void {
    this._userService
      .getUsers$(options)
      .pipe(
        tap((res) => {
          this.users.set(res.results);
          this.pageNumber.set(res.pageNumber);
          this.pageSize.set(res.pageSize);
          this.totalRecords.set(res.total);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _loadRoles(): void {
    this._roleService
      .getRoles$()
      .pipe(
        tap((res) => this.roles.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
