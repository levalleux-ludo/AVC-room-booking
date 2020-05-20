import { Component, OnInit, Input } from '@angular/core';
import { Extra } from 'src/app/_model/extra';

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
  extras: Extra[] = [];

  @Input()
  nbPeopleExpected: number = 0;

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
        this.extrasDetailsHeight = 14 + 14 * this.extras.length;
      }
    }
  }
  extrasDetailsHeight = 16;
  get nbExtras(): number {
    return this.extras.length;
  }

  extraDetails(): string[] {
    const details = [];
    for (const extra of this.extras) {
      if (extra.perPerson) {
        const price = extra.defaultRate * this.nbPeopleExpected;
        const formula = `£${extra.defaultRate} x ${this.nbPeopleExpected} people`;
        details.push(`<div>${extra.name}: £${price} (${formula})<br></div>`);
      } else {
        details.push(`<div>${extra.name}: £${extra.defaultRate}<br></div>`);
      }

    }
    return details;
  }

  get extrasPrice(): number {
    let price = 0;
    for (const extra of this.extras) {
      price += extra.perPerson ? extra.defaultRate * this.nbPeopleExpected : extra.defaultRate;
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
