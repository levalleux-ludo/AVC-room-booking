import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureRoomsComponent } from './configure-rooms.component';

describe('ConfigureRoomsComponent', () => {
  let component: ConfigureRoomsComponent;
  let fixture: ComponentFixture<ConfigureRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
