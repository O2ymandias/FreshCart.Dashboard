import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RolesService } from '../../../../core/services/roles-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Role } from '../../../../shared/models/roles.model';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { InputTextModule } from 'primeng/inputtext';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-role',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    FormErrors,
    InputTextModule,
  ],
  templateUrl: './edit-role.html',
  styleUrl: './edit-role.scss',
})
export class EditRole implements OnInit {
  private readonly _rolesService = inject(RolesService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<string>();

  role = signal<Role | undefined>(undefined);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Roles',
      routerLink: '/roles',
    },
    {
      label: 'Edit Role',
      disabled: true,
    },
  ];

  editRoleForm = new FormGroup({
    newRoleName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
      nonNullable: true,
    }),
  });

  loading = signal(false);

  ngOnInit(): void {
    this._getRole();
  }

  updateRole() {
    if (this.editRoleForm.invalid) return;

    const roleId = this.id();
    const { newRoleName } = this.editRoleForm.value;
    if (!roleId || !newRoleName) return;

    this.loading.set(true);

    this._rolesService
      .updateRole$(newRoleName, roleId)
      .pipe(
        tap((res) => {
          this._toasterService.success(res.message);
          this._router.navigate(['/roles']);
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

  private _getRole() {
    this._rolesService
      .getRole$(this.id())
      .pipe(
        tap((res) => {
          this.role.set(res);
          this._patchEditRoleFormValues(res);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _patchEditRoleFormValues(role: Role) {
    if (role) {
      this.editRoleForm.patchValue({
        newRoleName: role.name,
      });
    }
  }
}
