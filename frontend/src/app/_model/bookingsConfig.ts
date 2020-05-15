export interface termsAndConditions {
  fileId: string;
  fileName: string;
  uploadDate: Date;
}

export class BookingsConfig {
  _startTime: number;
  _endTime: number;
  _termsAndConditions: termsAndConditions;

  constructor(fetched_data: any) {
    this._startTime = (fetched_data.startTime) ? +fetched_data.startTime : -1;
    this._endTime = (fetched_data.endTime) ? +fetched_data.endTime : -1;
    this._termsAndConditions = (fetched_data.termsAndConditions) ? fetched_data.termsAndConditions : undefined;
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

  public get termsAndConditions(): termsAndConditions {
    return this._termsAndConditions;
  }

  public set termsAndConditions(value: termsAndConditions) {
    this._termsAndConditions = value;
  }

  public getData(): any {
    return {
        startTime: this.startTime,
        endTime: this.endTime,
        termsAndConditions: this.termsAndConditions
    };
  }

}
