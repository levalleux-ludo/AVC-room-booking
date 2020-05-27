import { Component, OnInit, Output, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FilesService } from 'src/app/_services/files.service';
import { BookingsConfigService } from 'src/app/_services/bookings-config.service';

@Component({
  selector: 'app-booking-dialog-step-three',
  templateUrl: './booking-dialog-step-three.component.html',
  styleUrls: ['./booking-dialog-step-three.component.scss']
})
export class BookingDialogStepThreeComponent implements OnInit {

  @Input()
  readOnly: boolean;

  thirdFormGroup: FormGroup;
  tacLink = 'https://ashfordvc.org.uk/';
  tacChecked = false;

  @Output()
  get form() {
    return this.thirdFormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private bookingsConfigService: BookingsConfigService,
    private filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.thirdFormGroup = this.fb.group({
      tacChecked: false
    }, { validators: [this.tacIsChecked] });
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


}
