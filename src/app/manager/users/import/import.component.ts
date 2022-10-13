import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '~/app/core/services/manager/users.service';
import { RolesService } from '~/app/core/services/manager/roles.service';
import { UsersDto } from '~/app/shared/models/users.model';
import { TranslateService } from '@ngx-translate/core';
import { notPhoneNumber, phoneNumber, email } from "~/app/shared/helper/validator/validator";
import { dateTimeToJsonStringNotTime, dateTime2StringDate, stringToDateTime2 } from '~/app/shared/helper/convert/dateTime.helper';
import * as XLSX from 'xlsx';
import {Cache} from '~/app/core/lib/cache';

@Component({
  selector: 'users-import-modal',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class UsersImportComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;

  isAdd: boolean = true;
  dataForm: UsersDto = new UsersDto();
  userId: string = null;

  dataCustomer = [];
  custId = null;
  validateForm!: FormGroup;

  step = 0;

  listOfControl = [];
  fileList: File[] = [];
  dataImport = [];

  totalList = 0;
  totalExist = 0;
  totalAdd = 0;

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public usersService: UsersService, 
    public translate: TranslateService,
    public rolesService: RolesService,
    private fb: FormBuilder
  ) {
    this.custId = Cache.getCache("custId");
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      custId: [null, [Validators.required]],
    });
    this.clearData();
  }

  clearData()
  {
    this.step = 0;
    this.totalList = 0;
    this.totalExist = 0;
    this.totalAdd = 0;
    this.fileList = [];
    this.dataImport = [];
    this.listOfControl.forEach(item => {
      this.removeField(item);
    });
    this.listOfControl = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }

  open(): void {
    this.isVisible = true;
    this.clearData();
  }
  
  close(): void {
    this.isVisible = false;
  }

  beforeUpload = (file: File): boolean => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      this.toast.warning(this.translate.instant('users_import_require'));
      this.fileList = [];
      return false;
    }
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload() {

    this.isConfirmLoading = true;
    if(this.fileList.length == 0)
    {
      this.toast.warning(this.translate.instant('users_import_excel_require'));
      this.isConfirmLoading = false;
      return;
    }

    this.dataImport = [];
    this.listOfControl.forEach(item => {
      this.removeField(item);
    });
    this.listOfControl = [];

    var file = this.fileList[0];
    const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
      var data = e.target.result;
      var workbook = XLSX.read(data, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
      if (dataObjects.length > 0) {
        this.dataImport = dataObjects;
        
        let data = this.validateForm.value;
        this.dataImport.forEach(item => {
          item.active = item.active == 'Yes' ? true : false;
          item.allowSendSMS = item.allowSendSMS == 'Yes' ? true : false;
          item.allowSendEmail = item.allowSendEmail == 'Yes' ? true : false;
          item.exist = false;
          item.custId = data.custId;
          item.birthdayDto = stringToDateTime2(item.birthday);
        });
        
        this.dataImport.forEach(item => {
          this.addField({
              code: item.code, 
              lastName: item.lastName,
              middleName: item.middleName,
              firstName: item.firstName,
              birthday: item.birthday,
              gender: item.gender,
              address: item.address,
              phone: item.phone,
              email:item.email,
              allowSendSMS: item.allowSendSMS,
              allowSendEmail: item.allowSendEmail,
              active: item.active,
              exist: item.exist
          });
        });

        this.step = 1;
        this.isConfirmLoading = false;
        //console.log(this.dataImport);
      }
		}
    reader.onerror = function (ex) {
    };
		reader.readAsBinaryString(file);
  }

  addField(i: {code: string, 
              lastName: string; 
              middleName: string; 
              firstName: string; 
              birthday: string, 
              gender: string,
              address: string, 
              phone: string,
              email: string,
              allowSendSMS: boolean,
              allowSendEmail: boolean,
              active: boolean,
              exist: boolean}): void {

    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      code: `code${id}`,
      lastName: `lastName${id}`,
      middleName: `middleName${id}`,
      firstName: `firstName${id}`,
      birthday: `birthday${id}`,
      gender: `gender${id}`,
      address: `address${id}`,
      phone: `phone${id}`,
      email: `email${id}`,
      allowSendSMS: `allowSendSMS${id}`,
      allowSendEmail: `allowSendEmail${id}`,
      active: `active${id}`,
      exist: `exist${id}`,
      codeDto: i != null ? i.code : null,
      lastNameDto: i != null ? i.lastName : false,
      middleNameDto: i != null ? i.middleName : null,
      firstNameDto: i != null ?  i.firstName : null,
      birthdayDto: i != null ?  i.birthday : null,
      genderDto: i != null ?  i.gender : null,
      addressDto: i != null ?  i.address : null,
      phoneDto: i != null ?  i.phone : null,
      emailDto: i != null ?  i.email : null,
      allowSendSMSDto: i != null ?  i.allowSendSMS : false,
      allowSendEmailDto: i != null ?  i.allowSendEmail : false,
      activeDto: i != null ?  i.active : false,
      existDto: i != null ?  i.exist : false,
    };
    const index = this.listOfControl.push(control);
    //console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(this.listOfControl[index - 1].code, new FormControl((i != null ? i.code : null),  [Validators.required]));
    this.validateForm.addControl(this.listOfControl[index - 1].lastName, new FormControl((i != null ? i.lastName : null), [Validators.required]));
    this.validateForm.addControl(this.listOfControl[index - 1].middleName, new FormControl((i != null ? i.middleName : null)));
    this.validateForm.addControl(this.listOfControl[index - 1].firstName, new FormControl((i != null ? i.firstName : null), [Validators.required]));
    this.validateForm.addControl(this.listOfControl[index - 1].birthday, new FormControl((i != null ? i.birthday : null)));
    this.validateForm.addControl(this.listOfControl[index - 1].gender, new FormControl((i != null ? i.gender : null)));
    this.validateForm.addControl(this.listOfControl[index - 1].address, new FormControl((i != null ? i.address : null)));
    this.validateForm.addControl(this.listOfControl[index - 1].phone, new FormControl((i != null ? i.phone : null), [Validators.required, notPhoneNumber()]));
    this.validateForm.addControl(this.listOfControl[index - 1].email, new FormControl((i != null ? i.email : null)));
    this.validateForm.addControl(this.listOfControl[index - 1].allowSendSMS, new FormControl((i != null ? i.allowSendSMS : false)));
    this.validateForm.addControl(this.listOfControl[index - 1].allowSendEmail, new FormControl((i != null ? i.allowSendEmail : false)));
    this.validateForm.addControl(this.listOfControl[index - 1].active, new FormControl((i != null ? i.active : false)));
    this.validateForm.addControl(this.listOfControl[index - 1].exist, new FormControl((i != null ? i.exist : false)));
    //console.log(this.listOfControl);
  }

  removeField(i: { id: number; 
              code: string, 
              lastName: string; 
              middleName: string; 
              firstName: string; 
              birthday: string, 
              gender: string,
              address: string, 
              phone: string,
              email: string,
              allowSendSMS: string,
              allowSendEmail: string,
              active: string,
              exist: string
  }): void {
    if (this.listOfControl.length > 0) {
      //const index = this.listOfControl.indexOf(i);
      //this.listOfControl.splice(index, 1);
      console.log(i.code);
      this.validateForm.removeControl(i.code);
      this.validateForm.removeControl(i.lastName);
      this.validateForm.removeControl(i.middleName);
      this.validateForm.removeControl(i.firstName);
      this.validateForm.removeControl(i.birthday);
      this.validateForm.removeControl(i.gender);
      this.validateForm.removeControl(i.address);
      this.validateForm.removeControl(i.phone);
      this.validateForm.removeControl(i.email);
      this.validateForm.removeControl(i.allowSendSMS);
      this.validateForm.removeControl(i.allowSendEmail);
      this.validateForm.removeControl(i.active);
      this.validateForm.removeControl(i.exist);
    }
  }
  phoneNumber(value: string) {
    return phoneNumber(value);
  }

  email(value: string) {
    return email(value);
  }

  stepForm(step: number): void {

    if(step == 0)
    {
      this.step = 0;
    }
    if(step == 1)
    {
      this.handleUpload();
    }
    if(step == 2)
    {
       //Kiểm tra validate
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      if(this.validateForm.invalid) 
      {
        this.toast.warning(this.translate.instant('users_import_require'));
        return;
      };

      this.checkExist();
    }
    if(step == 3)
    {
      this.submitForm();
    }
  }

  checkExist()
  {
    this.isConfirmLoading = true;
    this.totalList = 0;
    this.totalExist = 0;
    this.totalAdd = 0;
    if(this.dataImport == null || this.dataImport.length == 0) return;
    let list = [];
    this.dataImport.forEach(item => {
      let im = {
        custId: item.custId, 
        userCode: item.code, 
        userPhonenumber: item.phone
      };
      list.push(im);
    });
    this.usersService.Exist(list)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
         //Kiểm tra tồn tại
         let count = 0;
         this.dataImport.forEach(item => {
            let ob = res.data.find(o => o.userCode == item.code);
            if(ob != null)
            {
              item.exist = true;
              count++;
            }
            else
            {
              item.exist = false;
            }
            
            let cont = this.listOfControl.find(o => o.codeDto == item.code);
            if(cont != null)
            {
              cont.existDto = item.exist;
            }
         });

        this.totalList = this.dataImport.length;
        this.totalExist = count;
        this.totalAdd = this.totalList - this.totalExist;
        this.step = 2;
      }
      else
      {
        this.toast.error(this.translate.instant('global_fail'));
      }
      this.isConfirmLoading = false;
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
      this.isConfirmLoading = false;
    });
  }

  submitForm() {

    //Kiểm tra validate
    if(this.dataImport == null || this.dataImport.length == 0) 
    {
      this.toast.warning(this.translate.instant('users_import_require'));
      return;
    }
    let list = [];
    this.dataImport.forEach(item => {
      if(item.exist == false)
      {
        let im = {
          custId: item.custId, 
          userCode: item.code, 
          userPhonenumber: item.phone,
          userFirstname: item.firstName, 
          userLastname: item.lastName, 
          userMiddlename: item.middleName, 
          userBirthday: item.birthdayDto != null ? dateTimeToJsonStringNotTime(item.birthdayDto) : null, 
          userGender: item.gender == "Nam" ? '1' : '0', 
          userAddress: item.address, 
          userEmail: item.email, 
          userAllowsendsms: item.allowSendSMS, 
          userAllowsendemail: item.allowSendEmail, 
          userActive: item.active
        };
        list.push(im);
      }
    });
    if(list == null || list.length == 0) 
    {
      this.toast.warning(this.translate.instant('users_import_review_not_add'));
      return;
    }
    this.isConfirmLoading = true;
    this.usersService.Import(list)
      .subscribe((res: any) => {
        if(res.code == 1)
        {
          this.toast.success(this.translate.instant('global_import_success'));
          this.onSubmit.emit(true);
          this.close();
        }
        else
        {
          this.toast.warning(this.translate.instant('global_import_fail'));
        }
        this.isConfirmLoading = false;
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
        this.isConfirmLoading = false;
      });
  }

  downloadExcel()
  {
    var link = document.createElement("a");
    link.setAttribute('download', "ImportUsers.xlsx");
    link.href = "/assets/uploads/ImportUsers.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
