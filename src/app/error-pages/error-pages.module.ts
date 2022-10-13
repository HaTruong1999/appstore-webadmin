import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import {ErrorPagesComponent} from './error-pages/error-pages.component';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import { NzResultModule } from 'ng-zorro-antd/result';

const routes: Routes = [
  { path: '', component: ErrorPagesComponent },
  { path: '404', component: Error404Component },
  { path: '500', component: Error500Component },
]

@NgModule({
  declarations: [Error404Component, Error500Component, ErrorPagesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NzResultModule
  ]
})
export class ErrorPagesModule { }
