import { TestBed } from '@angular/core/testing';

import { BookingsConfigService } from './bookings-config.service';

describe('BookingsConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookingsConfigService = TestBed.get(BookingsConfigService);
    expect(service).toBeTruthy();
  });
});
