import { v4 as uuid } from 'uuid';
import { Component, OnInit } from '@angular/core';
import { WaiterService } from 'src/app/_services/waiter.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {

  isVisible: boolean = false;

  constructor(public waiterService: WaiterService) { }

  ngOnInit() {
  }

}
