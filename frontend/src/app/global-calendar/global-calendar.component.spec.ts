import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCalendarComponent } from './global-calendar.component';

describe('GlobalCalendarComponent', () => {
  let component: GlobalCalendarComponent;
  let fixture: ComponentFixture<GlobalCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
