import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrencePatternDialogComponent } from './recurrence-pattern-dialog.component';

describe('RecurrencePatternDialogComponent', () => {
  let component: RecurrencePatternDialogComponent;
  let fixture: ComponentFixture<RecurrencePatternDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurrencePatternDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrencePatternDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
