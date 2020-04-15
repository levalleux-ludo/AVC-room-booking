import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureBookingsComponent } from './configure-bookings.component';

describe('ConfigureBookingsComponent', () => {
  let component: ConfigureBookingsComponent;
  let fixture: ComponentFixture<ConfigureBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
