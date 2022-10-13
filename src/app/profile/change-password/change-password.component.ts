import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ChangePasswordDto } from '../../shared/models/auth.model';
import {Cache} from '~/app/core/lib/cache';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  
  isPageLoading: boolean = true;
  isConfirmLoading = false;
  validateForm!: FormGroup;
  dataForm: ChangePasswordDto = new ChangePasswordDto();

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public translate: TranslateService,
    private fb: FormBuilder
    ) { 
    this.authService.checkToken();
  }

  ngOnInit() {
    this.isPageLoading = false;
    this.authService.checkToken();
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],
      passwordNew: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]]
    });
  }
  clearData()
  {
    this.dataForm = {
      username: null,
      password: null,
      passwordNew: null,
      confirm: null
    };
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }
  submitForm(): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    
    if(this.validateForm.invalid) return;
    
    let data = this.validateForm.value;
    data.username = Cache.getCache("username");
    
    this.isConfirmLoading = true;
    this.authService.changePassword(data)
    .subscribe((res: any) => {
      this.isConfirmLoading = false;
      if(res.code == 1)
      {
        this.toast.success(this.translate.instant('global_edit_success'));
        this.clearData();
      }
      else
      {
        this.toast.warning(this.translate.instant('global_edit_fail'));
      }
    }, error => {
      this.isConfirmLoading = false;
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
    });
  }

  cancle()
  {
    this.clearData();
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.passwordNew.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

}
