import { v4 as uuid } from 'uuid';

export class Extra {
    private _id;
    private _name: string;
    private _defaultRate: number;
    private _perPerson: boolean;
    constructor(fetched_data: any) {
        this._name = (fetched_data.name)?fetched_data.name:'';
        this._defaultRate = (fetched_data.defaultRate)?fetched_data.defaultRate:0;
        this._id = (fetched_data._id)?fetched_data._id:uuid();
        this._perPerson = (fetched_data.perPerson)?fetched_data.perPerson:false;
    }

    clone(): Extra {
        return new Extra({_id: this.id, name: this.name, defaultRate: this.defaultRate, perPerson: this.perPerson});
    }

    equals(extra: Extra): boolean {
        return (extra) && (extra.id === this.id);
    }

    copyContentFrom(original: Extra) {
        this.name = original.name;
        this.defaultRate = original.defaultRate;
        this.perPerson = original.perPerson;
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

    get defaultRate() {
        return this._defaultRate;
    }
    set defaultRate(value: number) {
        this._defaultRate = value;
    }

    get perPerson(): boolean {
      return this._perPerson;
    }
    set perPerson(value: boolean) {
      this._perPerson = value;
    }

    getData() {
        return {
            name: this.name,
            defaultRate: this.defaultRate,
            perPerson: this.perPerson
        };
    }
}
