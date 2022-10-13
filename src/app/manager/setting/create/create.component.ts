import { SettingService } from './../../../core/services/manager/setting.service';
import { SettingDto } from './../../../shared/models/setting.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'setting-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class SettingCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: SettingDto = new SettingDto();
  stId: string = null;

  validateForm!: FormGroup;
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive')},
    { id: 1, text: this.translate.instant('global_active')}
  ];

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public settingService: SettingService,  
    public translate: TranslateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      stOldVersion: [null, [Validators.required]],
      stVersionApp: [null, [Validators.required]],
      stCode: [null, [Validators.required]],
      stMessage: [null, [Validators.required]],
      stLink: [null, [Validators.required]],
      stCheckAtMobile: [0],
      stActive: [0, [Validators.required]],
      stUpdatedDate: [null, [Validators.required]],
    });
    this.clearData();
  }
  clearData()
  {
    this.isSpinning = false;
    this.dataForm = {
      stId: null,
      stOldVersion: null,
      stVersionApp: null,
      stCode: null,
      stLink: null,
      stMessage: null,
      stActive: 0,
      stCheckAtMobile: 0,
      stCreatedDate: null,
      stCreatedBy: null,
      stUpdatedDate: null,
    };
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }


  open(id: string): void {
    this.isVisible = true;
    if(id != undefined && id != null && id != "")
    {
      this.stId = id;
      this.isAdd = false;
      this.getData();
    }
    else
    {
      this.stId = null;
      this.isAdd = true;
      this.clearData();
    }
  }
  
  getData()
  {
    if(this.stId == null) return;
    this.isSpinning = true;
    this.settingService.GetOne(this.stId)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.dataForm = res.data;
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
    //Kiểm tra validate
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.invalid) return;
    //////
    let data = this.validateForm.value;
    if(data.stCheckAtMobile == true){
      data.stCheckAtMobile = 1;
    }else{
      data.stCheckAtMobile = 0;
    }

    this.isConfirmLoading = true;
    //Thêm mới
    if(this.isAdd)
    {
      this.settingService.Create(data)
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
    //Cập nhật
    else
    {
      data.stId = this.stId;
      console.log(data);
      this.settingService.Update(this.stId, data)
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

}
