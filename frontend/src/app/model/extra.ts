import { v4 as uuid } from 'uuid';

export class Extra {
    private _id;
    private _extra: string;
    private _defaultRate: number;
    constructor(fetched_data: any) {
        this._extra = (fetched_data.extra)?fetched_data.extra:'';
        this._defaultRate = (fetched_data.defaultRate)?fetched_data.defaultRate:0;
        this._id = (fetched_data.id)?fetched_data.id:uuid();
    }

    clone(): Extra {
        return new Extra({id: this.id, extra: this.extra, defaultRate: this.defaultRate});
    }

    copyContentFrom(original: Extra) {
        this.extra = original.extra;
        this.defaultRate = original.defaultRate;
    }

    get id () {
        return this._id;
    }

    get extra() {
        return this._extra;
    }
    set extra(value: string) {
        this._extra = value;
    }

    get defaultRate() {
        return this._defaultRate;
    }
    set defaultRate(value: number) {
        this._defaultRate = value;
    }

    getData() {
        return {
            extra: this.extra,
            defaultRate: this.defaultRate
        };
    }
}
  