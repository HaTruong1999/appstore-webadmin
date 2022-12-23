import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/list/users.component';
import { AppsComponent } from './apps/list/apps.component';
import { ApptypesComponent } from './apptypes/list/apptypes.component';
import { WorkplacesComponent } from './workplaces/list/workplaces.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'apps', component: AppsComponent },
  { path: 'apptypes', component: ApptypesComponent },
  { path: 'workplaces', component: WorkplacesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
