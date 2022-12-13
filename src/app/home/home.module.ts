import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule} from '../shared/shared.module';
import { ReusedModule } from '../reused/reused.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeComponent } from './home/home.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReusedModule,
    NzIconModule,
    NzMenuModule,
    NzTreeSelectModule,
    NzDatePickerModule,
    NzButtonModule,
  ]
})
export class OverviewModule { }
