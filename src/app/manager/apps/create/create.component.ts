import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppsService } from '~/app/core/services/manager/apps.service';
import { RolesService } from '~/app/core/services/manager/roles.service';
import { AppsDto } from '~/app/shared/models/apps.model';
import { TranslateService } from '@ngx-translate/core';
import { Cache } from '~/app/core/lib/cache';
import { environment } from '~/environments/environment';
import { filesize } from "filesize";
import { NzModalService } from 'ng-zorro-antd/modal';
const apiUrl = environment.backEndApiURL;
const avatar_app_default = 'assets/uploads/avatar-app-default.png';
const MAX_SIZE_IMAGE = 5242880; // 5MB
const MAX_SIZE_FILE = 314572800; // 300MB
const notAllowedFileExts = [
  "exe",
  "msi",
  "msc",
  "com",
  "bat",
  "cmd",
  "ps1",
  "cpl",
  "vb",
  "vbe",
  "vbs",
  "vbscript",
  "sh",
  "command",
  "csh",
  "action",
];
const extToFileIconMap: {
  [key: string] : {
    nzIcon: string;
    textColorClass: string;
    contentType: string;
  };
} = {};

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
  isExistedAppCode: boolean = false;

  //file android
  androidFile: any = null;
  isErrAndroidFile: boolean = false;

  //file IOS
  iosFile: any = null;
  isErrIOSFile: boolean = false;

  constructor(
    public authService: AuthService,
    public toast: ToastrService,
    public appsService: AppsService,
    public translate: TranslateService,
    public rolesService: RolesService,
    private fb: FormBuilder,
    private modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      appCode: [null, [Validators.required]],
      appName: [null, [Validators.required]],
      appDescription: [null, [Validators.required]],
      appVersion: [null],
      radioAndroid: ['FILE'],
      appLinkAndroid: [null],
      appFileAndroid: [null],
      radioIOS: ['FILE'],
      appLinkIOS: [null],
      appFileIOS: [null],
      appStatus: [0, [Validators.required]],
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
    this.androidFile = null;
    this.iosFile = null;
    this.oldAppCode = null;
    this.appAvatarUrl = avatar_app_default;
    this.dataForm = {
      appId: null,
      appCode: null,
      appName: null,
      appAvatar: avatar_app_default,
      appDescription: null,
      appVersion: null,
      appStatus: 0,
      appCreateddate: null,
      appCreatedby: null,
      appUpdateddate: null,
      appUpdatedby: null,
      radioAndroid: 'FILE',
      appFileAndroid: null,
      appLinkAndroid: null,
      radioIOS: 'FILE',
      appLinkIOS: null,
      appFileIOS: null,
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
          console.log('data app truong: ', res.data)
          this.dataForm = res.data;
          this.oldAppCode = res.data.appCode;

          if (this.dataForm.appAvatar == null || this.dataForm.appAvatar == "")
            this.appAvatarUrl = avatar_app_default;
          else 
            this.appAvatarUrl = apiUrl + this.dataForm.appAvatar;
          
          if (this.dataForm.appFileAndroid){
            this.dataForm.radioAndroid = 'FILE';
            let temp = this.dataForm.appFileAndroid.split('/');
            this.androidFile = {
              fileName: temp[temp.length-1],
              fileType: 'apk',
            }
          }else if (this.dataForm.appLinkAndroid){
            this.androidFile = null;
            this.dataForm.radioAndroid = 'LINK';
          }else{
            this.androidFile = null;
            this.dataForm.radioAndroid = 'FILE';
          }

          if (this.dataForm.appFileIOS){
            this.dataForm.radioIOS = 'FILE';
            let temp = this.dataForm.appFileIOS.split('/');
            this.iosFile = {
              fileName: temp[temp.length-1],
              fileType: 'apk',
            }
          } else if (this.dataForm.appLinkIOS){
            this.iosFile = null;
            this.dataForm.radioIOS = 'LINK';
          }else{
            this.iosFile = null;
            this.dataForm.radioIOS = 'FILE';
          }
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
    if(!this.checkPackage()){
      this.toast.warning('Vui lòng thêm ít nhật một gói cài đặt ứng dụng!');
      return;
    }
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

    if(this.validateForm.invalid) return;
    if(this.isExistedAppCode){
      this.validateForm.controls.appCode.setErrors({
        isExistedAppCode: true,
      });
      this.validateForm.controls.appCode.markAsDirty();
      return;
    }

    let data = this.validateForm.value;
    data.appCode = data.appCode.trim();
    this.isConfirmLoading = true;
    //Thêm mới
    if (this.isAdd) {
      data.appCreatedBy = Number.parseInt(Cache.getCache("userId"));
      this.appsService.Create(data)
        .subscribe((res: any) => {
          if (res.code == 1) {
            if(this.avtFile)
              this.uploadAvatar(res.data.appCode,this.avtFile);
            if(this.androidFile)
              this.uploadFile(res.data.appCode, this.androidFile, 'ANDROID');
            if(this.iosFile)
              this.uploadFile(res.data.appCode, this.iosFile, 'IOS');

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
      data.appUpdatedBy = Number.parseInt(Cache.getCache("userId"));
      this.appsService.Update(data)
        .subscribe((res: any) => {
          if (res.code == 1) {
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
        "appDescription",
        "appStatus",
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
    if (file.size > MAX_SIZE_IMAGE) {
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
    this.isExistedAppCode = false;
    if(!this.dataForm.appCode) return;
    let value = this.dataForm.appCode.trim() + "";
    if (this.isAdd) {
      this.appsService.checkAppCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.isExistedAppCode = true;
              this.validateForm.controls.appCode.setErrors({
                isExistedAppCode: true,
              });
              this.validateForm.controls.appCode.markAsDirty();
            }
          } else {
            this.isExistedAppCode = false;
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

  //file android
  selectAndroidFile(event: any): void {
    if (event.target.files.length == 0) {
      return;
    }
    let file = event.target.files[0];

    const isType = file.type === 'application/vnd.android.package-archive';
    if (!isType) {
      this.toast.warning('Định dạng file không phù hợp!');
      this.isErrAndroidFile = true;
      return;
    }
    //5 MB
    if (file.size > MAX_SIZE_FILE) {
      this.toast.warning(this.translate.instant('File cài đặt không vượt quá 300MB!'));
      this.isErrAndroidFile = true;
      return;
    }

    //them moi
    if (this.isAdd){
      this.androidFile = this.handleFile(file);
    }else{
      if (this.appId == null){
        return;
      }
      this.uploadFile(this.appId,file,'ANDROID');
    }
  }

  onRemoveFile(type: string){
    this.modal.confirm({
      nzTitle: this.translate.instant('global_confirm_delete_title'),
      nzOkText: this.translate.instant('global_submit'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.submitDeleteFile(type),
      nzCancelText: this.translate.instant('global_cancel'),
    });
  }

  submitDeleteFile(type: string) {
    this.appsService.DeleteFile(this.appId, type)
      .subscribe((res: any) => {
        if(res.code == 1)
        {
          this.toast.success(this.translate.instant('global_delete_success'));
          this.androidFile = null;
        }
        else
        {
          this.toast.warning(this.translate.instant('global_delete_fail'));
        }
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }

  //file ios
  selectIOSFile(event: any): void {
    if (event.target.files.length == 0) {
      return;
    }
    let file = event.target.files[0];
    const isType = file.type === 'application/vnd.android.package-archive';
    if (!isType) {
      this.toast.warning('Định dạng file không phù hợp!');
      this.isErrIOSFile = true;
      return;
    }

    if (file.size > MAX_SIZE_FILE) {
      this.toast.warning(this.translate.instant('File cài đặt không vượt quá 300MB!'));
      this.isErrIOSFile = true;
      return;
    }

    //them moi
    if (this.isAdd){
      this.iosFile = this.handleFile(file);
    }else{
      if (this.appId == null){
        return;
      }
      this.uploadFile(this.appId,file,'IOS');
    }
  }

  fileColor(extName: string) {
    let convert = extName.replace(".", "");
    return extToFileIconMap[convert]?.textColorClass || "text-secondary";
  }

  nzIcon(extName: string) {
    let convert = extName.replace(".", "");
    return extToFileIconMap[convert]?.nzIcon || "file";
  }

  handleFile(file: File): any{
    if (
      notAllowedFileExts.some((ext) =>
        file.name.toLowerCase().endsWith("." + ext)
      )
    ){
      return null;
    }

    return {
      file,
      fileName: file.name,
      fileType: file.name.split(".").pop() ?? "",
      size: file.size,
      displaySize: filesize(file.size),
    }
  }

  uploadFile(fileId: string, file: any, fileType: string){
    this.appsService.uploadFile(fileId, file, fileType)
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
        this.toast.error('Tải lên file thất bại.');
        this.isSpinning = false;
        this.isSpinningAvatar = false;
      });
  }

  checkPackage(): boolean{
    return this.androidFile || this.iosFile || this.dataForm.appLinkAndroid || this.dataForm.appLinkIOS;
  }
}
