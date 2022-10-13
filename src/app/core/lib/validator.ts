import {AbstractControl, ValidatorFn} from '@angular/forms';

export class VnptValidator{

  public static PhoneValidator: ValidatorFn = (control: AbstractControl) => {
      
      let phone = control.value;
      let pattern = new RegExp(/(\+843|\+847|\+848|\+849|\+841|03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/);
      let valid =  pattern.test(phone);
      if (!valid) {
        return  {
          'invalidPhone': { value: 'Invalid Phone number' }
        }
      }
      else return null;
  };
  public static EmailValidator: ValidatorFn = (control: AbstractControl) => {
      
      let email = control.value;
      let pattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
      let valid =  pattern.test(email);
      if (!valid) {
        return  {
          'invalidMail': { value: 'Invalid Email' }
        }
      }
      else return null;
  };
}