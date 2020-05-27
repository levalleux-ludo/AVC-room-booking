import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDialogStepTwoComponent } from './booking-dialog-step-two.component';

describe('BookingDialogStepTwoComponent', () => {
  let component: BookingDialogStepTwoComponent;
  let fixture: ComponentFixture<BookingDialogStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingDialogStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDialogStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
