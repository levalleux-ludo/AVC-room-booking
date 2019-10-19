import { Component, OnInit } from '@angular/core';
import { Extra } from '../model/extra';
import { ExtraService } from '../_services/extra.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

function extra2Context(extra: Extra) {
  return {
    extra: extra.extra,
    defaultRate: extra.defaultRate,
    setExtra: (value) => {extra.extra = value;},
    setDefaultRate: (value) => {extra.defaultRate = value;}
  }
}

@Component({
  selector: 'app-configure-extras',
  templateUrl: './configure-extras.component.html',
  styleUrls: ['./configure-extras.component.scss']
})
export class ConfigureExtrasComponent implements OnInit {

  items = [
    new Extra({extra: 'flipchart_paper_pens', defaultRate: 5.5}),
    new Extra({extra: 'projector_screen', defaultRate: 5.5}),
    new Extra({extra: 'refreshment_fullDay', defaultRate: 15.5}),
    new Extra({extra: 'refreshment_halfDay', defaultRate: 10})
  ];

  delete = (item: Extra) => {
    console.log("would like to delete item: ", this.itemToString(item));
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {title: "Delete Confirmation", message: `Are you sure you want to delete extra '${item.extra}'`}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.extraService.deleteExtra(item).subscribe(() => this.refreshList());
      }
    });
  }

  update = (item: Extra) => {
    console.log("would like to udpate item: ", item);
    this.extraService.updateExtra(item).subscribe(
      () => {
        this.refreshList();
      }
    )
  }

  create = (item: Extra) => {
    console.log("would like to create new item: ", item);
    this.extraService.createExtra(item).subscribe(
      () => {
        this.refreshList();
      }
    )
  }

  newItem = () => {
    console.log("ConfigureRoomsComponent::newItem()");
    return new Extra({});
  }

  getEditedItem = () => {
    return this.editedItem;
  }

  getItemEditContext = () => {
    return extra2Context(this.editedItem);
  }

  setEditedItem = (item: Extra) => {
    console.log("ConfigureRoomsComponent::setEditedItem()", item);
    this.editedItem = item.clone();
  }

  submitEnabled = () => {
    return this.editedItem && this.editedItem.extra !== '';
  }

  itemToString = (item: Extra) => {
    return item.extra;
  }

  constructor( 
    private extraService: ExtraService,
    private dialog: MatDialog
     ) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.extraService.getExtras().subscribe(extras => {
      this.items = extras.map(extra => new Extra(extra));
    });

  }

  editedItem: Extra = new Extra({});

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
