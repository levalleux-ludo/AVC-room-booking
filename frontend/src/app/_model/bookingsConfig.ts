export class BookingsConfig {
  _startTime: number;
  _endTime: number;

  constructor(fetched_data: any) {
    this._startTime = (fetched_data.startTime) ? +fetched_data.startTime : -1;
    this._endTime = (fetched_data.endTime) ? +fetched_data.endTime : -1;
  }

  public get startTime(): number {
    return this._startTime;
  }

  public set startTime(value: number) {
    this._startTime = value;
  }

  public get endTime(): number {
    return this._endTime;
  }

  public set endTime(value: number) {
    this._endTime = value;
  }

  public getData(): any {
    return {
        startTime: this.startTime,
        endTime: this.endTime
    };
  }


}
