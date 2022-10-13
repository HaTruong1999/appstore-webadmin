import { Component, OnInit, ViewChild } from '@angular/core';
import {Cache} from '~/app/core/lib/cache';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ListmenuService } from '~/app/core/services/manager/listmenu.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListMenuCreateComponent } from '../create/create.component';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

interface NzTreeNodeOptions {
  title: string;
  key: string;
  icon?: string;
  isLeaf?: boolean;
  checked?: boolean;
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  expanded?: boolean;
  children?: NzTreeNodeOptions[];
  [key: string]: NzSafeAny;
  status?: boolean;
  url?: string;
}

@Component({
  selector: 'app-listmenu',
  templateUrl: './listmenu.component.html',
  styleUrls: ['./listmenu.component.scss']
})
export class ListMenuComponent implements OnInit {

  @ViewChild(ListMenuCreateComponent) createModal;
  isPageLoading: boolean = true;
  isLoadingTable: boolean = false;

  custId = null;
  isLoadingButton: boolean = false;
  searchValue: string = '';
  isAdd: boolean = true;

  nodes = [];

  constructor(
    public authService: AuthService, 
    public toast: ToastrService,
    public listmenuService: ListmenuService, 
    private modal: NzModalService,
    public translate: TranslateService
  ) {
    this.authService.checkMenu('menus');
    this.authService.checkToken();
  }
  ngOnInit() {
    this.isPageLoading = false;
    this.onSearch();
  }

  onSearch()
  {
    this.getData();
  }

  getData()
  {
    this.isLoadingTable = true;
    this.listmenuService.ListAll()
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.nodes = [];
        if(res.data != null)
        {
          res.data.forEach(item1 => {
            let menu1 = {
              level: 1,
              code: item1.menuCode,
              title: item1.menuName,
              key: item1.menuId,
              icon: item1.icon,
              expanded: true,
              children: null,
              isLeaf: true,
              status: item1.menuStatus,
              url: item1.url
            }

            if(item1.children != null && item1.children.length > 0)
            {
              menu1.isLeaf = false;
              menu1.children = [];
              item1.children.forEach(item2 => {
                let menu2 = {
                  level: 2,
                  code: item2.menuCode,
                  title: item2.menuName,
                  key: item2.menuId,
                  icon: item2.icon,
                  expanded: true,
                  children: null,
                  isLeaf: true,
                  status: item2.menuStatus,
                  url: item2.url
                }

                if(item2.children && item2.children.length > 0)
                {
                  menu2.isLeaf = false;
                  menu2.children = [];
                  item2.children.forEach(item3 => {
                    let menu3 = {
                      level: 3,
                      code: item3.menuCode,
                      title: item3.menuName,
                      key: item3.menuId,
                      icon: item3.icon,
                      isLeaf: true,
                      status: item3.menuStatus,
                      url: item3.url
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
      this.isLoadingTable = false;
    }, error => {
      console.log(error)
      this.toast.error(this.translate.instant('global_error_fail'));
      this.isLoadingTable = false;
    });
  }

  searchChange()
  {
    this.onSearch();
  }
  reloadData()
  {
    this.searchValue = '';
    this.searchChange();
  }

  //Thêm mới
  openCreateModal()
  { 
    this.isAdd = true;
    this.createModal.open();
  }
  submitCreate($event){
    if($event)
    {
      if(this.isAdd)
        this.reloadData();
      else
        this.getData();
    }
  }

  //Cập nhật
  edit(menuId: string){
    this.isAdd = false;
    this.createModal.open(menuId);
  }

  //Xóa
  delete(menuId: string){
    this.modal.confirm({
      nzTitle: this.translate.instant('global_confirm_delete_title'),
      nzOkText: this.translate.instant('global_submit'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.submitDelete(menuId),
      nzCancelText: this.translate.instant('global_cancel'),
    });
  }
  submitDelete(menuId: string){
    this.listmenuService.Delete(menuId)
    .subscribe((res: any) => {
      if(res.code == 1)
      {
        this.toast.success(this.translate.instant('global_delete_success'));
        this.reloadData();
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

}
