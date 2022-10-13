import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {  UsersCreateComponent } from './create.component';

describe(' UsersCreateComponent', () => {
  let component:  UsersCreateComponent;
  let fixture: ComponentFixture< UsersCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  UsersCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( UsersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
