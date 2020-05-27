import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDialogStepOneComponent } from './booking-dialog-step-one.component';

describe('BookingDialogStepOneComponent', () => {
  let component: BookingDialogStepOneComponent;
  let fixture: ComponentFixture<BookingDialogStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingDialogStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDialogStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
