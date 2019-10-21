import { v4 as uuid } from 'uuid';

export class Extra {
    private _id;
    private _name: string;
    private _defaultRate: number;
    constructor(fetched_data: any) {
        this._name = (fetched_data.name)?fetched_data.name:'';
        this._defaultRate = (fetched_data.defaultRate)?fetched_data.defaultRate:0;
        this._id = (fetched_data.id)?fetched_data.id:uuid();
    }

    clone(): Extra {
        return new Extra({id: this.id, name: this.name, defaultRate: this.defaultRate});
    }

    copyContentFrom(original: Extra) {
        this.name = original.name;
        this.defaultRate = original.defaultRate;
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

    get defaultRate() {
        return this._defaultRate;
    }
    set defaultRate(value: number) {
        this._defaultRate = value;
    }

    getData() {
        return {
            name: this.name,
            defaultRate: this.defaultRate
        };
    }
}
  