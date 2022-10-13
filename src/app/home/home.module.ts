import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {SharedModule} from '../shared/shared.module';
import { ReusedModule } from '../reused/reused.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReusedModule,
    NzMenuModule
  ]
})
export class OverviewModule { }
