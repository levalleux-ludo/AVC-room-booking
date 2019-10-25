import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-price-display',
  templateUrl: './price-display.component.html',
  styleUrls: ['./price-display.component.scss']
})
export class PriceDisplayComponent implements OnInit {


  @Input()
  hourQuantity: number = 0;

  @Input()
  roomRatePerHour: number = 0;

  @Input()
  extras: {[extra: string]: number} = {};

  get rentalPrice(): number {
    return this.hourQuantity * this.roomRatePerHour;
  }

  get rentalFormula(): string {
    return '£' + this.roomRatePerHour + ' x ' + this.hourQuantity + ' hours';
  }

  _showExtrasDetails = false;
  get showExtrasDetails() {
    return this._showExtrasDetails;
  }
  set showExtrasDetails(value: boolean) {
    if (this._showExtrasDetails !== value) {
      this._showExtrasDetails = value;
      if (!this._showExtrasDetails) {
        this.extrasDetailsHeight = 16;
      } else {
        this.extrasDetailsHeight = 14 + 14*Object.keys(this.extras).length;
      }
    }
  }
  extrasDetailsHeight = 16;
  get nbExtras(): number {
    return Object.keys(this.extras).length;
  }
  
  get extrasDetails(): string {
    let details = '<p>';
    for (let extra in this.extras) {
      details += `${extra}: £${this.extras[extra]}<br>`
    }
    details += '</p>'
    return details;
  }

  extraDetails(): string[] {
    let details = [];
    for (let extra in this.extras) {
      details.push(`<div>${extra}: £${this.extras[extra]}<br></div>`);
    }
    return details;
  }

  get extrasPrice(): number {
    let price = 0;
    for (let extra in this.extras) {
      price += this.extras[extra];
    }
    return price;
  }

  get totalPrice(): number {
    return this.rentalPrice + this.extrasPrice;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
