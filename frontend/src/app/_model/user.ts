import { v4 as uuid } from 'uuid';

export enum eUserRole {
  GUEST = 'Guest',
  CUSTOMER = 'Customer',
  AVC_STAFF = 'AvcStaff',
  AVC_ADMIN = 'AvcAdmin',
  SYS_ADMIN = 'SysAdmin'
}

export function compareRoles(role1: eUserRole, role2: eUserRole) {
  if (role1 === role2) {
    return 0;
  }
  switch (role1) {
    case eUserRole.SYS_ADMIN: {
            return 1;
        }
    case eUserRole.AVC_ADMIN: {
            return (role2 === eUserRole.SYS_ADMIN) ? -1 : 1;
        }
    case eUserRole.AVC_STAFF: {
            return ((role2 === eUserRole.SYS_ADMIN) || (role2 === eUserRole.AVC_ADMIN)) ? -1 : 1;
        }
    case eUserRole.CUSTOMER: {
            return (role2 === eUserRole.GUEST) ? 1 : -1;
        }
    case eUserRole.GUEST: {
            return -1;
        }
    default: {
            console.error('Not expected default case');
        }
}
}

export class User {
  // tslint:disable-next-line: variable-name
  private _id;
  // tslint:disable-next-line: variable-name
  private _username: string;
  // tslint:disable-next-line: variable-name
  private _firstName: string;
  // tslint:disable-next-line: variable-name
  private _lastName: string;
  // tslint:disable-next-line: variable-name
  private _role: eUserRole;

  // tslint:disable-next-line: variable-name
  constructor(fetched_data: any) {
    this._id = (fetched_data.id) ? fetched_data.id : uuid();
    this._username = (fetched_data.username) ? fetched_data.username : '';
    this._firstName = (fetched_data.firstName) ? fetched_data.firstName : '';
    this._lastName = (fetched_data.lastName) ? fetched_data.lastName : '';
    this._role = (fetched_data.role) ? fetched_data.role : undefined;
  }

  equals(user: User): boolean {
    return (user) && (user.username === this.username);
}

 clone(): User {
    return new User({id: this.id, username: this.username, firstName: this.firstName, lastName: this.lastName, role: this.role});
  }

  get id() {
    return this._id;
}

get username() {
    return this._username;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get role() {
    return this._role;
  }

  set role(value: eUserRole) {
    this._role = value;
  }

  getData() {
    return {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role
    };
}

}
