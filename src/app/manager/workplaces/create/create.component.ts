import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { WorkplacesDto } from '~/app/shared/models/workplaces.models';
import { TranslateService } from '@ngx-translate/core';
import { WorkplacesService } from '~/app/core/services/manager/workplaces.service';

@Component({
  selector: 'workplace-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class WorkplacesCreateComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    public workplacesService: WorkplacesService,
    public toast: ToastrService,
    public translate: TranslateService,
    private fb: FormBuilder
  ) {
  }

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: WorkplacesDto = new WorkplacesDto();
  wpId: string = null;

  validateForm!: FormGroup;
  dataCustomer = [];
  custId = null;

  dataWorkplaces: any[] = [];
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive') },
    { id: 1, text: this.translate.instant('global_active') },
    { id: 2, text: this.translate.instant('global_lock') }
  ];

  listOfControl = [];
  isSpinningAvatar = false;
  nzSelectedIndex = 0;

  isExistedWorkplaceCode: boolean = false;
  oldWorkplaceCode: string = '';

  ngOnInit() {
    this.validateForm = this.fb.group({
      wpCode: [null, [Validators.required]],
      wpName: [null, [Validators.required]],
      wpParent: [null],
      wpOrder: [null],
      wpNode: [false],
      wpStatus: [0],
    });
    this.clearData();
  }

  clearData() {
    this.nzSelectedIndex = 0;
    this.isSpinning = false;
    this.oldWorkplaceCode = '';
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
    this.dataForm = {
      wpId: null,
      wpCode: null,
      wpName: null,
      wpParent: null,
      wpOrder: null,
      wpNode: null,
      wpStatus: 0,
      wpCreatedDate: null,
      wpCreatedBy: null,
      wpUpdatedDate: null,
      wpUpdatedBy: null
    };

  }

  open(id: string): void {
    this.isVisible = true;
    this.getWorkplacesData();
    if (id != undefined && id != null && id != "") {
      this.nzSelectedIndex = 0;
      this.wpId = id;
      this.isAdd = false;
      this.getData();
    }
    else {
      this.wpId = null;
      this.isAdd = true;
      this.clearData();
    }
  }

  getData() {
    if (this.wpId == null) return;
    this.isSpinning = true;
    this.workplacesService.GetOne(this.wpId)
      .subscribe((res: any) => {
        if(res.code == 1)
        {
          this.dataForm = res.data;
          this.oldWorkplaceCode = res.data.wpCode;
        }
               
        this.isSpinning = false;
      }, error => {
        this.toast.error(this.translate.instant('global_error_fail'));
        this.isSpinning = false;
      });
  }

  getWorkplacesData() {
    this.workplacesService.GetListWorkplacesAsTree()
      .subscribe((res: any) => {
        if(res.code == 1)
        {
          this.dataWorkplaces = res.data;
          if (this.dataWorkplaces) {
            this.dataWorkplaces.forEach((element) => {
              this.workplacesService.setWorkplacesTree(element,'NODISABLED');
            });
          }
        }
      }, error => {
        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }

  close(): void {
    this.isVisible = false;
    this.clearData();
  }

  submitForm(): void {
    //Kiểm tra validate
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.isExistedWorkplaceCode){
      this.validateForm.controls.wpCode.setErrors({
        isExistedWorkplaceCode: true,
      });
      this.validateForm.controls.wpCode.markAsDirty();
      return;
    }

    if (this.validateForm.invalid) return;
    
    let data = this.validateForm.value;
    data.wpCode = data.wpCode.trim();
    data.wpNode = data.wpNode == true ? 1 : 0;
    this.isConfirmLoading = true;
    //Thêm mới
    if (this.isAdd) {
      this.workplacesService.Create(data)
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
          this.toast.error(this.translate.instant('global_error_fail'));
          this.isConfirmLoading = false;
        });
    }
    //Cập nhật
    else {
      data.wpId = this.wpId;
      this.workplacesService.Update(this.wpId, data)
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

  updateWorkplaceValidator(): void {
    /** wait for refresh value */
    setTimeout(async () => {
      Promise.resolve().then(() => this.validateForm.controls.wpCode.updateValueAndValidity());
      this.checkWorkplaceCode();
    }, 0);
  }

  checkWorkplaceCode() {
    this.isExistedWorkplaceCode = false;
    if(!this.dataForm.wpCode) return;
    let value = this.dataForm.wpCode.trim() + "";

    if (this.isAdd) {
      this.workplacesService.checkWorkplaceCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.isExistedWorkplaceCode = true;
              this.validateForm.controls.wpCode.setErrors({
                isExistedWorkplaceCode: true,
              });
              this.validateForm.controls.wpCode.markAsDirty();
            }else
              this.isExistedWorkplaceCode = false;
          } else {
            this.isExistedWorkplaceCode = false;
            this.toast.warning(this.translate.instant("global_error_fail"));
          }
        },
        (error) => {
          this.toast.error(this.translate.instant('global_error_fail'));
        }
      );
    } else if(value != this.oldWorkplaceCode){
      this.workplacesService.checkWorkplaceCode(value).subscribe(
        (res: any) => {
          if (res.code == 1) {
            if (res.data.isExisted) {
              this.isExistedWorkplaceCode = true;
              this.validateForm.controls.wpCode.setErrors({
                isExistedWorkplaceCode: true,
              });
              this.validateForm.controls.wpCode.markAsDirty();
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
}
