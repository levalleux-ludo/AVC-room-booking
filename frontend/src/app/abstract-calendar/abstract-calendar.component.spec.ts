import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractCalendarComponent } from './abstract-calendar.component';

describe('AbstractCalendarComponent', () => {
  let component: AbstractCalendarComponent;
  let fixture: ComponentFixture<AbstractCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
