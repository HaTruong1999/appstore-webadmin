import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptypesComponent } from './apptypes.component';

describe('ApptypesComponent', () => {
  let component: ApptypesComponent;
  let fixture: ComponentFixture<ApptypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApptypesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
