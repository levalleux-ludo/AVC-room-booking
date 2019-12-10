import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitDBComponent } from './init-db.component';

describe('InitDBComponent', () => {
  let component: InitDBComponent;
  let fixture: ComponentFixture<InitDBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitDBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
