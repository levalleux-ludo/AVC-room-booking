import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BokkingOverviewTableComponent } from './bokking-overview-table.component';

describe('BokkingOverviewTableComponent', () => {
  let component: BokkingOverviewTableComponent;
  let fixture: ComponentFixture<BokkingOverviewTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BokkingOverviewTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BokkingOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
