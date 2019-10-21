import {Component, Input} from "@angular/core";
import { ConfigureComponent } from '../configure/configure.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
 

export interface IItemContext {
  clone();
  context(): any;
}
export abstract class ConfigureAbstractComponent {
  abstract get items(): IItemContext[];
  abstract deleteItem: (item: IItemContext) => void;
  abstract createItem: (item: IItemContext) => void;
  abstract updateItem: (item: IItemContext) => void;
  abstract getNewItem(): IItemContext;
  abstract get editedItem(): IItemContext;
  abstract set editedItem(item: IItemContext);
  abstract get submitEnabled(): boolean;
  abstract itemToString(item: IItemContext): string;
}
@Component({
  selector: 'app-configure-generic',
  templateUrl: './configure-generic.component.html',
  styleUrls: ['./configure-generic.component.scss']
})
export class ConfigureGenericComponent {
  
  @Input()
  configureComponent: ConfigureAbstractComponent;

  @Input()
  tableHeadersTemplate: string;

  @Input()
  itemRowTemplate: string;

  @Input()
  itemEditTemplate: string;
  
  @Input()
  tableWidth = 24;

  @Input()
  listStyle = 'table';

  constructor(
    private dialog: MatDialog

  ) { }

  ngOnInit() {
  }

  editItem: boolean = false;

  submitAction: (item) => void;

  onClickAdd() {
    this.editItem = true;
    if (!this.configureComponent) {
      throw new Error("'configureComponent' input must be defined for ConfigureGenericComponent");
    }
    this.configureComponent.editedItem = this.configureComponent.getNewItem();
    this.submitAction=this.configureComponent.createItem;
  }

  onClickEdit(item: IItemContext) {
    this.editItem = true;
    if (!this.configureComponent) {
      throw new Error("'configureComponent' input must be defined for ConfigureGenericComponent");
    }
    this.configureComponent.editedItem = item.clone();
    this.submitAction=this.configureComponent.updateItem;
  }

  onClickDelete(item: IItemContext) {
    let itemName = this.configureComponent.itemToString(item);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {title: "Delete Confirmation", message: `Are you sure you want to delete item '${itemName}'`}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.configureComponent.deleteItem(item);
      }
    });
  }

  onClickSubmit() {
    this.editItem = false;
    this.submitAction(this.configureComponent.editedItem);
  }

  onClickCancel() {
    this.editItem = false;
  }

}
