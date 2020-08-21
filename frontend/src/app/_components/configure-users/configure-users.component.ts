import { Component, OnInit, Input } from '@angular/core';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';
import { User, eUserRole, compareRoles } from 'src/app/_model/user';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services';
import { OrganizationService } from 'src/app/_services/organization.service';
import { Organization } from 'src/app/_model/organization';
import { WaiterService } from 'src/app/_services/waiter.service';

var allOrganizations: Organization[] = [];

function getOrganizationFromId(organizationId): Organization {
  const organization = allOrganizations.find(orga => (orga.id === organizationId));
  if (!organization) {
    console.error('Unable to find Oragnization with Id:', organizationId);
  }
  return organization;
}

function compareOrganizations(orga1: Organization, orga2: Organization): boolean {
  if (orga1 && orga2) {
    return orga1.equals(orga2);
  }
  return orga1 === orga2;
}

class UserContext implements IItemContext {
  user: User;

  public constructor(user: User) {
    this.user = user;
  }
  public clone() {
    return new UserContext(this.user.clone());
  }
  public equals(item: IItemContext) {
    const userContext = item as UserContext;
    return (userContext) && this.user.equals(userContext.user);
  }
  public context(): any {
    return {
      user: this.user,
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      role: this.user.role,
      memberOf: this.user.memberOf.map(orgaId => getOrganizationFromId(orgaId)).filter(orga => (orga != undefined)),
      allOrganizations: allOrganizations,
      compareOrganizations: compareOrganizations,
      setRole: (value) => { this.user.role = value; },
      setMemberOf: (value) => {
        const orgaIds = value.map(orga => orga.id);
        this.user.memberOf = orgaIds;
      },
      setEmail: (value) => { this.user.email = value; },
      setPhone: (value) => { this.user.phone = value; },
      setFirstName: (value) => {
        this.user.firstName = value;
      },
      setLastName: (value) => { this.user.lastName = value; }
    };
  }
}

@Component({
  selector: 'app-configure-users',
  templateUrl: './configure-users.component.html',
  styleUrls: ['./configure-users.component.scss']
})
export class ConfigureUsersComponent extends ConfigureAbstractComponent implements OnInit {

  /**
   * refresh is a method used to register the current component on some events it would have to refresh some of its data
   * In the current case, the organizations list needs to be refreshed because it may have changed since the component has been instanciated
   *
   * @memberof ConfigureUsersComponent
   */
  @Input()
  refresh: { index: number, register: (index: number,  refreshComponent: () => void ) => void };

  users: UserContext[] = [];
  // tslint:disable-next-line: variable-name
  _editedItem: UserContext;
  _original: UserContext;


  allAvailableRoles = Object.values(eUserRole);

  availableRoles() {
    const currentUser = this.authenticationService.currentUserValue;
    if (!currentUser) {
      return [];
    }
    switch (currentUser.role) {
      case eUserRole.GUEST:
      case eUserRole.CUSTOMER: {
        return [];
      }
      case eUserRole.AVC_STAFF: {
        return [eUserRole.CUSTOMER];
      }
      case eUserRole.AVC_ADMIN: {
        return [eUserRole.CUSTOMER, eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN];
      }
      case eUserRole.SYS_ADMIN: {
        return [eUserRole.CUSTOMER, eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN];
      }
    }
  }

  canChangeRole() {
    const currentUser = this.authenticationService.currentUserValue;
    return currentUser &&
     this.editedItem &&
      ((this.editedItem as UserContext).user.id !== currentUser.id) &&
       ( compareRoles(currentUser.role, (this.editedItem as UserContext).user.role) >= 0 );
  }

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private organizationService: OrganizationService,
    private waiter: WaiterService
    ) {
    super();
    waiter.init();
  }

  ngOnInit() {
    this.refreshList();
    this.refreshOrganizations();
    if (this.refresh) {
      // if refresh handler is set, call it to register on events that would require the component to refresh some data
      this.refresh.register(this.refresh.index, () => {
        this.refreshOrganizations();
      });
    }
  }

  refreshList() {
    const waiterTask = this.waiter.addTask();
    this.userService.getUsers().subscribe(users => {
      this.waiter.removeTask(waiterTask);
      this.users = users.map(user => new UserContext(new User(user)));
    }, err => {
      this.waiter.removeTask(waiterTask);
      alert(err);
    });
  }

  refreshOrganizations() {
    const waiterTask = this.waiter.addTask();
    this.organizationService.getOrganizations().subscribe(organizations => {
      this.waiter.removeTask(waiterTask);
      allOrganizations = organizations.map(orga => new Organization(orga));
      console.log('allOrganizations', allOrganizations);
    }, err => {
      this.waiter.removeTask(waiterTask);
      alert(err);
    });
  }

  isEditable(item) {
    const currentUser = this.authenticationService.currentUserValue;
    return currentUser &&
     this.availableRoles().length > 1;
    //  return currentUser &&
    //  this.availableRoles().length > 1 &&
    //  ((item as UserContext).user.id !== currentUser.id);
  }

  canDelete(item) {
    return false;
  }

  canAdd() {
    return false;
  }


  get items(): IItemContext[] {
    return this.users;
  }
  deleteItem = (item: IItemContext) => {
    console.error('delete user is not implemented');
  }
  createItem = (item: IItemContext) => {
    console.error('create user is not implemented');
  }
  updateItem = (item: IItemContext) => {
    const user: User = (item as UserContext).user;
    if ((user.firstName !== this._original.user.firstName)
    || (user.lastName !== this._original.user.lastName)
    || (user.email !== this._original.user.email)
    || (user.phone !== this._original.user.phone)) {
      this.userService.updateUser(user).subscribe(() => {
        this.refreshList();
        this.authenticationService.refresh();
      });
    }
    if (user.role !== this._original.user.role) {
      this.userService.changeRole(user).subscribe(() => {
        this.refreshList();
        this.authenticationService.refresh();
      });
    }
    if (user.memberOf !== this._original.user.memberOf) {
      this.userService.changeMemberOf(user).subscribe(() => {
        this.refreshList();
        this.authenticationService.refresh();
      });
    }
  }
  getNewItem(): IItemContext {
    return new UserContext(new User({}));
  }
  get editedItem(): IItemContext {
    return this._editedItem;
  }
  set editedItem(item: IItemContext) {
    this._editedItem = item as UserContext;
    this._original = item.clone();
  }
  get submitEnabled(): boolean {
    if (!this._editedItem) {
      return false;
    }
    const user = (this.editedItem as UserContext).user;
    return user.username !== '' && user.firstName !== '' && user.lastName !== '';
  }
  itemToString(item: IItemContext): string {
    return `${(item as UserContext).user.firstName} ${(item as UserContext).user.lastName}`;
  }

}

