import { Component, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material';

@Component({
  selector: 'app-configure-organisations',
  templateUrl: './configure-organisations.component.html',
  styleUrls: ['./configure-organisations.component.scss']
})
export class ConfigureOrganisationsComponent implements OnInit {

  organizations = [
    {name: "company1"},
    {name: "company2"},
    {name: "company3"}
  ];
  constructor() { }

  ngOnInit() {
  }

  delete(organization) {
    console.log("would like to delete organization: ", organization);
  }

  edit(organization) {
    console.log("would like to edit organization: ", organization);
  }

  addNew = false;

  create(name: string) {
    console.log("would like to create a new organization called: ", name);
  }

}
