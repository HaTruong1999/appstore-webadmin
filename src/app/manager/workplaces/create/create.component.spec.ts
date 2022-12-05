import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplacesCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: WorkplacesCreateComponent;
  let fixture: ComponentFixture<WorkplacesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkplacesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplacesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
