import { Component, OnInit } from '@angular/core';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';
import { User, eUserRole } from 'src/app/_model/user';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services';

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
      role: this.user.role,
      setRole: (value) => { this.user.role = value; }
    };
  }
}


@Component({
  selector: 'app-configure-users',
  templateUrl: './configure-users.component.html',
  styleUrls: ['./configure-users.component.scss']
})
export class ConfigureUsersComponent extends ConfigureAbstractComponent implements OnInit {

  users: UserContext[] = [];
  // tslint:disable-next-line: variable-name
  _editedItem: UserContext;

  allAvailableRoles = Object.values(eUserRole);

  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
    super();
   }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.userService.getUsers().subscribe(users => {
      this.users = users.map(user => new UserContext(new User(user)));
    });

  }

  isEditable(item) {
    let currentUser = this.authenticationService.currentUserValue;
    return currentUser && ((item as UserContext).user.id !== currentUser._id);
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
    this.userService.changeRole((item as UserContext).user).subscribe(() => this.refreshList());
  }
  getNewItem(): IItemContext {
    return new UserContext(new User({}));
  }
  get editedItem(): IItemContext {
    return this._editedItem;
  }
  set editedItem(item: IItemContext) {
    this._editedItem = item as UserContext;
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

