import { v4 as uuid } from 'uuid';
import { OrganizationService } from '../_services/organization.service';

export enum eOrganizationType {
  CHARITY = 'Non Profit',
  OTHER = 'Other'
}

export class Organization {
    private _id;
    private _name: string;
    private _address: string;
    private _email: string;
    private _phone: string;
    private _type: eOrganizationType;
    constructor(fetched_data: any) {
        this._name = (fetched_data.name) ? fetched_data.name : '';
        this._id = (fetched_data._id) ? fetched_data._id : uuid();
        this._address = (fetched_data.address) ? fetched_data.address : '';
        this._email = (fetched_data.email) ? fetched_data.email : '';
        this._phone = (fetched_data.phone) ? fetched_data.phone : '';
        this._type = (fetched_data.type) ? fetched_data.type : eOrganizationType.OTHER;
    }

    clone(): Organization {
        return new Organization({
          _id: this.id,
          name: this.name,
          address: this.address,
          email: this.email,
          phone: this.phone,
          type: this.type
        });
    }

    equals(organization: Organization): boolean {
        return (organization) && (organization.id === this.id);
    }

    copyContentFrom(original: Organization) {
        this.name = original.name;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    get address(): string {
      return this._address;
    }
    set address(value: string) {
      this._address = value;
    }

    get type(): eOrganizationType {
      return this._type;
    }
    set type(value: eOrganizationType) {
      this._type = value;
    }

    get email(): string {
      return this._email;
    }
    set email(value: string) {
      this._email = value;
    }

    get phone(): string {
      return this._phone;
    }
    set phone(value: string) {
      this._phone = value;
    }

    getData() {
        return {
            name: this.name,
            address : this.address,
            email: this.email,
            phone: this.phone,
            type: this.type
        };
    }
}
