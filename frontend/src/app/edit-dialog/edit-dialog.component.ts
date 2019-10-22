import { Component, OnInit, Inject, Input, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: {template: TemplateRef<any>, getTemplateContext: () => any, isSubmitEnabled: () => boolean}

    // private getTemplateContext: () => any,
    // private isSubmitEnabled: () => boolean,
    // private onClickCancel: () => void,
    // private onClickSubmit: () => void
  ) { }

  ngOnInit() {
  }

}
