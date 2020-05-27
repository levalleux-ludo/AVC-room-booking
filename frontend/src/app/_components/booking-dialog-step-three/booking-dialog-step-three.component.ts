import { Component, OnInit, Output, Inject, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FilesService } from 'src/app/_services/files.service';
import { BookingsConfigService } from 'src/app/_services/bookings-config.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignDialogComponent } from '../sign-dialog/sign-dialog.component';

@Component({
  selector: 'app-booking-dialog-step-three',
  templateUrl: './booking-dialog-step-three.component.html',
  styleUrls: ['./booking-dialog-step-three.component.scss']
})
export class BookingDialogStepThreeComponent implements OnInit, AfterViewInit {

  @Input()
  readOnly: boolean;

  @ViewChild('signaturePad', {static: false})
  signaturePad: SignaturePad;

  thirdFormGroup: FormGroup;
  tacLink = 'https://ashfordvc.org.uk/';
  tacChecked = false;
  signaturePadOptions = { // passed through to szimek/signature_pad constructor
    // 'minWidth': 5,
    canvasWidth: '360px',
    canvasHeight: '640px',
    backgroundColor: 'rgb(200,200,200)'
  };
  signatureURL: string;


  @Output()
  get form() {
    return this.thirdFormGroup;
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private bookingsConfigService: BookingsConfigService,
    private filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.thirdFormGroup = this.fb.group({
      tacChecked: new FormControl(false),
      signatureURL: new FormControl(undefined)
    }, { validators: [this.tacIsChecked, this.checkIsSigned] });
  }

  ngAfterViewInit(): void {
    // this.signaturePad.onEndEvent.subscribe((data) => {
    //   console.log(data);
    // });
  }

  ngOnInit() {
    this.bookingsConfigService.get().subscribe((bookingsConfig) => {
      if (bookingsConfig.termsAndConditions && (bookingsConfig.termsAndConditions.fileId !== '')) {
        this.filesService.getFileUrl(bookingsConfig.termsAndConditions.fileId).subscribe((url) => {
          this.tacLink = url;
        });
      }
    });
  }

  tacIsChecked(form: FormGroup) {
    if (!form.controls.tacChecked.value) {
      return { tacNotChecked: true };
    }
    return null;
  }

  checkIsSigned(form: FormGroup) {
    if (!form.controls.signatureURL.value) {
      return { notSigned: true };
    }
    return null;
  }

  get isSigned() {
    return this.form.controls.signatureURL.value !== undefined;
  }

  sign() {
    const confirmDialog = this.dialog.open(SignDialogComponent);
    confirmDialog.afterClosed().subscribe((result) => {
      console.log('Sign dialog closed', result);
      this.form.controls.signatureURL.patchValue(result);
    });
  }


}
