import { Component, OnInit } from '@angular/core';
import { Extra } from '../../_model/extra';
import { ExtraService } from '../../_services/extra.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';

class ExtraContext implements IItemContext {
  extra: Extra;

  constructor(extra: Extra) {
    this.extra = extra;
  }
  clone() {
    return new ExtraContext(this.extra.clone());
  }
  equals(item: IItemContext) {
    let extraContext = item as ExtraContext;
    return (extraContext) && this.extra.equals(extraContext.extra);
  }
  context() {
    return {
      extra: this.extra,
      name: this.extra.name,
      defaultRate: this.extra.defaultRate,
      setName: (value) => {this.extra.name = value;},
      setDefaultRate: (value) => {
        let regex = new RegExp(/\d[\d,\,, ]*[.|,]?\d*/);
        if (!regex.test(value)) {
          throw new Error(`Unable to parse entry '${value}' from currency format to a number.`);
        }
        let results = regex.exec(value);
        console.log("setDefaultRate() value =", value, "regex.results = ", results[0]);
        this.extra.defaultRate = +results[0];
      }
    }
  }
}
@Component({
  selector: 'app-configure-extras',
  templateUrl: './configure-extras.component.html',
  styleUrls: ['./configure-extras.component.scss']
})
export class ConfigureExtrasComponent extends ConfigureAbstractComponent implements OnInit {

  extras = [];
  _editedItem: ExtraContext;

  //////////////////////////////////////////////////////
  /// ConfigureAbstractComponent implementation
  get items(): IItemContext[] {
    return this.extras;
  }
  deleteItem = (item: IItemContext) => {
    this.extraService.deleteExtra((item as ExtraContext).extra).subscribe(() => this.refreshList());
  }
  createItem = (item: IItemContext) => {
  // createItem(item: IItemContext) {
    this.extraService.createExtra((item as ExtraContext).extra).subscribe(() => this.refreshList());
  }
  updateItem = (item: IItemContext) => {
    this.extraService.updateExtra((item as ExtraContext).extra).subscribe(() => this.refreshList());
  }
  getNewItem(): IItemContext {
    return new ExtraContext(new Extra({}));
  }
  get editedItem(): IItemContext {
    return this._editedItem;
  }
  set editedItem(item: IItemContext) {
    this._editedItem = item as ExtraContext;
  }
  get submitEnabled(): boolean {
    if (!this._editedItem)
      return false;
    let extra = (this.editedItem as ExtraContext).extra;
    return extra.name !== '';
  }
  itemToString(item: IItemContext): string {
    return (item as ExtraContext).extra.name;
  }

  //////////////////////////////////////////////////////

  // delete = (item) => {
  //   let extra: Extra = item.extra;
  //   console.log("would like to delete item: ", this.itemToString(item));
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '350px',
  //     data: {title: "Delete Confirmation", message: `Are you sure you want to delete extra '${item.name}'`}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.extraService.deleteExtra(extra).subscribe(() => this.refreshList());
  //     }
  //   });
  // }

  // update = (item) => {
  //   let extra: Extra = item.extra;
  //   console.log("would like to udpate item: ", item);
  //   this.extraService.updateExtra(extra).subscribe(
  //     () => {
  //       this.refreshList();
  //     }
  //   )
  // }

  // create = (item) => {
  //   let extra: Extra = item.extra;
  //   console.log("would like to create new item: ", item);
  //   this.extraService.createExtra(extra).subscribe(
  //     () => {
  //       this.refreshList();
  //     }
  //   )
  // }

  // newItem = () => {
  //   console.log("ConfigureRoomsComponent::newItem()");
  //   return this.extra2Context(new Extra({}));
  // }

  // getEditedItem = () => {
  //   return this.editedItem;
  // }

  // setEditedItem = (item) => {
  //   console.log("ConfigureRoomsComponent::setEditedItem()", item);
  //   this.editedItem = this.extra2Context(item.extra.clone()); // clone the context item
  // }

  // submitEnabled = () => {
  //   return this.editedItem && this.editedItem.name !== '';
  // }

  // itemToString = (item: Extra) => {
  //   return item.name;
  // }

  constructor(
    private extraService: ExtraService,
    private dialog: MatDialog
     ) {
       super();
     }


  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.extraService.getExtras().subscribe(extras => {
      this.extras = extras.map(extra => new ExtraContext(new Extra(extra)));
    });

  }


  // extra2Context(extra: Extra) {
  //   return {
  //     extra: extra,
  //     name: extra.name,
  //     defaultRate: extra.defaultRate,
  //     setName: (value) => {extra.name = value;},
  //     setDefaultRate: (value) => {extra.defaultRate = value;}
  //   }
  // }


  // get extra() {
  //   return this.editedItem.extra;
  // }
  // set extra(extra: string) {
  //   this.editedItem.extra = extra;
  // }

  // get rate() {
  //   return this.editedItem.defaultRate;
  // }
  // set rate(rate: number) {
  //   this.editedItem.defaultRate = rate;
  // }

}
