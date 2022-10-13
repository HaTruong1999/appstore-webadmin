import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApptypesService } from '~/app/core/services/manager/apptypes.service';
import { ApptypesDto } from '~/app/shared/models/apptypes.model';
import { TranslateService } from '@ngx-translate/core';
import { notPhoneNumber } from "~/app/shared/helper/validator/validator";
import { dateTimeToJsonStringNotTime, stringToDateTime } from '~/app/shared/helper/convert/dateTime.helper';
import { Cache } from '~/app/core/lib/cache';

@Component({
  selector: 'apptypes-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ApptypesCreateComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: ApptypesDto = new ApptypesDto();
  atId: string = null;

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
    public apptypesService: ApptypesService,
    public translate: TranslateService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      atCode: [null, [Validators.required]],
      atName: [null, [Validators.required]],
      atDescription: [null],
      atStatus: [0],
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
      atId: null,
      atCode: null,
      atName: null,
      atDescription: null,
      atStatus: 0,
      atCreateddate: null,
      atCreatedby: null,
      atUpdateddate: null,
      atUpdatedby: null
    };

  }

  open(id: string): void {
    this.isVisible = true;
    if (id != undefined && id != null && id != "") {
      this.nzSelectedIndex = 0;
      this.atId = id;
      this.isAdd = false;
      this.getData();
    }
    else {
      this.atId = null;
      this.isAdd = true;
      this.clearData();
    }
  }

  getData() {
    if (this.atId == null) return;
    this.isSpinning = true;
    this.apptypesService.GetOne(this.atId)
      .subscribe((res: any) => {
        // if(res.code == 1)
        // {
        //   this.listOfControl = [];
        //   this.dataForm = res.data;
        //   if(res.data.userBirthday != null)
        //     this.dataForm.userBirthday = stringToDateTime(res.data.userBirthday);

        //   if(this.dataForm.userAvatar == null || this.dataForm.userAvatar == "")
        //     this.dataForm.userAvatar = "assets/uploads/avatar-default.png";
        // }
        // else
        // {
        //   this.toast.error(this.translate.instant('global_fail'));
        // }

        this.dataForm = res.data;
        this.isSpinning = false;
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
        this.isSpinning = false;
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


    if (this.validateForm.invalid) return;

    let data = this.validateForm.value;

    this.isConfirmLoading = true;
    //Thêm mới
    if (this.isAdd) {
      this.apptypesService.Create(data)
        .subscribe((res: any) => {
          // if(res.code == 1)
          // {
          //   this.toast.success(this.translate.instant('global_add_success'));
          //   this.onSubmit.emit(true);
          //   this.close();
          // }
          // else
          // {
          //   this.toast.warning(this.translate.instant('global_add_fail'));
          // }
          this.toast.success(this.translate.instant('global_add_success'));
          this.onSubmit.emit(true);
          this.close();

          this.isConfirmLoading = false;
        }, error => {
          this.toast.error(this.translate.instant('global_error_fail'));
          this.isConfirmLoading = false;
        });
    }
    //Cập nhật
    else {
      data.atId = this.atId;
      this.apptypesService.Update(this.atId, data)
        .subscribe((res: any) => {
          if (res.code == 201) {
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

}
