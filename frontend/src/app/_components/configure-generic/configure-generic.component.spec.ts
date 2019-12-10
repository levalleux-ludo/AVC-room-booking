import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureGenericComponent } from './configure-generic.component';

describe('ConfigureGenericComponent', () => {
  let component: ConfigureGenericComponent;
  let fixture: ComponentFixture<ConfigureGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
