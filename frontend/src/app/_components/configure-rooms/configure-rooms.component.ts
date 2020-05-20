import { Component, OnInit, Input } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Room } from '../../_model';
import { MatDialog } from '@angular/material';
import { RoomService } from '../../_services/room.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Extra } from '../../_model/extra';
import { ExtraService } from '../../_services/extra.service';
import { IItemContext, ConfigureAbstractComponent } from '../configure-generic/configure-generic.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileUploadAction } from '../material-file-upload/material-file-upload.component';
import { ImagesService } from 'src/app/_services/images.service';
import { Observable } from 'rxjs';
import { eOrganizationType } from 'src/app/_model/organization';

var allAvailableExtras: Extra[] = [];

function getExtraFromId(extraId): Extra {
  let extra = allAvailableExtras.find(extra => (extra.id === extraId));
  if (!extra) {
    console.error("Unable to find Extra with Id:", extraId);
  }
  return extra;
}

function compareExtras(extra1: Extra, extra2: Extra): boolean {
  if (extra1 && extra2) {
    return extra1.equals(extra2);
  }
  return extra1 === extra2;
}

class RoomContext implements IItemContext {
  room;

  constructor(room: Room) {
    this.room = room;
  }
  clone() {
    return new RoomContext(this.room.clone());
  }
  equals(item: IItemContext) {
    let roomContext = item as RoomContext;
    return (roomContext) && this.room.equals(roomContext.room);
  }
  context() {
    return {
      room: this.room,
      name: this.room.name,
      descriptionHTML: atob(this.room.descriptionHTML),
      defaultRate: this.room.getRentRateHour(eOrganizationType.OTHER),
      charityRate: this.room.getRentRateHour(eOrganizationType.CHARITY),
      capacity: this.room.capacity,
      availableExtras: this.room.availableExtras.map(extraId => getExtraFromId(extraId)).filter(extra => (extra !== undefined)),
      // availableExtras: [allAvailableExtras[0], allAvailableExtras[2]],
      allAvailableExtras: allAvailableExtras,
      // compareExtras: (extra1,extra2) => {return compareExtras(extra1, extra2);},
      compareExtras: compareExtras,
      pictures: this.room.pictures,
      setName: (value) => {this.room.name = value;},
      setDescriptionHTML: (value) => {this.room.descriptionHTML = btoa(value);},
      setDefaultRate: (value) => {
        let regex = new RegExp(/\d[\d,\,, ]*[.|,]?\d*/);
        if (!regex.test(value)) {
          throw new Error(`Unable to parse entry '${value}' from currency format to a number.`);
        }
        let results = regex.exec(value);
        console.log("setDefaultRate() value =", value, "regex.results = ", results[0]);
        this.room.setRentRateHour('default', results[0]);
      },
      setCharityRate: (value) => {
        let regex = new RegExp(/\d[\d,\,, ]*[.|,]?\d*/);
        if (!regex.test(value)) {
          throw new Error(`Unable to parse entry '${value}' from currency format to a number.`);
        }
        let results = regex.exec(value);
        console.log("setCharityRate() value =", value, "regex.results = ", results[0]);
        this.room.setRentRateHour(eOrganizationType.CHARITY, results[0]);
      },
      setCapacity: (value) => {this.room.capacity = value;},
      setAvailableExtras: (value) => {
        let extrasIds = value.map(extra => extra.id);
        this.room.availableExtras = extrasIds;
      },
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


  /**
   * refresh is a method used to register the current component on some events it would have to refresh some of its data
   * In the current case, the organizations list needs to be refreshed because it may have changed since the component has been instanciated
   *
   * @memberof ConfigureUsersComponent
   */
  @Input()
  refresh: { index: number, register: (index: number,  refreshComponent: () => void ) => void };

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
    let room = this.getEditedRoom();
    if (!room) {
      return false;
    }
    return room.name !== ''
    && room.capacity !== 0
    && room.descriptionHTML !== ''
    && room.getRentRateHour(eOrganizationType.OTHER) !== 0
    && room.getRentRateHour(eOrganizationType.CHARITY) !== 0;
  }
  itemToString(item: IItemContext): string {
    return (item as RoomContext).room.name;
  }

  getEditedRoom(): Room {
    if (this.editedItem instanceof RoomContext) {
      return (this.editedItem as RoomContext).room;
    } else {
      return null;
    }
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
    private imagesService: ImagesService
  ) {
    super();
  }

  ngOnInit() {
    this.refreshExtras();
    this.refreshList();
    if (this.refresh) {
      // if refresh handler is set, call it to register on events that would require the component to refresh some data
      this.refresh.register(this.refresh.index, () => {
        this.refreshExtras();
      });
    }
  }

  refreshExtras() {
    this.extraService.getExtras().subscribe(extras => {
      allAvailableExtras = extras.map(extra => new Extra(extra));
    });
  }

  async refreshList() {
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms.map(room => new RoomContext(new Room(room)));
    });
  }

  onImageUploaded(data: {fileId: string}) {
    console.log(`onImageUploaded(${JSON.stringify(data)})`);
    const imageId = data.fileId;
    this.imagesService.getImageUrl(imageId).subscribe((url) => {
      const room = this.getEditedRoom();
      if (room && !room.pictures.includes(imageId)) {
        room.pictures.push(imageId);
      }
    });
  }

  getImageUrlFromId(imageId: string): Observable<string> {
    let url = this.imagesService.getImageUrl(imageId);
    return url;
  }

  uploadFile(data: FileUploadAction) {
    const file = data.fileModel;
    console.log(`uploadFile(${file})`);
    file.inProgress = true;
    file.sub = this.imagesService.uploadImage(file.data)
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          data.onSuccess(event);
        }
      }, (error: any) => {
        data.onFailure(error);
      });

  }

  onDeleteImage(imageId: string) {
    const room = this.getEditedRoom();
    if (room && room.pictures.includes(imageId)) {
      room.pictures.splice(room.pictures.indexOf(imageId), 1);
    }

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
