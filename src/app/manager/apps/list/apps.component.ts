import { Component, OnInit, ViewChild } from '@angular/core';
import { Cache } from '~/app/core/lib/cache';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ITEMS_PER_PAGE, ITEMS_PAGESIZE } from "~/app/core/config/pagination.constants";
import { UsersService } from '~/app/core/services/manager/users.service';
import { AppsService } from '~/app/core/services/manager/apps.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AppsCreateComponent } from '../create/create.component';
import { environment } from '~/environments/environment';
import * as utils from "../../../core/utils";
const apiUrl = environment.backEndApiURL;
const avatar_app_default = 'assets/uploads/avatar-app-default.png';

@Component({
  selector: 'apps-list',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {
  @ViewChild(AppsCreateComponent) createModal;

  title: string;
  subTitle: string;
  modalType: string;

  isPageLoading: boolean = true;
  currentPage: number = 1;
  pageSizes: number[] = ITEMS_PAGESIZE;
  currentPageSize = ITEMS_PER_PAGE;
  total = 0;
  listData = [];
  isLoadingTable = true;

  dataCustomer = [];
  custId = null;
  isLoadingButton: boolean = false;
  searchValue: string = '';
  isAdd: boolean = true;
  sort = '';

  constructor(
    public authService: AuthService,
    public toast: ToastrService,
    public usersService: UsersService,
    public appsService: AppsService,
    public translate: TranslateService,
    private modal: NzModalService,
  ) {
    //this.authService.checkMenu('apps');
    //this.authService.checkToken();
  }
  ngOnInit() {
    this.isPageLoading = false;
    this.onSearch();
  }

  onSearch() {
    //this.searchValue = this.search;
    this.getData();
  }

  getData() {
    this.isLoadingButton = true;
    this.isLoadingTable = true;
    this.appsService.Apps(this.currentPage, this.currentPageSize, this.searchValue, this.custId, this.sort)
      .subscribe((res: any) => {
        this.isLoadingButton = false;
        this.isLoadingTable = false;

        this.listData = res.items;
        if(this.listData){
          let i = 0;
          this.listData.forEach(item => {
            if(item.appAvatar)
              item.appAvatar = apiUrl + item.appAvatar;
            else
              item.appAvatar = avatar_app_default;
            
            if(item.appCreatedBy){
              if(item.appCreatedBy.userAvatar)
                item.appCreatedBy.userAvatar = apiUrl + item.appCreatedBy.userAvatar;
              else{
                i++;
                item.appCreatedBy.color = i % 7;
                item.appCreatedBy.userText = utils.get2CharacterOfFirstEarchWork(item.appCreatedBy);
              }
            }
              
          })
        }
        this.total = res.meta.totalItems;
      }, error => {
        this.isLoadingButton = false;
        this.isLoadingTable = false;

        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }
  reloadData() {
    this.searchValue = '';
    this.searchChange();
  }

  searchChange() {
    this.currentPage = 1;
    this.onSearch();
  }

  customerChange() {
    this.searchChange();
  }

  //Cập nhật
  edit(appId: string) {
    this.isAdd = false;
    this.createModal.open(appId);
  }

  //Xóa
  delete(appId: string) {
    this.modal.confirm({
      nzTitle: this.translate.instant('global_confirm_delete_title'),
      nzOkText: this.translate.instant('global_submit'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.submitDelete(appId),
      nzCancelText: this.translate.instant('global_cancel'),
    });
  }
  submitDelete(appId: string) {
    this.appsService.Delete(appId)
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

  //Thêm mới
  openCreateModal() {
    this.isAdd = true;
    this.createModal.open();
  }

  submitCreate($event) {
    if ($event) {
      if (this.isAdd)
        this.reloadData();
      else
        this.getData();
    }
  }

  //Thêm mới
  openImportModal() {
    this.isAdd = true;
    //this.importModal.open();
  }

  submitImport($event) {
    if ($event) {
      if (this.isAdd)
        this.reloadData();
      else
        this.getData();
    }
  }

  //Thay đổi số bản ghi
  onPageSizeChange(pageSize) {
    this.currentPage = 1;
    this.currentPageSize = pageSize;
    this.onSearch();
  }

  //Thay đổi trang
  onPageChange(pageIndex) {
    this.currentPage = pageIndex;
    this.onSearch();
  }

  changeQueryParam($event) {
    let listSort = [];
    if ($event != null) {
      if ($event.sort != null) {
        $event.sort.forEach(sort => {
          if (sort.value != null)
            listSort.push(sort);
        });
      }
    }
    if (listSort.length > 0) {
      let count = 0;
      let str = '{';
      listSort.forEach(item => {
        count++;
        str += '"' + item.key + '":' + (item.value == 'ascend' ? '"ASC"' : '"DESC"') + (count == listSort.length ? '' : ',');
      });
      str += '}';
      this.sort = str;
    }
    else {
      this.sort = '';
    }
    this.getData();
  }

  exportExcel() {
    this.toast.warning('Chức năng đang được phát triển');
    return;
    let jsonData = [];
    this.listData.forEach(item => {
      const { custId, appId, userCreatedby, userCreateddate, userSocketid, userUpdatedby, userUpdateddate, userAvatar, ...result } = item;
      jsonData.push(result);
    });

    let fileName = "Export" + (new Date()).getTime();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }
}
