import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureExtrasComponent } from './configure-extras.component';

describe('ConfigureExtrasComponent', () => {
  let component: ConfigureExtrasComponent;
  let fixture: ComponentFixture<ConfigureExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
