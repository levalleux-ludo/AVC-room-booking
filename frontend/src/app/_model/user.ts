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
  private _phone: string;
  // tslint:disable-next-line: variable-name
  private _email: string;
  // tslint:disable-next-line: variable-name
  private _role: eUserRole;
  // tslint:disable-next-line: variable-name
  private _memberOf: any[];
  // tslint:disable-next-line: variable-name
  private _token: any;

  // tslint:disable-next-line: variable-name
  constructor(fetched_data: any) {
    this._id = (fetched_data._id) ? fetched_data._id : uuid();
    this._username = (fetched_data.username) ? fetched_data.username : '';
    this._firstName = (fetched_data.firstName) ? fetched_data.firstName : '';
    this._lastName = (fetched_data.lastName) ? fetched_data.lastName : '';
    this._phone = (fetched_data.phone) ? fetched_data.phone : '';
    this._email = (fetched_data.email) ? fetched_data.email : '';
    this._role = (fetched_data.role) ? fetched_data.role : undefined;
    this._memberOf = (fetched_data.memberOf) ? fetched_data.memberOf : [];
    this._token = (fetched_data.token) ? fetched_data.token : undefined;
  }

  equals(user: User): boolean {
    return (user) && (user.username === this.username);
}

 clone(): User {
    return new User({
      _id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      role: this.role,
      memberOf: this.memberOf
    });
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

  get phone() {
    return this._phone;
  }

  get email() {
    return this._email;
  }

  get role() {
    return this._role;
  }

  set role(value: eUserRole) {
    this._role = value;
  }

  get memberOf(): any[] {
    return this._memberOf;
  }
  set memberOf(value: any[]) {
      this._memberOf = value;
  }

  get token(): any {
    return this._token;
  }

  getData() {
    return {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        role: this.role,
        memberOf: this.memberOf
    };
}

}
