import { Component, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material';
import { v4 as uuid } from 'uuid';


class Organization {
  private _id = uuid();
  constructor (
    private _organization: string,
  ) {}

  clone(): Organization {
    let copy = new Organization(this.organization);
    copy._id = this._id;
    return copy;
  }

  copyContentFrom(original: Organization) {
    this.organization = original.organization;
  }

  get id () {
    return this._id;
  }

  get organization() {
    return this._organization;
  }
  set organization(value: string) {
    this._organization = value;
  }

  context() {
    return {
      organization: this.organization,
      setOrganization: (value) => {this.organization = value;},
    }
  }
}


@Component({
  selector: 'app-configure-organisations',
  templateUrl: './configure-organisations.component.html',
  styleUrls: ['./configure-organisations.component.scss']
})
export class ConfigureOrganisationsComponent implements OnInit {

  organizations = [
    new Organization("company1"),
    new Organization("company2"),
    new Organization("company3")
  ];
 
  delete(organization) {
    console.log("would like to delete organization: ", organization);
  }

  edit(organization) {
    console.log("would like to edit organization: ", organization);
  }

  create(name: string) {
    console.log("would like to create a new organization called: ", name);
  }

  newItem = () => {
    console.log("ConfigureOrganizationsComponent::newItem()");
    return new Organization('');
  }

  getEditedItem = () => {
    return this.editedItem;
  }

  getItemEditContext = () => {
    return this.editedItem.context();
  }

  setEditedItem = (item) => {
    console.log("ConfigureOrganizationsComponent::setEditedItem()", item);
    this.editedItem = item.clone();
  }

  submitEnabled = () => {
    return this.editedItem && this.editedItem.organization !== '';
  }

  itemToString = (item) => {
    return item.organization;
  }

  constructor() { }

  ngOnInit() {
  }

  editedItem: Organization = new Organization('');


}
