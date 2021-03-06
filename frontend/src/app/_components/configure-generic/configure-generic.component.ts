import {Component, Input, TemplateRef, ViewChildren, QueryList, ElementRef, AfterViewInit, Directive} from "@angular/core";
import { ConfigureComponent } from '../configure/configure.component';
import { MatDialog, MatExpansionPanel, MatExpansionModule } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { isThisSecond } from 'date-fns';


export interface IItemContext {
  clone();
  equals(item: IItemContext);
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
  abstract isEditable(item: IItemContext): boolean;
  abstract canDelete(item: IItemContext): boolean;
  abstract canAdd(): boolean;
}

@Directive({
  selector: 'app-item-panel'
})
export class ItemPanelDirective {
  @Input()
  item: IItemContext;
  @Input()
  panel: MatExpansionPanel;

  constructor(private el: ElementRef) {}
}

@Component({
  selector: 'app-configure-generic',
  templateUrl: './configure-generic.component.html',
  styleUrls: ['./configure-generic.component.scss']
})
export class ConfigureGenericComponent implements AfterViewInit {

  @ViewChildren(ItemPanelDirective) itemPanels: QueryList<ItemPanelDirective>;

  getPanelForItem(item): MatExpansionPanel {
    let itemPanel = this.itemPanels.find( panel => item.equals(panel.item) );
    if (itemPanel) {
      return itemPanel.panel;
    }
    return null;
  }

  @Input()
  configureComponent: ConfigureAbstractComponent;

  @Input()
  tableHeadersTemplate: TemplateRef<any>;

  @Input()
  itemRowTemplate: TemplateRef<any>;

  @Input()
  itemEditTemplateRef: TemplateRef<any>;

  @Input()
  tableWidth = 24;

  @Input()
  listStyle = 'table';

  constructor(
    private dialog: MatDialog

  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.itemPanels.changes.subscribe((r) => {
      if (this.configureComponent.editedItem) {
        let panel = this.getPanelForItem(this.configureComponent.editedItem);
        if (panel) panel.expanded = true;
      }
    });
  }

  editItem: boolean = false;

  isEditable(item) {
    return true;
  }

  canDelete(item) {
    return true;
  }

  canAdd() {
    return true;
  }



  submitAction: (item) => void;

  editDialog() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        template: this.itemEditTemplateRef,
        getTemplateContext: () => {return this.configureComponent.editedItem.context();},
        isSubmitEnabled: () => {return this.configureComponent.submitEnabled;}
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.editItem = false;
      console.log("editDialog::afterClose() result=", result);
      if (result) {
        this.submitAction(this.configureComponent.editedItem);
      }
    });
  }

  onClickAdd() {
    this.editItem = true;
    if (!this.configureComponent) {
      throw new Error("'configureComponent' input must be defined for ConfigureGenericComponent");
    }
    if (!this.itemEditTemplateRef) {
      throw new Error("'itemEditTemplateRef' input must be defined for ConfigureGenericComponent");
    }
    this.configureComponent.editedItem = this.configureComponent.getNewItem();
    this.submitAction=this.configureComponent.createItem;
    this.editDialog();
  }

  onClickEdit(item: IItemContext) {
    this.editItem = true;
    if (!this.configureComponent) {
      throw new Error("'configureComponent' input must be defined for ConfigureGenericComponent");
    }
    this.configureComponent.editedItem = item.clone();
    this.submitAction=this.configureComponent.updateItem;
    this.editDialog();
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

  // onClickSubmit() {
  //   this.editItem = false;
  //   this.submitAction(this.configureComponent.editedItem);
  // }

  // onClickCancel() {
  //   this.editItem = false;
  // }

}
