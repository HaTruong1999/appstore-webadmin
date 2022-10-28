import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsCreateComponent } from './create.component';

describe('AppCreateComponent', () => {
  let component: AppsCreateComponent;
  let fixture: ComponentFixture<AppsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
