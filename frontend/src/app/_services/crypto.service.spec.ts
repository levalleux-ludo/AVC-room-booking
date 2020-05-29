import { TestBed } from '@angular/core/testing';
import { CryptoService, stringToArrayBuffer, arrayBufferToString } from './crypto.service';

function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str: string): ArrayBuffer {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

describe('CryptoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', (done) => {
    const service: CryptoService = TestBed.get(CryptoService);
    expect(service).toBeTruthy();
    done();
  });

  it('should return a key', (done) => {
    const service: CryptoService = TestBed.get(CryptoService);
    service.AES.generateKey().then((key) => {
      console.log('key', key);
      expect(key).toBeTruthy();
      done();
    });
  });

  it('should encrypt the text', (done) => {
    const service: CryptoService = TestBed.get(CryptoService);
    const text = 'hello world!';
    const textAB = stringToArrayBuffer(text);
    console.log('textAB', textAB);
    service.AES.encrypt(textAB, 'toto').then((cypherBuffer) => {
      console.log('cypherBuffer', cypherBuffer);
      const cypherText = ab2str(cypherBuffer);
      console.log('cypherText', cypherText);
      expect(cypherText).toBeTruthy();
      done();
    });
  });

  it('should decrypt the text', (done) => {
    const service: CryptoService = TestBed.get(CryptoService);
    const text = 'hello world!';
    service.AES.generateKey().then((key) => {
      console.log('key', key);
      expect(key).toBeTruthy();
      service.AES.encrypt(stringToArrayBuffer(text), key).then((cypherBuffer) => {
        const cypherText = ab2str(cypherBuffer);
        console.log('cypherText', cypherText);
        expect(cypherText).toBeTruthy();
        service.AES.decrypt(str2ab(cypherText), key).then((result) => {
          console.log('result', result);
          const resultText = ab2str(result);
          console.log('resultText', resultText);
          expect(resultText).toEqual(text);
          done();
        });
      });
    });
  });
});
