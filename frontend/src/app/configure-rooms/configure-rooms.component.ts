import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Room } from '../model';
import { MatDialog } from '@angular/material';
import { RoomService } from '../_services/room.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Extra } from '../model/extra';
import { ExtraService } from '../_services/extra.service';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

var allAvailableExtras: Extra[];

function getExtraFromId(extraId): Extra {
  let extra = allAvailableExtras.find(extra => (extra.id === extraId));
  if (!extra) {
    console.error("Unable to find Extra with Id:", extraId);
    return extra;
  }
}

class RoomContext implements IItemContext {
  room;
  
  constructor(room: Room) {
    this.room = room;
  }
  clone() {
    return new RoomContext(this.room.clone());
  }
  context() {
    return {
      room: this.room,
      name: this.room.name,
      descriptionHTML: atob(this.room.descriptionHTML),
      defaultRate: this.room.rentRateHour,
      capacity: this.room.capacity,
      availableExtras: this.room.availableExtras.map(extraId => getExtraFromId(extraId)).filter(extra => (extra !== undefined)),
      pictures: this.room.pictures,
      setName: (value) => {this.room.name = value;},
      setDescriptionHTML: (value) => {this.room.descriptionHTML = btoa(value);},
      setDefaultRate: (value) => {this.room.rentRateHour = value;},
      setCapacity: (value) => {this.room.capacity = value;},
      setAvailableExtras: (value) => {this.room.availableExtras = value.map(extra => extra.Id);},
      setPictures: (value) => {this.room.pictures = value;}
    }
  }
}

@Component({
  selector: 'app-configure-rooms',
  templateUrl: './configure-rooms.component.html',
  styleUrls: ['./configure-rooms.component.scss']
})
export class ConfigureRoomsComponent extends ConfigureAbstractComponent implements OnInit {

  rooms = [];
  _editedItem: RoomContext;
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
};


  //////////////////////////////////////////////////////
  /// ConfigureAbstractComponent implementation
  get items(): IItemContext[] {
    return this.rooms;
  }
  deleteItem = (item: IItemContext) => {
    this.roomService.deleteRoom((item as RoomContext).room).subscribe(() => this.refreshList());
  }
  createItem = (item: IItemContext) => {
    this.roomService.createRoom((item as RoomContext).room).subscribe(() => this.refreshList());
  }
  updateItem = (item: IItemContext) => {
    this.roomService.updateRoom((item as RoomContext).room).subscribe(() => this.refreshList());
  }
  getNewItem(): IItemContext {
    return new RoomContext(new Room({}));
  }
  get editedItem(): IItemContext {
    return this._editedItem;
  }
  set editedItem(item: IItemContext) {
    this._editedItem = item as RoomContext;
  }
  get submitEnabled(): boolean {
    if (!this._editedItem)
      return false;
    let room = (this.editedItem as RoomContext).room;
    // return room.name !== '' && room.capacity !== 0 && room.descriptionHTML !== '' && room.rentRateHour !== 0 && room.pictures.length > 0;
    return room.name !== '' && room.capacity !== 0 && room.descriptionHTML !== '' && room.rentRateHour !== 0;
  }
  itemToString(item: IItemContext): string {
    return (item as RoomContext).room.name;
  }

  //////////////////////////////////////////////////////

  // delete = (item) => {
  //   let room = item.room;
  //   console.log("would like to delete room: ", room);
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '350px',
  //     data: {title: "Delete Confirmation", message: `Are you sure you want to delete room '${room.name}'`}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.roomService.deleteRoom(room).subscribe(() => this.refreshList());
  //     }
  //   });
  // }

  // update = (item) => {
  //   let room = item.room;
  //   console.log("would like to edit room: ", room);
  //   this.roomService.updateRoom(room).subscribe(
  //     () => {
  //       this.refreshList();
  //     }
  //   )
  // }

  // create = (item) => {
  //   let room = item.room;
  //   console.log("would like to create a new room called: ", room.name);
  //   this.roomService.createRoom(room).subscribe(
  //     () => {
  //       this.refreshList();
  //     }
  //   )
  // }

  // newItem = () => {
  //   console.log("ConfigureRoomsComponent::newItem()");
  //   let room = new Room({});
  //   return this.room2Context(room);
  // }

  // getEditedItem = () => {
  //   return this.editedItem;
  // }

  // getItemEditContext = () => {
  //   return this.room2Context(this.editedItem);
  // }

  // setEditedItem = (item) => {
  //   console.log("ConfigureRoomsComponent::setEditedItem()", item);
  //   this.editedItem = this.room2Context(item.room);
  // }

  // submitEnabled = () => {
  //   return this.editedItem && this.editedItem.name !== '' && this.editedItem.capacity !== 0 && this.editedItem.descriptionHTML !== '' && this.editedItem.rentRateHour !== 0 && this.editedItem.pictures.length > 0;
  // }

  // itemToString = (item) => {
  //   return item.name;
  // }

  constructor(
    private roomService: RoomService,
    private extraService: ExtraService,
  ) { 
    super();
  }

  ngOnInit() {
    this.refreshList();
  }

  async refreshList() {
    await this.extraService.getExtras().subscribe(extras => {
      allAvailableExtras = extras.map(extra => new Extra(extra));
    });
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms.map(room => new RoomContext(new Room(room)));
    });
  }

  // editedItem;

  // room2Context(room: Room) {
  //   return {
  //     room: room,
  //     name: room.name,
  //     descriptionHTML: room.descriptionHTML,
  //     defaultRate: room.rentRateHour,
  //     capacity: room.capacity,
  //     availableExtras: room.availableExtras.map(extraId => this.getExtraFromId(extraId)).filter(extra => (extra !== undefined)),
  //     pictures: room.pictures,
  //     setName: (value) => {room.name = value;},
  //     setDescriptionHTML: (value) => {room.descriptionHTML = value;},
  //     setDefaultRate: (value) => {room.rentRateHour = value;},
  //     setCapacity: (value) => {room.capacity = value;},
  //     setAvailableExtras: (value) => {room.availableExtras = value;},
  //     setPictures: (value) => {room.pictures = value;}
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
