import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Organization } from '../../_model/organization';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss']
})
export class OrganizationFormComponent implements OnInit {

  @Input()
  formGroup: FormGroup;

  @Input()
  formGroupName: string;

  @Input()
  readOnly = false;

  @Input()
  organizations: Organization[] = [];

  newOrganization: Organization;

  constructor() { }

  ngOnInit() {
  }

}
