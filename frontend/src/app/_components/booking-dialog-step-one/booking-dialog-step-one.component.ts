import { Component, OnInit, Input, Inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { eOrganizationType, Organization } from 'src/app/_model/organization';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { POSTCODE_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../organization-form/organization-form.component';

export interface HirersDetails {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ResponsibleDetails {
  firstName: string;
  lastName: string;
  phone: string;
}

const NEW_ORGANIZATION = {name: 'New Organization ...'};

@Component({
  selector: 'app-booking-dialog-step-one',
  templateUrl: './booking-dialog-step-one.component.html',
  styleUrls: ['./booking-dialog-step-one.component.scss']
})
export class BookingDialogStepOneComponent implements OnInit {

  @Input()
  readOnly: boolean;

  firstFormGroup: FormGroup;
  newOrganization = NEW_ORGANIZATION;

  @Output()
  get isValid() {
    return this.firstFormGroup.valid;
  }

  @Output()
  get form() {
    return this.firstFormGroup;
  }

  @Output()
  get isCharity() {
    return (this.firstFormGroup.controls.organizationDetails &&
    this.firstFormGroup.controls.organizationDetails.value.isCharity);
  }

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstFormGroup = this.fb.group({
      organization: [this.data.organization, Validators.required],
      organizationDetails: this.fb.group({
        name: [ this.data.organization ? this.data.organization.name : '', Validators.required],
        contactName: [ this.data.organization ? this.data.organization.contactName : '', Validators.required],
        address: [this.data.organization ? this.data.organization.address : '', Validators.required],
        city: [this.data.organization ? this.data.organization.city : '', Validators.required],
        postcode: [this.data.organization ? this.data.organization.postcode : '', Validators.compose([
          Validators.required, Validators.pattern(POSTCODE_REGEX)
        ])],
        phone: [this.data.organization ? this.data.organization.phone : '', Validators.compose([
          Validators.required, Validators.pattern(PHONE_REGEX)
        ])],
        email: [this.data.organization ? this.data.organization.email : '', Validators.compose([
          Validators.required, Validators.pattern(EMAIL_REGEX)
        ])],
        isCharity: [this.data.organization ? (this.data.organization.type === eOrganizationType.CHARITY) : false]
      }),
      hirersDetails: this.fb.group({
        firstName: [this.data.hirersDetails ? this.data.hirersDetails.firstName : this.authenticationService.currentUserValue.firstName, Validators.required],
        lastName: [this.data.hirersDetails ? this.data.hirersDetails.lastName : this.authenticationService.currentUserValue.lastName, Validators.required],
        email: [this.data.hirersDetails ? this.data.hirersDetails.email : this.authenticationService.currentUserValue.email, Validators.required]
      }),
      responsibleDetails: this.fb.group({
        firstName: [this.data.responsibleDetails ? this.data.responsibleDetails.firstName : this.authenticationService.currentUserValue.firstName, Validators.required],
        lastName: this.data.responsibleDetails ? this.data.responsibleDetails.lastName : [this.authenticationService.currentUserValue.lastName, Validators.required],
        phone: [this.data.responsibleDetails ? this.data.responsibleDetails.phone : this.authenticationService.currentUserValue.phone, Validators.required]
      }),
    });
  }

  ngOnInit() {
  }

  onOrganizationSelectChange(orga: Organization) {
    console.log('onOrganizationSelectChange', orga);
    this.firstFormGroup.controls.organizationDetails.patchValue(
      (orga !== this.newOrganization) ? {
        name: orga.name,
        address: orga.address,
        email: orga.email,
        phone: orga.phone,
        isCharity: orga.type === eOrganizationType.CHARITY
      } : {
        name: '',
        address : '',
        email: '',
        phone: '',
        isCharity: false
      });
  }



}
