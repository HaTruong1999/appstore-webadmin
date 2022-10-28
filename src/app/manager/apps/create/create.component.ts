import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppsService } from '~/app/core/services/manager/apps.service';
import { RolesService } from '~/app/core/services/manager/roles.service';
import { AppsDto } from '~/app/shared/models/apps.model';
import { TranslateService } from '@ngx-translate/core';
import { Cache } from '~/app/core/lib/cache';
import { environment } from '~/environments/environment';
const apiUrl = environment.backEndApiURL;
const MAX_SIZE = 5242880; // 5MB

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

  appAvatarUrl: string = '';
  avtFile: any = null;
  oldAppCode: string = '';

  constructor(
    public authService: AuthService,
    public toast: ToastrService,
    public appsService: AppsService,
    public translate: TranslateService,
    public rolesService: RolesService,
    private fb: FormBuilder
  ) {
  }

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

  clearData() {
    this.nzSelectedIndex = 0;
    this.isSpinning = false;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.avtFile = null;
    this.oldAppCode = null;
    this.appAvatarUrl = "assets/uploads/avatar-default.png";
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
        if (res.code == 1) {
          this.dataForm = res.data;
          this.oldAppCode = res.data.appCode;

          if (this.dataForm.appAvatar == null || this.dataForm.appAvatar == "")
            this.appAvatarUrl = "assets/uploads/avatar-default.png";
          else 
            this.appAvatarUrl = apiUrl + this.dataForm.appAvatar;
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
    //5 MB
    if (file.size > MAX_SIZE) {
      this.toast.warning(this.translate.instant('auth_avatar_size_invalid'));
      this.isSpinningAvatar = false;
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.appAvatarUrl = reader.result.toString();
      this.isSpinningAvatar = false;
    }
    reader.onerror = function (ex) {
    };
    reader.readAsDataURL(file);

    //them moi
    if (this.isAdd){
      this.avtFile = file;
    }else{
      if (this.appId == null){
        return;
      }
      this.uploadAvatar(this.appId,file);
    }
  }

  checkAppCode() {
    if(!this.dataForm.appCode) return;
    let value = this.dataForm.appCode + "";
    if (this.isAdd) {
      this.appsService.checkAppCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.validateForm.controls.appCode.setErrors({
                isExistedAppCode: true,
              });
              this.validateForm.controls.appCode.markAsDirty();
            }
          } else {
            this.toast.warning(this.translate.instant("global_error_fail"));
          }
        },
        (error) => {
          this.toast.error(this.translate.instant('global_error_fail'));
        }
      );
    } else if(value != this.oldAppCode){
      this.appsService.checkAppCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.validateForm.controls.appCode.setErrors({
                isExistedAppCode: true,
              });
              this.validateForm.controls.appCode.markAsDirty();
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
    this.appsService.changeAvatar(avatarId, file)
      .subscribe((res: any) => {
        if (res.code == 1) {
          if(!this.isAdd)
            this.toast.success(this.translate.instant('global_edit_success'));
          if (res.data != null && res.data.avatarSrc != null)
            this.appAvatarUrl = apiUrl + res.data.avatarSrc;
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

  updateAppCodeValidator(): void {
    /** wait for refresh value */
    setTimeout(() => {
      Promise.resolve().then(() => this.validateForm.controls.appCode.updateValueAndValidity());
      this.checkAppCode();
    }, 0);
  }
}
