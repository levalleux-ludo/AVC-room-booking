import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDialogStepThreeComponent } from './booking-dialog-step-three.component';

describe('BookingDialogStepThreeComponent', () => {
  let component: BookingDialogStepThreeComponent;
  let fixture: ComponentFixture<BookingDialogStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingDialogStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDialogStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
