import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMenuComponent } from './listmenu.component';

describe('ListMenuComponent', () => {
  let component: ListMenuComponent;
  let fixture: ComponentFixture<ListMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
