import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Cache } from '~/app/core/lib/cache';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '~/app/core/services/manager/users.service';
import { RolesService } from '~/app/core/services/manager/roles.service';
import { UsersDto } from '~/app/shared/models/users.model';
import { TranslateService } from '@ngx-translate/core';
import { notPhoneNumber } from "~/app/shared/helper/validator/validator";
import { dateTimeToJsonStringNotTime, stringToDateTime } from '~/app/shared/helper/convert/dateTime.helper';
import { environment } from '~/environments/environment';
const apiUrl = environment.backEndApiURL;
const MAX_SIZE = 5242880; // 5MB

@Component({
  selector: 'users-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class UsersCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: UsersDto = new UsersDto();

  validateForm!: FormGroup;
  dataCustomer = [];
  custId = null;
  dataRole = [];

  dataWorkplace = [];
  passwordVisible = false;
  userId: string = Cache.getCache("userId");

  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive') },
    { id: 1, text: this.translate.instant('global_active') },
    { id: 2, text: this.translate.instant('global_lock') }
  ];

  listOfControl = [];
  isSpinningAvatar = false;
  nzSelectedIndex = 0;
  userAvatarUrl: string = '';
  avtFile: any = null;
  oldUserCode: string = '';
  isExistedUserCode: boolean = false;

  constructor(
    public authService: AuthService,
    public toast: ToastrService,
    public usersService: UsersService,
    public translate: TranslateService,
    public rolesService: RolesService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userCode: [null, [Validators.required]],
      userPassword: [null, [Validators.required]],
      userFullname: [null, [Validators.required]],
      userBirthday: [null],
      userPhoneNumber: [null, [Validators.required, notPhoneNumber()]],
      userEmail: [null, [Validators.required, Validators.email]],
      userAddress: [null],
      userActive: [0, [Validators.required]],
      userGender: [null],
    });
    this.clearData();
  }

  updatePhoneValidator(): void {
    /** wait for refresh value */
    setTimeout(() => {
      Promise.resolve().then(() => this.validateForm.controls.userPhoneNumber.updateValueAndValidity());
    }, 0);
  }

  updateUserCodeValidator(): void {
    /** wait for refresh value */
    setTimeout(() => {
      Promise.resolve().then(() => this.validateForm.controls.userCode.updateValueAndValidity());
      this.checkUserCode();
    }, 0);
  }

  clearData() {
    this.nzSelectedIndex = 0;
    this.isSpinning = false;
    this.dataForm = {
      userId: null,
      userCode: null,
      userPassword: null,
      userFullname: null,
      userPhoneNumber: null,
      userBirthday: null,
      userGender: null,
      userAddress: null,
      userEmail: null,
      userAvatar: null,
      userActive: 0,
      userCreateddate: null,
      userCreatedby: null,
      userUpdateddate: null,
      userUpdatedby: null,
    };
    this.avtFile = null;
    this.oldUserCode = null;
    this.userAvatarUrl = "assets/uploads/avatar-default.png";
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }

  open(id: string): void {
    this.isVisible = true;
    if (id != undefined && id != null && id != "") {
      this.nzSelectedIndex = 0;
      this.userId = id;
      this.isAdd = false;
      this.getData();
    }
    else {
      this.userId = null;
      this.isAdd = true;
      this.clearData();
    }
  }

  getData() {
    if (this.userId == null) return;
    this.isSpinning = true;
    this.usersService.GetOne(this.userId)
      .subscribe((res: any) => {
        if (res.code == 1) {
          this.oldUserCode = res.data.userCode;
          this.listOfControl = [];
          this.dataForm = res.data;
          if (res.data.userBirthday != null)
            this.dataForm.userBirthday = stringToDateTime(res.data.userBirthday);

          if (this.dataForm.userAvatar == null || this.dataForm.userAvatar == "")
            this.userAvatarUrl = "assets/uploads/avatar-default.png"; 
          else 
            this.userAvatarUrl = apiUrl + this.dataForm.userAvatar;
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

  close(): void {
    this.isVisible = false;
  }

  nzSelectedIndexChange($event) {
    this.nzSelectedIndex = parseInt($event);
  }

  submitForm(): void {
    this.checkUserCode();
    //Kiểm tra validate
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    setTimeout(() => {
      if (this.checkValid(0)) {
        this.nzSelectedIndex = 0;
      }
    }, 0);


    if (this.validateForm.invalid || this.isExistedUserCode) return;

    let data = this.validateForm.value;
    if (data.userBirthday != null)
      data.userBirthday = dateTimeToJsonStringNotTime(data.userBirthday);

    data.userCode = data.userCode.trim();
    data.userFullname = data.userFullname.trim();
    data.userPassword = data.userPassword.trim();
    data.userAddress = data.userAddress? data.userAddress.trim() : '';
    
    if (data.userBirthday != null){
      data.userBirthday = new Date(data.userBirthday);
    }
    this.isConfirmLoading = true;
    //Thêm mới
    if (this.isAdd) {
      data.userCreatedby = Cache.getCache("userId");
      this.usersService.Create(data)
      .subscribe((res: any) => {
        if (res.code === 1) {
          if(this.avtFile)
            this.uploadAvatar(res.data.userCode,this.avtFile);
          this.toast.success(this.translate.instant('global_add_success'));
          this.onSubmit.emit(true);
          this.close();
        }
        else {
          this.toast.warning(this.translate.instant('global_add_fail'));
        }

        this.isConfirmLoading = false;
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
        this.isConfirmLoading = false;
      });
    }
    //Cập nhật
    else {
      data.userId = this.userId;
      data.userUpdatedby = Cache.getCache("userId");
      this.usersService.Update(this.userId, data)
      .subscribe((res: any) => {
        if (res.code === 1) {
          this.toast.success(this.translate.instant('global_edit_success'));
          this.onSubmit.emit(true);
          this.close();
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

  checkValid(indexTab) {
    if (indexTab == 0) {
      let group1 = [
        "userCode",
        "userPassword",
        "userFullname",
        "userPhonenumber",
        "userEmail",
        "userActive"
      ];
      let valid = false;
      group1.forEach(group => {
        if (this.validateForm.controls[group].invalid) {
          valid = true;
        }
      });
      return valid;
    }
  }

  selectFile(event: any): void {
    this.isSpinningAvatar = true;
    if (event.target.files.length == 0) {
      this.isSpinningAvatar = false;
      return;
    }
    let file = event.target.files[0];
    const isType = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    if (!isType) {
      this.toast.warning(this.translate.instant('auth_avatar_type_invalid'));
      this.isSpinningAvatar = false;
      return;
    }
    //5 MB
    if (file.size > MAX_SIZE) {
      this.toast.warning(this.translate.instant('auth_avatar_size_invalid'));
      this.isSpinningAvatar = false;
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.userAvatarUrl = reader.result.toString();
      this.isSpinningAvatar = false;
    }
    reader.onerror = function (ex) {
    };
    reader.readAsDataURL(file);

    //them moi
    if (this.isAdd){
      this.avtFile = file;
    }else{
      if (this.userId == null){
        return;
      }
      this.uploadAvatar(this.userId,file);
    }
    
  }

  checkUserCode() {
    if(!this.dataForm.userCode) return;
    let value = this.dataForm.userCode.trim() + "";
    if (this.isAdd) {
      this.usersService.checkUserCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.isExistedUserCode = true;
              this.validateForm.controls.userCode.setErrors({
                isExistedUserCode: true,
              });
              this.validateForm.controls.userCode.markAsDirty();
            }
          } else {
            this.isExistedUserCode = false;
            this.toast.warning(this.translate.instant("global_error_fail"));
          }
        },
        (error) => {
          this.toast.error(this.translate.instant('global_error_fail'));
        }
      );
    } else if(value != this.oldUserCode){
      this.usersService.checkUserCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.validateForm.controls.userCode.setErrors({
                isExistedUserCode: true,
              });
              this.validateForm.controls.userCode.markAsDirty();
            }
          } else {
            this.toast.warning(this.translate.instant("global_error_fail"));
          }
        },
        (error) => {
          this.toast.error(this.translate.instant('global_error_fail'));
        }
      );
    }
  }

  uploadAvatar(avatarId: string, file: any){
    this.authService.changeAvatar(avatarId, file)
      .subscribe((res: any) => {
        if (res.code == 1) {
          if(!this.isAdd)
            this.toast.success(this.translate.instant('global_edit_success'));
          if (res.data != null && res.data.avatarSrc != null)
            this.userAvatarUrl = apiUrl + res.data.avatarSrc;
        }
        else {
          if(!this.isAdd)
            this.toast.error(this.translate.instant('global_fail'));
        }
        this.isSpinning = false;
        this.isSpinningAvatar = false;
      }, error => {
        console.log(error)
        this.toast.error('Tải lên avatar thất bại.');
        this.isSpinning = false;
        this.isSpinningAvatar = false;
      });
  }
}
