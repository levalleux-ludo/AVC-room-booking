import { TestBed } from '@angular/core/testing';

import { PdfCreatorService } from './pdf-creator.service';
import { doesNotThrow } from 'assert';

describe('PdfCreatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', (done) => {
    const service: PdfCreatorService = TestBed.get(PdfCreatorService);
    expect(service).toBeTruthy();
    const pdf = service.createBookingForm(undefined, undefined, '');
    pdf.getBlob().then(blob => {
      expect(blob).toBeTruthy();
      done();
    });
  });
});
