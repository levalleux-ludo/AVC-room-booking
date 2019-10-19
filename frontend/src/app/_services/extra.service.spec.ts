import { TestBed } from '@angular/core/testing';

import { ExtraService } from './extra.service';

describe('ExtraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtraService = TestBed.get(ExtraService);
    expect(service).toBeTruthy();
  });
});
