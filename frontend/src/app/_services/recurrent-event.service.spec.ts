import { TestBed } from '@angular/core/testing';

import { RecurrentEventService } from './recurrent-event.service';

describe('RecurrentEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecurrentEventService = TestBed.get(RecurrentEventService);
    expect(service).toBeTruthy();
  });
});
