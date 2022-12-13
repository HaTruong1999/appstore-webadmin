import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingPageComponent } from './component/loading-page/loading-page.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [LoadingPageComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
  ],
  exports: [
    CommonModule,
    TranslateModule,
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
