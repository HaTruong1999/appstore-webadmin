import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerRoutingModule } from './manager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReusedModule } from '../reused/reused.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { RolesComponent } from './roles/list/roles.component';
import { RolesCreateComponent } from './roles/create/create.component';
import { AccountsComponent } from './accounts/list/accounts.component';
import { AccountsCreateComponent } from './accounts/create/create.component';
import { UsersComponent } from './users/list/users.component';
import { UsersCreateComponent } from './users/create/create.component';
import { UsersImportComponent } from './users/import/import.component';
import { ListMenuComponent } from './listmenu/list/listmenu.component';
import { ListMenuCreateComponent } from './listmenu/create/create.component';
import { SettingCreateComponent } from './setting/create/create.component'
import { SettingComponent } from './setting/list/setting.component';
import { AppsComponent } from './apps/list/apps.component';
import { ApptypesComponent } from './apptypes/list/apptypes.component';
import { WorkplacesComponent } from './workplaces/list/workplaces.component';
import { AppsCreateComponent } from './apps/create/create.component';
import { ApptypesCreateComponent } from './apptypes/create/create.component';
import { WorkplacesCreateComponent } from './workplaces/create/create.component';

@NgModule({
  declarations: [
    RolesComponent,
    RolesCreateComponent,
    AccountsComponent,
    AccountsCreateComponent,
    UsersComponent,
    UsersCreateComponent,
    UsersImportComponent,
    ListMenuComponent,
    ListMenuCreateComponent,
    SettingComponent,
    SettingCreateComponent,
    AppsComponent,
    ApptypesComponent,
    WorkplacesComponent,
    AppsCreateComponent,
    ApptypesCreateComponent,
    WorkplacesCreateComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule,
    ReusedModule,
    NzSelectModule,
    NzPaginationModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzInputNumberModule,
    NzToolTipModule,
    NzTagModule,
    NzTreeModule,
    NzTransferModule,
    NzSwitchModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTabsModule,
    NzUploadModule,
    NzCheckboxModule,
    NzTreeViewModule,
    NzTreeSelectModule,
    NzSpinModule,
    NzAvatarModule,
    NzBreadCrumbModule
  ]
})
export class ManagerModule { }
