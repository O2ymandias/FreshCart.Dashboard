import { AbstractControl, ValidationErrors } from '@angular/forms';

export function atLeastOneRoleSelected(
  control: AbstractControl,
): ValidationErrors | null {
  const rolesFormArray = control.get('roles') as AbstractControl;
  const atLeastOneSelected = rolesFormArray.value.some((role: boolean) => role);
  return atLeastOneSelected ? null : { atLeastOneRoleSelected: true };
}
