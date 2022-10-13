import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error-pages',
  templateUrl: './error-pages.component.html',
  styleUrls: ['./error-pages.component.scss']
})
export class ErrorPagesComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.checkLang();
  }

  checkLang(){
    let langCode = localStorage.getItem("lang");
    this.translate.use(langCode);
  }
}
