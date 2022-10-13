import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMenuCreateComponent } from './create.component';

describe('ListMenuCreateComponent', () => {
  let component: ListMenuCreateComponent;
  let fixture: ComponentFixture<ListMenuCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMenuCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMenuCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
