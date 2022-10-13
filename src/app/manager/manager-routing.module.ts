import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesComponent } from './roles/list/roles.component';
import { AccountsComponent } from './accounts/list/accounts.component';
import { UsersComponent } from './users/list/users.component';
import { ListMenuComponent } from './listmenu/list/listmenu.component';
import { SettingComponent } from './setting/list/setting.component';
import { AppsComponent } from './apps/list/apps.component';
import { ApptypesComponent } from './apptypes/list/apptypes.component';

const routes: Routes = [
  { path: 'roles', component: RolesComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'apps', component: AppsComponent },
  { path: 'apptypes', component: ApptypesComponent },
  { path: 'workplaces', component: AppsComponent },
  { path: 'listmenus', component: ListMenuComponent },
  { path: 'setting', component: SettingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
