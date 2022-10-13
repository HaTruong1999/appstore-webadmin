import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RolesCreateComponent } from './create.component';

describe('RolesCreateComponent', () => {
  let component: RolesCreateComponent;
  let fixture: ComponentFixture<RolesCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
