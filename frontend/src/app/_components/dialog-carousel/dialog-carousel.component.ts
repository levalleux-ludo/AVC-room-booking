import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-carousel',
  templateUrl: './dialog-carousel.component.html',
  styleUrls: ['./dialog-carousel.component.scss']
})
export class DialogCarouselComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogCarouselComponent>,
    @Inject(MAT_DIALOG_DATA) public params: {image: string, images: string[]}
  ) { }

  ngOnInit() {
  }

}
