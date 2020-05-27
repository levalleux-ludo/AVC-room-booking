import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatListOption, MatDialog } from '@angular/material';
import { v4 as uuid } from 'uuid';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Organization, eOrganizationType } from '../../_model/organization';
import { OrganizationService } from '../../_services/organization.service';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { POSTCODE_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../organization-form/organization-form.component';

class OrganizationContext implements IItemContext {
  organization: Organization;
  form: FormGroup;

  constructor(organization: Organization, form: FormGroup) {
    this.organization = organization;
    this.form = form;
  }
  clone() {
    return new OrganizationContext(this.organization.clone(), this.form);
  }
  equals(item: IItemContext) {
    let organizationContext = item as OrganizationContext;
    return (organizationContext) && this.organization.equals(organizationContext.organization);
  }
  context() {
    return {
      organization: this.organization,
      name: this.organization.name,
      contactName: this.organization.contactName,
      setName: (value) => { this.organization.name = value; },
      form: this.form,
      address: this.organization.address + '\n' + this.organization.postcode + ' ' + this.organization.city,
      email: this.organization.email,
      phone: this.organization.phone,
      type: this.organization.type
    };
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
  form: FormGroup;

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
    const form = (item as OrganizationContext).form;
    const orga = new Organization({
      name: form.value.name,
      contactName: form.value.contactName,
      address: form.value.address,
      city: form.value.city,
      postcode: form.value.postcode,
      email: form.value.email,
      phone: form.value.phone,
      type: form.value.isCharity ? eOrganizationType.CHARITY : eOrganizationType.OTHER
    });
    this.organizationService.createOrganization(orga).subscribe(() => this.refreshList());
  }
  updateItem = (item: IItemContext) => {
    const form = (item as OrganizationContext).form;
    const orga = (item as OrganizationContext).organization;
    Object.assign(orga, {
      name: form.value.name,
      contactName: form.value.contactName,
      address: form.value.address,
      city: form.value.city,
      postcode: form.value.postcode,
      email: form.value.email,
      phone: form.value.phone,
      type: form.value.isCharity ? eOrganizationType.CHARITY : eOrganizationType.OTHER
    });
    this.organizationService.updateOrganization(orga).subscribe(() => this.refreshList());
  }
  getNewItem(): IItemContext {
    return new OrganizationContext(new Organization({}), this.createForm(undefined));
  }
  get editedItem(): IItemContext {
    return this._editedItem;
  }
  set editedItem(item: IItemContext) {
    this._editedItem = item as OrganizationContext;
    if (this._editedItem) {
      this._editedItem.form = this.createForm(this._editedItem.organization);
    }
  }
  get submitEnabled(): boolean {
    if (!this._editedItem || !this._editedItem.form)
      return false;
    // let organization = (this.editedItem as OrganizationContext).organization;
    // return organization.name !== '';
    return this._editedItem.form.valid;
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
    private fb: FormBuilder,
    private dialog: MatDialog
     ) {
       super();

     }

  ngOnInit() {
    this.refreshList();
  }

  createForm(orga: Organization) {
    return this.fb.group({
      name: [orga ? orga.name : '', Validators.required],
      contactName: [orga ? orga.contactName : '', Validators.required],
      address: [orga ? orga.address : '', Validators.required],
      city: [orga ? orga.city : '', Validators.required],
      postcode: [orga ? orga.postcode : '', Validators.compose([
        Validators.required, Validators.pattern(POSTCODE_REGEX)
      ])],
      phone: [orga ? orga.phone : '', Validators.compose([
        Validators.required, Validators.pattern(PHONE_REGEX)
      ])],
      email: [orga ? orga.email : '', Validators.compose([
        Validators.required, Validators.pattern(EMAIL_REGEX)
      ])],
      isCharity: [orga ? orga.type === eOrganizationType.CHARITY : false, Validators.nullValidator]
     });
  }

  refreshList() {
    this.organizationService.getOrganizations().subscribe(organizations => {
      this.organizations = organizations.map(organization => {
        const orga = new Organization(organization);
        return new OrganizationContext(orga, this.createForm(orga));
      });
    }, err => alert(err));

  }

  // organization2Context(organization: Organization) {
  //   return {
  //     organization: organization,
  //     name: organization.name,
  //     setName: (value) => {organization.name = value;},
  //   }
  // }


}
