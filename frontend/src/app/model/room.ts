import { v4 as uuid } from 'uuid';

export class Room {
    private _id: any;
    private _name: string;
    private _descriptionHTML: string;
    private _capacity: number;
    private _rentRateHour: number;
    private _rentRateDay: number;
    private _availableExtras: number[];
    private _pictures: string[];

    constructor(fetched_data: any) {
        this._id = (fetched_data.id)?fetched_data.id:uuid();
        this._name = (fetched_data.name)?fetched_data.name:'';
        this._descriptionHTML = (fetched_data.descriptionHTML)?fetched_data.descriptionHTML:'';
        this._capacity = (fetched_data.capacity)?fetched_data.capacity:0;
        this._rentRateDay = (fetched_data.rentRateHour)?fetched_data.rentRateDay:undefined;
        this._rentRateHour = (fetched_data.rentRateHour)?fetched_data.rentRateHour:0;
        this._availableExtras = (fetched_data.availableExtras)?fetched_data.availableExtras:[];
        this._pictures = (fetched_data.pictures)?fetched_data.pictures:[];
    }

    clone(): Room {
        return new Room({id: this.id, name: this.name, descriptionHTML: this.descriptionHTML, capacity: this.capacity, rentRateDay: this.rentRateDay, rentRateHour: this.rentRateHour, availableExtras: this.availableExtras.map(value => value), pictures: this.pictures.map(value => value)});
    }

    copyContentFrom(original: Room) {
        this.name = original.name;
        this.descriptionHTML = original.descriptionHTML;
        this.capacity = original.capacity;
        this.rentRateDay = original.rentRateDay;
        this.rentRateHour = original.rentRateHour;
        this.availableExtras = original.availableExtras.map(value => value);
        this.pictures = original.pictures.map(value => value);
    }

    get id () {
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

    get rentRateHour(): number {
        return this._rentRateHour;
    }
    set rentRateHour(value: number) {
        this._rentRateHour = value;
    }

    get rentRateDay(): number {
        return this._rentRateDay;
    }
    set rentRateDay(value: number) {
        this._rentRateDay = value;
    }

    get availableExtras(): number[] {
        return this._availableExtras;
    }
    set availableExtras(value: number[]) {
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
            rentRateDay: this.rentRateDay,
            rentRateHour: this.rentRateHour,
            availableExtras: this.availableExtras,
            pictures: this.pictures
        };
    }
}