import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { APP_BASE_HREF, registerLocaleData } from "@angular/common";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContentAnimateDirective } from "./shared/directives/content-animate.directive";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ReusedModule } from "./reused/reused.module";
import { authInterceptorProviders } from "./shared/helper/interceptor/auth.interceptor";
import { NgbDateCustomParserFormatter } from "../app/shared/helper/formater/ngb-date-picker.formater.helper";
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import { LOCALE_ID } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

registerLocaleData(en);
registerLocaleData(vi);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ContentAnimateDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ReusedModule,
    NzMenuModule,
    NzToolTipModule,
    NzIconModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: "/",
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    //{provide: LocationStrategy, useClass: HashLocationStrategy},
    authInterceptorProviders,
    { 
      provide: NZ_I18N, 
      //useValue: vi_VN 
      useFactory: (localId: string) => {
        switch (localId) {
          case 'en':
            return en_US;
          case 'vi':
            return vi_VN;
          default:
            return en_US;
        }
      },
      deps: [LOCALE_ID]
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
