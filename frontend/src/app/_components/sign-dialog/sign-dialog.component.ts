import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-sign-dialog',
  templateUrl: './sign-dialog.component.html',
  styleUrls: ['./sign-dialog.component.scss']
})
export class SignDialogComponent implements OnInit {

  @ViewChild('signaturePad', {static: false})
  signaturePad: SignaturePad;

  signaturePadOptions = { // passed through to szimek/signature_pad constructor
    // 'minWidth': 5,
    canvasWidth: '360',
    canvasHeight: '360',
    backgroundColor: 'rgb(155,155,155)'
  };
  signatureURL: string;

  constructor(
    private dialogRef: MatDialogRef<SignDialogComponent>
  ) { }

  ngOnInit() {
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
    this.signatureURL = this.signaturePad.toDataURL();
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
    this.signatureURL = undefined;
  }

  clearSignature() {
    this.signaturePad.clear();
    this.signatureURL = undefined;
  }

  get isSigned() {
    return this.signatureURL !== undefined;
  }

  validate() {
    this.dialogRef.close(this.signaturePad.toDataURL());
  }

  cancel() {
    this.dialogRef.close(undefined);
  }


}
