import { Component, OnInit } from '@angular/core';
import { MatListOption, MatDialog } from '@angular/material';
import { v4 as uuid } from 'uuid';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Organization } from '../model/organization';
import { OrganizationService } from '../_services/organization.service';

function organization2Context(organization: Organization) {
  return {
    name: organization.name,
    setName: (value) => {organization.name = value;},
  }
}

@Component({
  selector: 'app-configure-organizations',
  templateUrl: './configure-organizations.component.html',
  styleUrls: ['./configure-organizations.component.scss']
})
export class ConfigureOrganizationsComponent implements OnInit {

  organizations = [
    // new Organization("company1"),
    // new Organization("company2"),
    // new Organization("company3")
  ];
 
  delete = (organization: Organization) => {
    console.log("would like to delete organization: ", organization);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {title: "Delete Confirmation", message: `Are you sure you want to delete organization '${organization.name}'`}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.organizationService.deleteOrganization(organization).subscribe(() => this.refreshList());
      }
    });
  }

  update = (organization: Organization) => {
    console.log("would like to edit organization: ", organization);
    this.organizationService.updateOrganization(organization).subscribe(
      () => {
        this.refreshList();
      }
    )
  }

  create = (organization: Organization) => {
    console.log("would like to create a new organization called: ", organization.name);
    this.organizationService.createOrganization(organization).subscribe(
      () => {
        this.refreshList();
      }
    )
  }

  newItem = () => {
    console.log("ConfigureOrganizationsComponent::newItem()");
    return new Organization('');
  }

  getEditedItem = () => {
    return this.editedItem;
  }

  getItemEditContext = () => {
    return organization2Context(this.editedItem);
  }

  setEditedItem = (item) => {
    console.log("ConfigureOrganizationsComponent::setEditedItem()", item);
    this.editedItem = item.clone();
  }

  submitEnabled = () => {
    return this.editedItem && this.editedItem.name !== '';
  }

  itemToString = (item) => {
    return item.organization;
  }

  constructor( 
    private organizationService: OrganizationService,
    private dialog: MatDialog
     ) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.organizationService.getOrganizations().subscribe(organizations => {
      this.organizations = organizations.map(organization => new Organization(organization));
    });

  }

  editedItem: Organization = new Organization('');


}
