import { v4 as uuid } from 'uuid';

export class Room {
    private _id: any;
    private _name: string;
    private _descriptionHTML: string;
    private _capacity: number;
    private _rates: Map<string, {
      rentRateHour: number,
      rentRateDay: number
    }>;
    private _availableExtras: any[];
    private _pictures: string[];

    constructor(fetched_data: any) {
        this._id = (fetched_data._id) ? fetched_data._id : uuid();
        this._name = (fetched_data.name) ? fetched_data.name : '';
        this._descriptionHTML = (fetched_data.descriptionHTML) ? fetched_data.descriptionHTML : '';
        this._capacity = (fetched_data.capacity) ? fetched_data.capacity : 0;
        this._rates = new Map();
        if (fetched_data.rates) {
          for (const rate of fetched_data.rates) {
            this._rates.set(
              rate.rateType,
              {
                rentRateHour: rate.rentRateHour,
                rentRateDay: rate.rentRateDay
              });
          }
        }
        this._availableExtras = (fetched_data.availableExtras) ? fetched_data.availableExtras : [];
        this._pictures = (fetched_data.pictures) ? fetched_data.pictures : [];
    }

    clone(): Room {
      return new Room({
        _id: this.id,
        name: this.name,
        descriptionHTML: this.descriptionHTML,
        capacity: this.capacity,
        rates: this.buildRatesArray(this._rates),
        availableExtras: this.availableExtras.map(value => value),
        pictures: this.pictures.map(value => value)
      });
    }

    equals(room: Room): boolean {
        return (room) && (room.id === this.id);
    }

    copyContentFrom(original: Room) {
        this.name = original.name;
        this.descriptionHTML = original.descriptionHTML;
        this.capacity = original.capacity;
        this._rates = original.rates; // calling the property creates a cloned Map
        this.availableExtras = original.availableExtras.map(value => value);
        this.pictures = original.pictures.map(value => value);
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    get descriptionHTML(): string {
        return this._descriptionHTML;
    }
    set descriptionHTML(value: string) {
        this._descriptionHTML = value;
    }

    get capacity(): number {
        return this._capacity;
    }
    set capacity(value: number) {
        this._capacity = value;
    }

    private getRate(rateType: string) {
      let rate = this._rates.get(rateType);
      if (!rate) {
        rate = this._rates.get('default');
      }
      return rate;
    }

    private buildRatesArray(ratesMap: Map<string, {rentRateHour: number, rentRateDay: number}>):
     {rateType: string, rentRateHour: number, rentRateDay: number}[] {
      const rates = [];
      for (const rateType of this._rates.keys()) {
        const rate = this._rates.get(rateType);
        rates.push({
          rateType,
          ...rate
        });
      }
      return rates;
    }

    getRentRateHour(rateType: string): number {
      const rate = this.getRate(rateType);
      if (rate) {
        return rate.rentRateHour;
      }
      return undefined;
    }

    getRentRateDay(rateType: string): number {
      const rate = this.getRate(rateType);
      if (rate) {
        return rate.rentRateDay;
      }
      return undefined;
    }

    setRentRateHour(rateType: string, value: number) {
      const rate = this._rates.get(rateType);
      if (rate) {
        rate.rentRateHour = value;
      } else {
        this._rates.set(rateType, {rentRateHour: value, rentRateDay: undefined});
      }
    }

    setRentRateDay(rateType: string, value: number) {
      const rate = this._rates.get(rateType);
      if (rate) {
        rate.rentRateDay = value;
      } else {
        this._rates.set(rateType, {rentRateHour: undefined, rentRateDay: value});
      }
    }

    get rates(): Map<string, {
      rentRateHour: number,
      rentRateDay: number
    }> {
        return new Map(this._rates.entries());
    }

    get availableExtras(): any[] {
        return this._availableExtras;
    }
    set availableExtras(value: any[]) {
        this._availableExtras = value;
    }

    get pictures(): string[] {
        return this._pictures;
    }
    set pictures(value: string[]) {
        this._pictures = value;
    }

    getData() {
        return {
            name: this.name,
            descriptionHTML: this.descriptionHTML,
            capacity: this.capacity,
            rates: this.buildRatesArray(this._rates),
            availableExtras: this.availableExtras,
            pictures: this.pictures
        };
    }
}
