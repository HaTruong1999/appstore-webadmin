import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '~/app/core/services/manager/accounts.service';
import { AccountsDto } from '~/app/shared/models/accounts.model';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '~/app/core/services/manager/users.service';
import { notPhoneNumber } from "~/app/shared/helper/validator/validator";
import { dateTimeToJsonStringNotTime, stringToDateTime } from '~/app/shared/helper/convert/dateTime.helper';
import { RolesService } from '~/app/core/services/manager/roles.service';

@Component({
  selector: 'accounts-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class AccountsCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: AccountsDto = new AccountsDto();
  accId: string = null;

  validateForm!: FormGroup;
  dataCustomer = [];
  dataParent = [];
  dataUser = [];
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive')},
    { id: 1, text: this.translate.instant('global_active')},
    { id: 2, text: this.translate.instant('global_lock')}
  ];
  passwordVisible = false;
  webadmin = false;
  changePassword = false;
  phoneOld = '';
  usernameOld = '';
  dataRole = [];

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public accountsService: AccountsService, 
    public translate: TranslateService,
    public usersService: UsersService,
    public rolesService: RolesService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getRole();
    this.validateForm = this.fb.group({
      accName: [null, [this.usernameValidator]],
      accPassword: [null, [this.passwordValidator]],
      accFullname: [null, [Validators.required]],
      accBirthday: [null],
      accPhonenumber: [null, [Validators.required, notPhoneNumber()]],
      accEmail: [null],
      accAddress: [null],
      accGender: ['1'],
      accStatus: [0, [Validators.required]],
      roleId: [null],
    });
    this.clearData();
  }
  clearData()
  {
    this.isSpinning = false;
    this.phoneOld = '';
    this.usernameOld = '';
    this.changePassword = false;
    this.dataForm = {
      accId: null,
      accName: null,
      accPhonenumber: null,
      accPassword: null,
      accStatus: 0,
      accIsactive: null,
      accFullname: null,
      accAddress: null,
      accAvatar: null,
      accAvatarBase64: null,
      accAvatarChange: false,
      accBirthday: null,
      accChangePassword: false,
      accEmail: null,
      accGender: null,
      roleId: null
    };
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }

  phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if(!control.value
      && this.validateForm != undefined 
      && this.validateForm.controls != undefined
      && this.validateForm.value.webadminDto === false)
    {
      return { error: true, required: true };
    }
    return {};
  };
  updatePhoneValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.accPhonenumber.updateValueAndValidity());
  }
  
  usernameValidator = (control: FormControl): { [s: string]: boolean } => {
    if(!control.value
      && this.validateForm != undefined 
      && this.validateForm.controls != undefined
      && this.validateForm.value.webadminDto === true)
    {
      return { error: true, required: true };
    }
    return {};
  };
  usernameAsyncValidator() {
    let data = this.validateForm.value;
    let edit = this.isAdd == true ? '0' : '1';
    let username = data.accName;
    let usernameOld = this.usernameOld;
    
    if(username != null) username = username.trim().toLowerCase();
    if(usernameOld != null) usernameOld = usernameOld.trim().toLowerCase();

    if(username == null || username == '')
    {
      this.toast.warning(this.translate.instant('accounts_username_require'));
      return;
    }
    //Kiểm tra validate
    this.validateForm.controls.accName.markAsDirty();
    this.validateForm.controls.accName.updateValueAndValidity();
    if(this.validateForm.controls.accName.invalid) return;

    this.accountsService.checkUsername(edit, username, usernameOld)
    .subscribe((res: any) => {
      if(res.code == 1 && res.data != null && res.data.length > 0)
      {
        this.toast.warning(this.translate.instant('accounts_name_exist'));
      }
      else
      {
        this.toast.success(this.translate.instant('accounts_name_ok'));
      }
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
    });
  }

  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if(!control.value
      && this.validateForm != undefined 
      && this.validateForm.controls != undefined
      && this.validateForm.value.webadminDto === true)
    {
      return { error: true, required: true };
    }
    return {};
  };
  accPasswordChange()
  {
    let data = this.validateForm.value;
    if(data.accPassword != null && data.accPassword !== "*****")
    {
      this.changePassword = true;
    }
  }

  getRole()
  {
    this.rolesService.Select()
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.dataRole = res.data;
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

  open(id: string): void {
    this.isVisible = true;
    if(id != undefined && id != null && id != "")
    {
      this.accId = id;
      this.isAdd = false;
      this.getData();
    }
    else
    {
      this.accId = null;
      this.isAdd = true;
      this.clearData();
    }
  }
  
  getData()
  {
    if(this.accId == null) return;
    this.isSpinning = true;
    this.accountsService.GetOne(this.accId)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.dataForm = res.data;
        this.dataForm.accPassword = "*****";

        if(res.data.accBirthday != null)
        this.dataForm.accBirthday = stringToDateTime(res.data.accBirthday);

        this.phoneOld = this.dataForm.accPhonenumber;
        this.usernameOld = this.dataForm.accName;
      }
      else
      {
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

  submitForm(): void {
    
    let data = this.validateForm.value;
    data.accWebadmin = data.webadminDto == true ? 1 : 0;

    //Kiểm tra validate
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if(this.validateForm.invalid) return;

    console.log(data);

    this.isConfirmLoading = true;
    //Kiểm tra
    let edit = this.isAdd == true ? '0' : '1';
    let username = data.accName;
    let usernameOld = this.usernameOld;
    
    if(username != null) username = username.trim().toLowerCase();
    if(usernameOld != null) usernameOld = usernameOld.trim().toLowerCase();

    if(data.accBirthday != null)
    data.accBirthday  = dateTimeToJsonStringNotTime(data.accBirthday);

    this.accountsService.checkUsername(edit, username, usernameOld)
    .subscribe((res: any) => {
      if(res.code == 1 && res.data != null && res.data.length > 0)
      {
        this.toast.warning(this.translate.instant('accounts_name_exist'));
        this.isConfirmLoading = false;
      }
      else
      {
        //Thêm mới
        if(this.isAdd)
        {
          this.onAdd(data);
        }
        //Cập nhật
        else
        {
          this.onUpdate(data);
        }
        /////////////////////////////////
      }
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
      this.isConfirmLoading = false;
    });
  }

  onAdd(data)
  {
    this.accountsService.Create(data)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.toast.success(this.translate.instant('global_add_success'));
        this.onSubmit.emit(true);
        this.close();
      }
      else
      {
        this.toast.warning(this.translate.instant('global_add_fail'));
      }
      this.isConfirmLoading = false;
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
      this.isConfirmLoading = false;
    });
  }

  onUpdate(data)
  {
    this.isConfirmLoading = true;
    data.accId = this.accId;
    data.accChangePassword = this.changePassword;
    this.accountsService.Update(this.accId, data)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.toast.success(this.translate.instant('global_edit_success'));
        this.onSubmit.emit(true);
        this.close();
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
