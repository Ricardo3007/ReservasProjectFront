import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function requiredFormArray(control: AbstractControl): ValidationErrors | null {
  if (control instanceof FormArray) {
    return control.length > 0 ? null : { required: true };
  }
  return null;
}