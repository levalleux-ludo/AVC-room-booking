import {Component, Input} from "@angular/core";
 

@Component({
  selector: 'app-configure-generic',
  templateUrl: './configure-generic.component.html',
  styleUrls: ['./configure-generic.component.scss']
})
export class ConfigureGenericComponent {
  
  @Input()
  items: any[];

  @Input()
  tableHeadersTemplate: string;

  @Input()
  itemRowTemplate: string;

  @Input()
  itemEditTemplate: string;

  @Input()
  delete: (item) => void;

  @Input()
  update: (item) => void;

  @Input()
  create: (item) => void;

  @Input()
  newItem: () => any;

  @Input()
  getEditedItem: () => any;

  @Input()
  getItemEditContext: () => any;
  
  @Input()
  setEditedItem: (item) => void;
  
  @Input()
  submitEnabled: () => boolean;

  @Input()
  itemToString: (item) => string;

  constructor() { }

  ngOnInit() {
  }

  editItem: boolean = false;

  submitAction: (item) => void;

  onClickAdd() {
    this.editItem = true;
    if (!this.setEditedItem) {
      throw new Error("'setEditedItem' input must be defined for ConfigureGenericComponent");
    }
    if (!this.newItem) {
      throw new Error("'newItem' input must be defined for ConfigureGenericComponent");
    }
    if (!this.create) {
      throw new Error("'newItem' input must be defined for ConfigureGenericComponent");
    }
    this.setEditedItem(this.newItem());
    this.submitAction=this.create;
  }

  onClickEdit(item) {
    this.editItem = true;
    if (!this.setEditedItem) {
      throw new Error("'setEditedItem' input must be defined for ConfigureGenericComponent");
    }
    if (!this.newItem) {
      throw new Error("'newItem' input must be defined for ConfigureGenericComponent");
    }
    if (!this.create) {
      throw new Error("'newItem' input must be defined for ConfigureGenericComponent");
    }
    this.setEditedItem(item);
    this.submitAction=this.update;
  }

}
