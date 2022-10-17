import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsersDto } from '~/app/shared/models/users.model';
import { AccountsService } from '~/app/core/services/manager/accounts.service';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { dateTimeToJsonStringNotTime, stringToDateTime } from '~/app/shared/helper/convert/dateTime.helper';
import { Cache } from '~/app/core/lib/cache';
import { notPhoneNumber } from "~/app/shared/helper/validator/validator";
import { UsersService } from '~/app/core/services/manager/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isPageLoading = false;
  isConfirmLoading = false;
  dataForm: UsersDto = new UsersDto();
  validateForm!: FormGroup;
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive') },
    { id: 1, text: this.translate.instant('global_active') },
    { id: 2, text: this.translate.instant('global_lock') }
  ];
  isSpinning = false;
  username: string = Cache.getCache("username");
  userId: string = Cache.getCache("userId");

  constructor(
    public toast: ToastrService,
    public translate: TranslateService,
    public accountsService: AccountsService,
    public authService: AuthService,
    public usersService: UsersService,
    private fb: FormBuilder) {
    //this.authService.checkToken();
    this.isPageLoading = true;
  }

  ngOnInit() {
    this.isPageLoading = false;
    this.validateForm = this.fb.group({
      userFullname: [{ value: null, disabled: false }, [Validators.required]],
      userBirthday: [{ value: null, disabled: false }],
      userPhoneNumber: [{ value: null, disabled: false }, [Validators.required, notPhoneNumber()]],
      userEmail: [{ value: null, disabled: false }],
      userAddress: [{ value: null, disabled: false }],
      userGender: [{ value: 'Nam', disabled: false }],
    });
    this.getData();
  }

  getData() {
    if (this.userId == null) return;

    this.usersService.GetOne(this.userId)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.dataForm = res.data;
          this.dataForm.userBirthday = stringToDateTime(res.data.userBirthday);
          if (this.dataForm.userAvatar == null)
            this.dataForm.userAvatar = "assets/uploads/avatar-default.png";
        }
        else {
          this.toast.error(this.translate.instant('global_fail'));
        }
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }

  // getData() {
  //   if (this.userId == null) return;

  //   this.usersService.GetOne(this.userId)
  //     .subscribe((res: any) => {
  //       if (res.code == 200) {
  //         this.dataForm = res.data;
  //         this.dataForm.userBirthday = stringToDateTime(res.data.userBirthday);
  //         if (this.dataForm.userAvatar == null)
  //           this.dataForm.userAvatar = "assets/uploads/avatar-default.png";
  //       }
  //       else {
  //         this.toast.error(this.translate.instant('global_fail'));
  //       }
  //     }, error => {
  //       console.log(error)
  //       this.toast.error(this.translate.instant('global_error_fail'));
  //     });
  // }

  setValueForm(data: any) {

  }

  selectFile(event: any): void {
    this.isSpinning = true;
    if (event.target.files.length == 0) {
      this.isSpinning = false;
      return;
    }
    let file = event.target.files[0];
    const isType = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    if (!isType) {
      this.toast.warning(this.translate.instant('auth_avatar_type_invalid'));
      this.isSpinning = false;
      return;
    }
    //512KB
    if (file.size > 524288) {
      this.toast.warning(this.translate.instant('auth_avatar_size_invalid'));
      this.isSpinning = false;
      return;
    }

    this.authService.changeAvatar(Cache.getCache("userId"), file)
      .subscribe((res: any) => {
        if (res.code == 1) {
          this.toast.success(this.translate.instant('global_edit_success'));
          if (res.data != null && res.data.avatarSrc != null)
            this.dataForm.userAvatar = res.data.avatarSrc;
        }
        else {
          this.toast.error(this.translate.instant('global_fail'));
        }
        this.isSpinning = false;
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
        this.isSpinning = false;
      });
  }

  cancle() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.getData();
    this.isConfirmLoading = false;
  }

  submitForm() {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.validateForm.invalid) return;
    let data = this.validateForm.value;
    if (data.userBirthday != null)
      data.userBirthday = dateTimeToJsonStringNotTime(data.userBirthday);

    data.userAvatarChange = false;
    data.userAvatarBase64 = null;
    data.userAvatar = null;
    if (this.dataForm != null) {
      if (this.dataForm.userAvatarChange == true) {
        data.userAvatarChange = true;
        data.userAvatarBase64 = this.dataForm.userAvatarBase64;
      }
    }

    data.userId = this.userId;
    this.isConfirmLoading = true;
    this.usersService.Update(this.userId, data)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.toast.success(this.translate.instant('global_edit_success'));
        }
        else {
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
