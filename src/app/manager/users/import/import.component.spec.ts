import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {  UsersImportComponent } from './import.component';

describe(' UsersImportComponent', () => {
  let component:  UsersImportComponent;
  let fixture: ComponentFixture< UsersImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  UsersImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( UsersImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
