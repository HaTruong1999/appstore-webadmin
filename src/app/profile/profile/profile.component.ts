import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountsDto } from '~/app/shared/models/accounts.model';
import { AccountsService } from '~/app/core/services/manager/accounts.service';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { dateTimeToJsonStringNotTime, stringToDateTime } from '~/app/shared/helper/convert/dateTime.helper';
import {Cache} from '~/app/core/lib/cache';
import { notPhoneNumber } from "~/app/shared/helper/validator/validator";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 
  isPageLoading = false;
  isConfirmLoading = false;
  dataForm: AccountsDto = new AccountsDto();
  validateForm!: FormGroup;
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive')},
    { id: 1, text: this.translate.instant('global_active')},
    { id: 2, text: this.translate.instant('global_lock')}
  ];
  isSpinning  = false;

  constructor(
    public toast: ToastrService,
    public translate: TranslateService,
    public accountsService: AccountsService,
    public authService: AuthService,
    private fb: FormBuilder) { 
    this.authService.checkToken();
    this.isPageLoading = true;
  }

  ngOnInit() {
    this.isPageLoading = false;
    this.validateForm = this.fb.group({
      accFullname: [{value: null, disabled: false}, [Validators.required]],
      accBirthday: [{value: null, disabled: false}],
      accPhonenumber: [{value: null, disabled: false}, [Validators.required, notPhoneNumber()]],
      accEmail: [{value: null, disabled: false}],
      accAddress: [{value: null, disabled: false}],
      accGender: [{value: '1', disabled: false}],
    });
    this.getData();
  }

  getData()
  {
    this.authService.account()
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.dataForm = res.data;
        this.dataForm.accBirthday = stringToDateTime(res.data.accBirthday);
        if(this.dataForm.accAvatar == null)
          this.dataForm.accAvatar = "assets/uploads/avatar-default.png";
      }
      else
      {
        this.toast.error(this.translate.instant('global_fail'));
      }
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
    });
  }

  selectFile(event: any): void {
    this.isSpinning  = true;
    if(event.target.files.length == 0)
    {
      this.isSpinning  = false;
      return;
    }
    let file = event.target.files[0];
    const isType = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    if (!isType) {
      this.toast.warning(this.translate.instant('auth_avatar_type_invalid'));
      this.isSpinning  = false;
      return;
    }
    //512KB
    if (file.size > 524288) {
      this.toast.warning(this.translate.instant('auth_avatar_size_invalid'));
      this.isSpinning  = false;
      return;
    }

    this.authService.changeAvatar(Cache.getCache("userId"), file)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.toast.success(this.translate.instant('global_edit_success'));
        if(res.data != null && res.data.avatarSrc != null)
          this.dataForm.accAvatar = res.data.avatarSrc;
      }
      else
      {
        this.toast.error(this.translate.instant('global_fail'));
      }
      this.isSpinning  = false;
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
      this.isSpinning  = false;
    });
  }
  
  cancle()
  {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.getData();
    this.isConfirmLoading = false;
  }

  submitForm()
  {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    
    if(this.validateForm.invalid) return;
    let data = this.validateForm.value;
    if(data.accBirthday != null)
      data.accBirthday  = dateTimeToJsonStringNotTime(data.accBirthday);

    this.isConfirmLoading = true;
    this.authService.Update(data)
      .subscribe((res: any) => {
        if(res.code == 1)
        {
          this.toast.success(this.translate.instant('global_edit_success'));
        }
        else
        {
          this.toast.warning(this.translate.instant('global_edit_fail'));
        }
        this.isConfirmLoading = false;
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
        this.isConfirmLoading = false;
      });
  }
}
