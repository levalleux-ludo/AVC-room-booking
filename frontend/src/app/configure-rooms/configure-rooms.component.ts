import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';




class Extra {
  private _id = uuid();
  constructor (
    private _extra: string,
    private _defaultRate: number
  ) {}

  clone(): Extra {
    let copy = new Extra(this.extra, this.defaultRate);
    copy._id = this._id;
    return copy;
  }

  copyContentFrom(original: Extra) {
    this.extra = original.extra;
    this.defaultRate = original.defaultRate;
  }

  get id () {
    return this._id;
  }

  get extra() {
    return this._extra;
  }
  set extra(value: string) {
    this._extra = value;
  }

  get defaultRate() {
    return this._defaultRate;
  }
  set defaultRate(value: number) {
    this._defaultRate = value;
  }

  context() {
    return {
      extra: this.extra,
      defaultRate: this.defaultRate,
      setExtra: (value) => {this.extra = value;},
      setDefaultRate: (value) => {this.defaultRate = value;}
    }
  }
}



@Component({
  selector: 'app-configure-rooms',
  templateUrl: './configure-rooms.component.html',
  styleUrls: ['./configure-rooms.component.scss']
})
export class ConfigureRoomsComponent implements OnInit {

  items = [
    new Extra('flipchart_paper_pens', 5.5),
    new Extra('projector_screen', 5.5),
    new Extra('refreshment_fullDay', 15.5),
    new Extra('refreshment_halfDay', 10)
  ];

  delete = (item) => {
    console.log("would like to delete item: ", this.itemToString(item));
  }

  update = (item) => {
    console.log("would like to udpate item: ", item);
    let toUpdate = this.items.find(candidate => (candidate.id === item.id));
    if (!toUpdate) {
      throw new Error("Unable to find extra with id " + item.id);
    }
    toUpdate.copyContentFrom(item);
  }

  create = (item) => {
    console.log("would like to create new item: ", item);
    this.items.push(item);
  }

  newItem = () => {
    console.log("ConfigureRoomsComponent::newItem()");
    return new Extra('', 0);
  }

  getEditedItem = () => {
    return this.editedItem;
  }

  getItemEditContext = () => {
    return this.editedItem.context();
  }

  setEditedItem = (item) => {
    console.log("ConfigureRoomsComponent::setEditedItem()", item);
    this.editedItem = item.clone();
  }

  submitEnabled = () => {
    return this.editedItem && this.editedItem.extra !== '';
  }

  itemToString = (item) => {
    return item.extra;
  }

  constructor() { }

  ngOnInit() {
  }

  editedItem: Extra = new Extra('', 0);

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
