import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestJqxSchedulerComponent } from './test-jqx-scheduler.component';

describe('TestJqxSchedulerComponent', () => {
  let component: TestJqxSchedulerComponent;
  let fixture: ComponentFixture<TestJqxSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestJqxSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestJqxSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
