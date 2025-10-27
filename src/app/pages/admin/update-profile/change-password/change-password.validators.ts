import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function equalValuesValidator(
  ctrl1: string,
  ctrl2: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const val1 = group.get(ctrl1)?.value;
    const val2 = group.get(ctrl2)?.value;
    return val1 === val2 ? null : { nomatch: true };
  };
}
