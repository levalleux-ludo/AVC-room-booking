import { TestBed } from '@angular/core/testing';

import { PdfCreatorService } from './pdf-creator.service';
import { doesNotThrow } from 'assert';
import { Booking, BookingPrivateData } from '../_model/booking';
import { CryptoService } from './crypto.service';

const privateData = {
  title:"zzdz",
  details:"",
  organizationId:"5ed11bcb6c568c1314393ece",
  extras:[],
  totalPrice:3.5,
  hirersDetails:{
    firstName:"Administrator",
    lastName:"A",
    email:"a@b.c"
  },
  responsibleDetails:{
    firstName:"Administrator",
    lastName:"A",
    phone:"01234567890"
  },
  encryptionKey:""
};

const booking = new Booking({
  ref:"15908498510870",
  startDate:"2020-06-01T10:30:00.000Z",
  endDate:"2020-06-01T11:00:00.000Z",
  roomId:"5e67ddf64f535e48ac679fc8",
  nbPeopleExpected:1,
  recurrencePatternId:null,
  bookingFormId:"",
  privateData: privateData
});

const data = {
  signatureURL: 'data:image/png;base64,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9f73v/8tH/jAB0q89g9/+EPzz2+88UZ54oknymabbdb89/dali1bVt55551m/QcffLBpkMm135bHKCCgx4g9DZuKQL377rvL73//+87u7L333uXTn/50E56DLnFEHkfYf/3rX8trr71WHn300fLcc8/Nu7qPf/zjZffddy9r1qwZdJNeRyC9gIBO36JcBZ544omdgrbZZptywgknjOxo9sknnyzPPPNM+eUvf1neeuutZpqk9+TjV7/6VVMfuYaIaoYoIKCHiDntq/r2t79d/vOf/zS7GdMZ3/jGN8puu+02tt2OaZKYConQ/tWvflVeffXVZtvHH398M61iITBtAgJ62jo6ov05//zzS0xD1HD+4Q9/OKIt9b/adevWlb///e9l9erV5Vvf+lb/L/STBFoiIKBb0qhJlnnBBReUuMY5lrgE7rLLLptkOZ1tf+973ysvv/xy2WmnnUq8gVgITJvAUAP6jjvucNJmykZI9LReShfTGhmOnIM4TlL+9Kc/LTHt8bWvfa0ccsghUyZvdwgM8UaV+hE40y+xBi9NoDucY03r169f2gqH9Oruy/ycJBwSqtWkFBjaEXT3HOVxxx1XDjrooJQ7rKj+BHqvdT7jjDNGdrVGfxWV5gRhvGnE33Gd9YEHHugTW794fq6VAkML6Lj86ayzzuogXHjhheWjH/1oK1EUXcpPfvKT8utf/7qhOOqooyYehDfddFNzuV0scUfhYYcdZnwZqFMvMLSADqnrrruucwNDhl/qqe/eiHbwkUceKZdffnln7THvPKmn0cXldDHXHMs+++xTPvWpTy3phpgRkVktgZEIDDWgez8WZ5mzHIncFK+0e+55Um+08YksTk7Gg5hiOeaYY5q7FeMqEguBWREYakAHWvdH0U9+8pPNnWaW9gjEjSg/+MEPOjeBTOJNNkI5wjlCOm5AiRtRLARmUWDoAf3CCy+U73//+x3LU089tcRzEyztEIhwvP7665tix330HIF86623lgcffLA5CRjB7NnQ7Rg3qhyNwNADOsq85pprml+yWPbYY4/yzW9+0wmd0fRv6Gs999xzOw8puuKKK5qnzo1jiTeGCOe4rjlOAMabw7i2PY79sw0CgwiMJKDjiWRXXXVV+d///tfUFE85+/KXv1w++MEPDlKj14xJoPtKnDhyjUvrRr1EIN9www3NG/r73//+snbt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'
};


describe('PdfCreatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', (done) => {
    const service: PdfCreatorService = TestBed.get(PdfCreatorService);
    expect(service).toBeTruthy();
    const pdf = service.createBookingForm(booking, privateData, data.signatureURL);
    pdf.getBlob().then(blob => {
      expect(blob).toBeTruthy();
      done();
    });
  });

  // it('PDF blob encryption', (done) => {
  //   const service: PdfCreatorService = TestBed.get(PdfCreatorService);
  //   expect(service).toBeTruthy();
  //   const pdf = service.createBookingForm(booking, privateData, data.signatureURL);
  //   const cryptoService: CryptoService = TestBed.get(CryptoService);
  //   expect(cryptoService).toBeTruthy();
  //   cryptoService.AES.generateKey().then((key: string) => {
  //     expect(key).toBeTruthy();
  //     pdf.getBlob().then((blob: Blob) => {
  //       expect(blob).toBeTruthy();
  //       new Response(blob).arrayBuffer().then(buffer => {
  //         expect(buffer).toBeTruthy();
  //         cryptoService.AES.encrypt(buffer, key).then((cypherPdfData: ArrayBuffer) => {
  //           expect(cypherPdfData).toBeTruthy();
  //           done();
  //         });
  //       });
  //     });
  //   });
  // });

  it('PDF text encryption', (done) => {
    const service: PdfCreatorService = TestBed.get(PdfCreatorService);
    expect(service).toBeTruthy();
    const pdf = service.createBookingForm(booking, privateData, data.signatureURL);
    const cryptoService: CryptoService = TestBed.get(CryptoService);
    expect(cryptoService).toBeTruthy();
    cryptoService.AES.generateKey().then((key: string) => {
      expect(key).toBeTruthy();
      pdf.getStrBase64().then((text) => {
        expect(text).toBeTruthy();
        cryptoService.AES.encryptStr(text, key).then((cypherPdfData: ArrayBuffer) => {
          expect(cypherPdfData).toBeTruthy();
          done();
        });
      });
    });
  });
});
