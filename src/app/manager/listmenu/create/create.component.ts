import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ListmenuService } from '~/app/core/services/manager/listmenu.service';
import { ListmenuDto } from '~/app/shared/models/listmenu.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'listmenu-create-modal',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ListMenuCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();

  isVisible = false;
  isConfirmLoading = false;
  isSpinning = false;

  isAdd: boolean = true;
  dataForm: ListmenuDto = new ListmenuDto();
  menuId: string = null;

  validateForm!: FormGroup;
  dataCustomer = [];
  dataStatus = [
    { id: 0, text: this.translate.instant('global_unactive')},
    { id: 1, text: this.translate.instant('global_active')}
  ];
  
  dataParent = [];

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public listmenuService: ListmenuService, 
    public translate: TranslateService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      menuCode: [null, [Validators.required]],
      menuName: [null, [Validators.required]],
      menuStatus: [0, [Validators.required]],
      menuOrder: [null],
      url: [null],
      icon: ["menu"],
      menuParent: [null],
    });
    this.clearData();
  }
  
  clearData()
  {
    this.isSpinning = false;
    this.getParent();
    this.dataForm = {
      menuId: null,
      custId: null,
      menuCode: null,
      menuName: null,
      menuOrder: null,
      menuParent: null,
      menuStatus: 0,
      menuCreateddate: null,
      menuCreatedby: null,
      url: null,
      icon: "menu"
    };
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].reset();
    }
  }

  getParent()
  {
    this.listmenuService.ListAll()
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.dataParent = [];
        if(res.data != null)
        {
          res.data.forEach(item1 => {
            let menu1 = {
              level: 1,
              title: item1.menuName,
              key: item1.menuId,
              icon: item1.icon,
              expanded: true,
              children: null,
              isLeaf: true,
              disabled: false
            }

            if(item1.children != null && item1.children.length > 0)
            {
              menu1.isLeaf = false;
              menu1.children = [];
              item1.children.forEach(item2 => {
                let menu2 = {
                  level: 2,
                  title: item2.menuName,
                  key: item2.menuId,
                  icon: item2.icon,
                  expanded: true,
                  children: null,
                  isLeaf: true,
                  disabled: false
                }

                if(item2.children && item2.children.length > 0)
                {
                  menu2.isLeaf = false;
                  menu2.children = [];
                  item2.children.forEach(item3 => {
                    let menu3 = {
                      level: 3,
                      title: item3.menuName,
                      key: item3.menuId,
                      icon: item3.icon,
                      isLeaf: true,
                      disabled: false
                    }
                    menu2.children.push(menu3);
                  });
                }
                menu1.children.push(menu2);
              });
            }
            this.dataParent.push(menu1);
          });
        }
        
        this.setDisable(this.dataForm);
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
      this.menuId = id;
      this.isAdd = false;
      this.getData();
    }
    else
    {
      this.menuId = null;
      this.isAdd = true;
      this.clearData();
      this.getParent();
    }
  }
  
  getData()
  {
    if(this.menuId == null) return;
    this.isSpinning = true;
    this.listmenuService.GetOne(this.menuId)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.dataForm = res.data;
        this.getParent();
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

  setDisable(data)
  {
    this.dataParent.forEach(item1 => {
        item1.disabled = false;
        if(item1.children && item1.children.length > 0)
        {
          item1.children.forEach(item2 => {
            item2.disabled = false;
            if(item2.children && item2.children.length > 0)
            {
              item2.children.forEach(item3 => {
                item3.disabled = true;
              });
            }
          });
        }
    });

    this.dataParent.forEach(item1 => {
      if(item1.key == data.menuId)
      {
        item1.disabled = true;
        if(item1.children && item1.children.length > 0)
        {
          item1.children.forEach(item2 => {
            item2.disabled = true;
          });
        }
      }
      if(item1.children && item1.children.length > 0)
      {
        item1.children.forEach(item2 => {
          if(item2.key == data.menuId)
          {
            item2.disabled = true;
          }
        });
      }
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
    console.log(data);
    this.isConfirmLoading = false;
    //Thêm mới
    if(this.isAdd)
    {
      this.listmenuService.Create(data)
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
      data.menuId = this.menuId;
      this.listmenuService.Update(this.menuId, data)
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
