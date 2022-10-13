import { FormArray, FormGroup } from "@angular/forms";

export function touchAll(formGroup: FormGroup | FormArray) {
//   let valid = true;
  const controls: { [key: string]: any } = formGroup.controls;
  for (const control in controls) {
    if ("controls" in controls[control]) {
      touchAll(controls[control]);
    } else {
      controls[control].markAsDirty();
      controls[control].updateValueAndValidity();
    }
  }
}
