import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Role } from '../../../../shared/models/roles.model';
import {
  AssignToRoleRequestData,
  UserInfo,
} from '../../../../shared/models/users-model';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../core/services/user-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap, throwError } from 'rxjs';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { atLeastOneRoleSelected } from './assign-to-role.validators';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-assign-to-role',
  imports: [
    ReactiveFormsModule,
    FieldsetModule,
    CheckboxModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './assign-to-role.html',
  styleUrl: './assign-to-role.scss',
})
export class AssignToRole implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => this._patchFormValues());
  }

  roles = input.required<Role[]>();
  user = input.required<UserInfo>();
  assignToRoleForm = new FormGroup(
    {
      roles: new FormArray([]),
    },
    {
      validators: [atLeastOneRoleSelected],
    },
  );
  onUpdate = output();

  ngOnInit(): void {
    this._initializeRolesControls();
  }

  onSubmit(): void {
    if (this.assignToRoleForm.invalid) {
      console.log('Invalid form');
      return;
    }

    const roles = (this.assignToRoleForm.value.roles as boolean[])
      .map((isSelected, index) => {
        if (isSelected) {
          return this.roles()[index].name;
        }
        return null;
      })
      .filter((role) => role !== null);

    const data: AssignToRoleRequestData = {
      userId: this.user().id,
      roles,
    };

    this._userService
      .assignRolesToUser$(data)
      .pipe(
        tap((res) => {
          this._toasterService.success(res.message);
          this.onUpdate.emit();
        }),
        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _patchFormValues(): void {
    const rolesFormArray = this.assignToRoleForm.get('roles') as FormArray;
    const userRoles = this.user().roles;

    rolesFormArray.controls.forEach((control, index) => {
      const currRole = this.roles()[index];
      const isSelected = userRoles.includes(currRole.name);
      control.patchValue(isSelected);
    });
  }

  private _initializeRolesControls(): void {
    const roles = this.assignToRoleForm.get('roles') as FormArray;
    this.roles().forEach((_) => {
      roles.push(new FormControl(false));
    });
  }
}
