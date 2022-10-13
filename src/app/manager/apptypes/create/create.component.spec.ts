import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptypesCreateComponent } from './create.component';

describe('ApptypesCreateComponent', () => {
  let component: ApptypesCreateComponent;
  let fixture: ComponentFixture<ApptypesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptypesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptypesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
