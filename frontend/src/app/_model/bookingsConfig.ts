export class BookingsConfig {
  _startTime: number;
  _endTime: number;
  _termsAndconditionsHTML: string;

  constructor(fetched_data: any) {
    this._startTime = (fetched_data.startTime) ? +fetched_data.startTime : -1;
    this._endTime = (fetched_data.endTime) ? +fetched_data.endTime : -1;
    this._termsAndconditionsHTML = (fetched_data.termsAndConditionsHTML) ? fetched_data.termsAndConditionsHTML : '';
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

  public get termsAndconditionsHTML(): string {
    return this._termsAndconditionsHTML;
  }

  public set termsAndconditionsHTML(value: string) {
    this._termsAndconditionsHTML = value;
  }

  public getData(): any {
    return {
        startTime: this.startTime,
        endTime: this.endTime,
        termsAndConditionsHTML: this.termsAndconditionsHTML
    };
  }


}
