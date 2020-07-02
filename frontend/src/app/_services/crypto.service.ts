import { Injectable } from '@angular/core';
import * as crypto from 'crypto';
import * as cryptoJS from 'crypto-js';

export function stringToArrayBuffer(str: string): ArrayBuffer {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function arrayBufferToString(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}


@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor() { }

  public AES = {
    generateKey: () => new Promise<string>((resolve, reject) => {
      resolve(cryptoJS.lib.WordArray.random(16).toString());
    }),
    encrypt: (data: ArrayBuffer, key: string) => {
      const text = arrayBufferToString(data);
      return this.AES.encryptStr(text, key);
    },
    encryptStr: (text: string, key: string) => new Promise<ArrayBuffer>((resolve, reject) => {
      try {
        const encrypted = cryptoJS.AES.encrypt(text, key);
        const cypherStr = encrypted.toString();
        const cypherBuffer = stringToArrayBuffer(cypherStr);
        resolve(cypherBuffer);
      } catch (err) {
        reject(err);
      }
    }),
    decrypt: (cypherData: ArrayBuffer, key: string) => new Promise<ArrayBuffer>((resolve, reject) => {
      const decrypted = cryptoJS.AES.decrypt(arrayBufferToString(cypherData), key);
      const str = decrypted.toString(cryptoJS.enc.Utf8);
      resolve(stringToArrayBuffer(str));
    })
  };

}
