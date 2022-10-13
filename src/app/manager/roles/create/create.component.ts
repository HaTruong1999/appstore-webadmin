import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from '~/app/core/services/manager/roles.service';
import { RolesDto } from '~/app/shared/models/roles.model';
import { TranslateService } from '@ngx-translate/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { ListmenuService } from '~/app/core/services/manager/listmenu.service';

@Component({
  selector: 'roles-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class RolesCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: RolesDto = new RolesDto();
  roleId: string = null;

  validateForm!: FormGroup;
  dataCustomer = [];
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive')},
    { id: 1, text: this.translate.instant('global_active')}
  ];
  menuItems = [];

  defaultCheckedKeys = [];

  nodes = [];

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public rolesService: RolesService, 
    public translate: TranslateService,
    private fb: FormBuilder,
    public listmenuService: ListmenuService
  ) {
  }

  ngOnInit() {
    this.getRoles();
    this.validateForm = this.fb.group({
      roleCode: [null, [Validators.required]],
      roleName: [null, [Validators.required]],
      roleOrder: [null],
      roleStatus: [0, [Validators.required]],
    });
    this.clearData();
  }
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    console.log(this.nodes);
    
  }

  getRoles()
  {
    this.listmenuService.ListmenuRole()
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.nodes = [];
        this.menuItems = res.data;
        if(this.menuItems != null)
        {
          this.menuItems.forEach(item1 => {
            let menu1 = {
              title: item1.menuName,
              key: item1.menuId,
              expanded: true,
              children: null,
              isLeaf: true
            }

            if(item1.children != null && item1.children.length > 0)
            {
              menu1.isLeaf = false;
              menu1.children = [];
              item1.children.forEach(item2 => {
                let menu2 = {
                  title: item2.menuName,
                  key: item2.menuId,
                  expanded: true,
                  children: null,
                  isLeaf: true
                }

                if(item2.children && item2.children.length > 0)
                {
                  menu2.isLeaf = false;
                  menu2.children = [];
                  item2.children.forEach(item3 => {
                    let menu3 = {
                      title: item3.menuName,
                      key: item3.menuId,
                      isLeaf: true
                    }
                    menu2.children.push(menu3);
                  });
                }
                menu1.children.push(menu2);
              });
            }
            this.nodes.push(menu1);
          });
        }
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

  clearData()
  {
    this.isSpinning = false;
    this.defaultCheckedKeys = [];
    this.dataForm = {
      roleId: null,
      roleCode: null,
      roleName: null,
      roleOrder: null,
      roleStatus: 0,
      roleCreateddate: null,
      roleCreatedby: null,
      rolesMenus: null
    };
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }

  open(id: string): void {
    this.isVisible = true;
    if(id != undefined && id != null && id != "")
    {
      this.roleId = id;
      this.isAdd = false;
      this.getData();
    }
    else
    {
      this.roleId = null;
      this.isAdd = true;
      this.clearData();
    }
  }
  
  getData()
  {
    if(this.roleId == null) return;
    this.isSpinning = true;
    this.rolesService.GetOne(this.roleId)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.defaultCheckedKeys = [];
        this.dataForm = res.data;
        if(this.dataForm.rolesMenus != null && this.dataForm.rolesMenus.length > 0)
        {
          this.dataForm.rolesMenus.forEach(menu => {
            this.nodes.forEach(item1 => {
              if(menu.menuId == item1.key && (item1.children == null || item1.children.length == 0))
              {
                this.defaultCheckedKeys.push(menu.menuId);
              }
              if(item1.children != null && item1.children.length > 0)
              {
                item1.children.forEach(item2 => {
                  if(menu.menuId == item2.key && (item2.children == null || item2.children.length == 0))
                  {
                    this.defaultCheckedKeys.push(menu.menuId);
                  }
                  if(item2.children != null && item2.children.length > 0)
                  {
                    item2.children.forEach(item3 => {
                      if(menu.menuId == item3.key && (item3.children == null || item3.children.length == 0))
                      {
                        this.defaultCheckedKeys.push(menu.menuId);
                      }
                    });
                  }
                });
              }
            });
          });
        }
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
    //Lấy danh sách quyền đã chọn
    let checkList = [];
    this.nodes.forEach(item1 => {
      if(item1.checked == true) 
      {
        checkList.push({menuId: item1.key});
      }
      if(item1.children != null && item1.children.length > 0)
      {
        item1.children.forEach(item2 => {
          if(item2.checked == true) 
          {
            checkList.push({menuId: item2.key});
            checkList.push({menuId: item1.key});
          }
          if(item2.children != null && item2.children.length > 0)
          {
            item2.children.forEach(item3 => {
              if(item3.checked == true) 
              {
                checkList.push({menuId: item3.key});
                checkList.push({menuId: item2.key});
                checkList.push({menuId: item1.key});
              }
            });
          }
        });
      }
    });
    
    let data = this.validateForm.value;
    data.rolesMenus = checkList;
    
    this.isConfirmLoading = true;
    //Thêm mới
    if(this.isAdd)
    {
      this.rolesService.Create(data)
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
      data.roleId = this.roleId;
      this.rolesService.Update(this.roleId, data)
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
