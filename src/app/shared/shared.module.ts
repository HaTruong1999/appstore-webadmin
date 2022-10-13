import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingPageComponent } from './component/loading-page/loading-page.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [LoadingPageComponent],
  imports: [
    CommonModule,
    TranslateModule,
    //NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
  ],
  exports: [
    CommonModule,
    TranslateModule,
    //NgbModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingPageComponent
  ],
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    }
  }
}
