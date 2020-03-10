import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatListOption, MatDialog } from '@angular/material';
import { v4 as uuid } from 'uuid';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Organization } from '../../_model/organization';
import { OrganizationService } from '../../_services/organization.service';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';

class OrganizationContext implements IItemContext {
  organization;

  constructor(organization: Organization) {
    this.organization = organization;
  }
  clone() {
    return new OrganizationContext(this.organization.clone());
  }
  equals(item: IItemContext) {
    let organizationContext = item as OrganizationContext;
    return (organizationContext) && this.organization.equals(organizationContext.organization);
  }
  context() {
    return {
      organization: this.organization,
      name: this.organization.name,
      setName: (value) => {this.organization.name = value;},
    }
  }
}
@Component({
  selector: 'app-configure-organizations',
  templateUrl: './configure-organizations.component.html',
  styleUrls: ['./configure-organizations.component.scss']
})
export class ConfigureOrganizationsComponent extends ConfigureAbstractComponent implements OnInit {

  organizations = [];
  _editedItem: OrganizationContext;
  @ViewChild('itemEditTemplate', { static: true }) itemEditTemplateRef: TemplateRef<any>;

   //////////////////////////////////////////////////////
  /// ConfigureAbstractComponent implementation
  get items(): IItemContext[] {
    return this.organizations;
  }
  deleteItem = (item: IItemContext) => {
    this.organizationService.deleteOrganization((item as OrganizationContext).organization).subscribe(() => this.refreshList());
  }
  createItem = (item: IItemContext) => {
  // createItem(item: IItemContext) {
    this.organizationService.createOrganization((item as OrganizationContext).organization).subscribe(() => this.refreshList());
  }
  updateItem = (item: IItemContext) => {
    this.organizationService.updateOrganization((item as OrganizationContext).organization).subscribe(() => this.refreshList());
  }
  getNewItem(): IItemContext {
    return new OrganizationContext(new Organization({}));
  }
  get editedItem(): IItemContext {
    return this._editedItem;
  }
  set editedItem(item: IItemContext) {
    this._editedItem = item as OrganizationContext;
  }
  get submitEnabled(): boolean {
    if (!this._editedItem)
      return false;
    let organization = (this.editedItem as OrganizationContext).organization;
    return organization.name !== '';
  }
  itemToString(item: IItemContext): string {
    return (item as OrganizationContext).organization.name;
  }
  isEditable(item) {
    return true;
  }

  canDelete(item) {
    return true;
  }

  canAdd() {
    return true;
  }

  //////////////////////////////////////////////////////

  // delete = (item) => {
  //   let organization = item.organization;
  //   console.log("would like to delete organization: ", organization);
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '350px',
  //     data: {title: "Delete Confirmation", message: `Are you sure you want to delete organization '${organization.name}'`}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.organizationService.deleteOrganization(organization).subscribe(() => this.refreshList());
  //     }
  //   });
  // }

  // update = (item) => {
  //   let organization = item.organization;
  //   console.log("would like to edit organization: ", organization.name);
  //   this.organizationService.updateOrganization(organization).subscribe(
  //     () => {
  //       this.refreshList();
  //     }
  //   )
  // }

  // create = (item) => {
  //   let organization = item.organization;
  //   console.log("would like to create a new organization called: ", organization.name);
  //   this.organizationService.createOrganization(organization).subscribe(
  //     () => {
  //       this.refreshList();
  //     }
  //   )
  // }

  // newItem = () => {
  //   console.log("ConfigureOrganizationsComponent::newItem()");
  //   return this.organization2Context(new Organization(''));
  // }

  // getEditedItem = () => {
  //   return this.editedItem;
  // }

  // setEditedItem = (item) => {
  //   console.log("ConfigureOrganizationsComponent::setEditedItem()", item);
  //   this.editedItem = this.organization2Context(item.organization.clone()); // clone item context
  // }

  // submitEnabled = () => {
  //   return this.editedItem && this.editedItem.name !== '';
  // }

  // itemToString = (item) => {
  //   return item.name;
  // }

  constructor(
    private organizationService: OrganizationService,
    private dialog: MatDialog
     ) {
       super();
     }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.organizationService.getOrganizations().subscribe(organizations => {
      this.organizations = organizations.map(organization => new OrganizationContext(new Organization(organization)));
    });

  }

  // organization2Context(organization: Organization) {
  //   return {
  //     organization: organization,
  //     name: organization.name,
  //     setName: (value) => {organization.name = value;},
  //   }
  // }


}
