import { v4 as uuid } from 'uuid';
import { OrganizationService } from '../_services/organization.service';

export class Organization {
    private _id;
    private _name: string;
    constructor(fetched_data: any) {
        this._name = (fetched_data.name)?fetched_data.name:'';
        this._id = (fetched_data.id)?fetched_data.id:uuid();
    }

    clone(): Organization {
        return new Organization({id: this.id, name: this.name});
    }

    equals(organization: Organization): boolean {
        return (organization) && (organization.id === this.id);
    }

    copyContentFrom(original: Organization) {
        this.name = original.name;
    }

    get id () {
        return this._id;
    }

    get name() {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    getData() {
        return {
            name: this.name
        };
    }
}
  