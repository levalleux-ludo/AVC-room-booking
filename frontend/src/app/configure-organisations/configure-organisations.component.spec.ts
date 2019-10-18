import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureOrganisationsComponent } from './configure-organisations.component';

describe('ConfigureOrganisationsComponent', () => {
  let component: ConfigureOrganisationsComponent;
  let fixture: ComponentFixture<ConfigureOrganisationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureOrganisationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureOrganisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
