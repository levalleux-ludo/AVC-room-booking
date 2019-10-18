import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-extras',
  templateUrl: './configure-extras.component.html',
  styleUrls: ['./configure-extras.component.scss']
})
export class ConfigureExtrasComponent implements OnInit {

  extras: {extra: string, defaultRate: number }[] = [
    {extra: 'flipchart_paper_pens', defaultRate: 5.5 },
    {extra: 'projector_screen', defaultRate: 5.5},
    {extra: 'refreshment_fullDay', defaultRate: 15.5},
    {extra: 'refreshment_halfDay', defaultRate: 10}
  ];

  constructor() { }

  ngOnInit() {
  }

  delete(extra) {
    console.log("would like to delete extra: ", extra);
  }

  edit(extra) {
    console.log("would like to edit extra: ", extra);
  }

  addNew = false;

  create(extra: string, defaultRate: number) {
    console.log("would like to create a new extra called: ", extra, " with rate ", defaultRate);
  }

  editExtra = {extra:'', defaultRate:0};
  submitAction: (extra: string, defaultRate: number) => void;
  update(extra: string, defaultRate: number) {
    console.log("would like to update an existing extra called: ", extra, " with rate ", defaultRate);
  }

}
