import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureOrganizationsComponent } from './configure-organizations.component';

describe('ConfigureOrganizationsComponent', () => {
  let component: ConfigureOrganizationsComponent;
  let fixture: ComponentFixture<ConfigureOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureOrganizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
