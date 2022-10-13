import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent implements OnInit {
  @Input() isPageLoading: boolean = true
  constructor() { }

  ngOnInit(): void {
  }

}
