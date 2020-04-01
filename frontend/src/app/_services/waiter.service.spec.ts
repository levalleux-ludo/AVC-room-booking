import { TestBed } from '@angular/core/testing';

import { WaiterService } from './waiter.service';

describe('WaiterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaiterService = TestBed.get(WaiterService);
    expect(service).toBeTruthy();
  });
});
