import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFullCalendarComponent } from './test-full-calendar.component';

describe('TestFullCalendarComponent', () => {
  let component: TestFullCalendarComponent;
  let fixture: ComponentFixture<TestFullCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFullCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFullCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
