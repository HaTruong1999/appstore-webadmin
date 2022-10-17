import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppsService } from '~/app/core/services/manager/apps.service';
import { RolesService } from '~/app/core/services/manager/roles.service';
import { AppsDto } from '~/app/shared/models/apps.model';
import { TranslateService } from '@ngx-translate/core';
import { notPhoneNumber } from "~/app/shared/helper/validator/validator";
import { dateTimeToJsonStringNotTime, stringToDateTime } from '~/app/shared/helper/convert/dateTime.helper';
import { Cache } from '~/app/core/lib/cache';

@Component({
  selector: 'apps-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class AppsCreateComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: AppsDto = new AppsDto();
  appId: string = null;

  validateForm!: FormGroup;
  dataCustomer = [];
  custId = null;
  dataRole = [];

  dataWorkplace = [];

  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive') },
    { id: 1, text: this.translate.instant('global_active') },
    { id: 2, text: this.translate.instant('global_lock') }
  ];

  listOfControl = [];
  isSpinningAvatar = false;
  nzSelectedIndex = 0;

  constructor(
    public authService: AuthService,
    public toast: ToastrService,
    public appsService: AppsService,
    public translate: TranslateService,
    public rolesService: RolesService,
    private fb: FormBuilder
  ) {
  }

  //appAvatar: string | null;
  //appWpId: string | null;
  //appHistoryId: string | null;

  ngOnInit() {
    this.validateForm = this.fb.group({
      appCode: [null, [Validators.required]],
      appName: [null, [Validators.required]],
      appDescription: [null],
      appVersion: [null],
      appPackage: [null],
      appLink: [null],
      appSystem: [null],
      appSubject: [null],
      appTypeId: [null],
      appStatus: [0]
    });
    this.clearData();
  }

  updatePhoneValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.userPhonenumber.updateValueAndValidity());
  }

  clearData() {
    this.nzSelectedIndex = 0;
    this.isSpinning = false;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.dataForm = {
      appId: null,
      appCode: null,
      appName: null,
      appAvatar: "assets/uploads/avatar-default.png",
      appDescription: null,
      appVersion: null,
      appPackage: null,
      appLink: null,
      appSystem: null,
      appSubject: null,
      appWpId: null,
      appTypeId: null,
      appStatus: 0,
      appHistoryId: null,
      appCreateddate: null,
      appCreatedby: null,
      appUpdateddate: null,
      appUpdatedby: null,
      appAvatarBase64: null,
      appAvatarChange: false
    };
  }

  open(id: string): void {
    this.isVisible = true;
    if (id != undefined && id != null && id != "") {
      this.nzSelectedIndex = 0;
      this.appId = id;
      this.isAdd = false;
      this.getData();
    }
    else {
      this.appId = null;
      this.isAdd = true;
      this.clearData();
    }
  }

  getData() {
    if (this.appId == null) return;
    this.isSpinning = true;
    this.appsService.GetOne(this.appId)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.listOfControl = [];
          this.dataForm = res.data;

          if (this.dataForm.appAvatar == null || this.dataForm.appAvatar == "")
            this.dataForm.appAvatar = "assets/uploads/avatar-default.png";
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


    if (this.validateForm.invalid) return;

    let data = this.validateForm.value;

    // data.userAvatarChange = false;
    // data.userAvatarBase64 = null;
    // data.userAvatar = null;
    // if(this.dataForm != null)
    // {
    //   if(this.dataForm.userAvatarChange == true)
    //   {
    //     data.userAvatarChange = true;
    //     data.userAvatarBase64 = this.dataForm.userAvatarBase64;
    //   }
    // }

    this.isConfirmLoading = true;
    //Thêm mới
    if (this.isAdd) {
      this.appsService.Create(data)
        .subscribe((res: any) => {
          if (res.code == 201) {
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
      data.appId = this.appId;
      console.log('appDataUpdate: ', data);
      this.appsService.Update(this.appId, data)
        .subscribe((res: any) => {
          if (res.code == 200) {
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
        "appCode",
        "appName",
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
    //512KB
    if (file.size > 524288) {
      this.toast.warning(this.translate.instant('auth_avatar_size_invalid'));
      this.isSpinningAvatar = false;
      return;
    }
    const reader: FileReader = new FileReader();
    // reader.onload = (e: any) => {
    //  this.dataForm.userAvatarChange = true;
    //  this.dataForm.userAvatarBase64 = reader.result.toString();
    //  this.dataForm.userAvatar = this.dataForm.userAvatarBase64;
    //  this.isSpinningAvatar  = false;
    // }
    reader.onerror = function (ex) {
    };
    reader.readAsDataURL(file);
  }

}
