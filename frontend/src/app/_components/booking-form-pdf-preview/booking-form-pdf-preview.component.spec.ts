import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormPdfPreviewComponent } from './booking-form-pdf-preview.component';

describe('BookingFormPdfPreviewComponent', () => {
  let component: BookingFormPdfPreviewComponent;
  let fixture: ComponentFixture<BookingFormPdfPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingFormPdfPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFormPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
