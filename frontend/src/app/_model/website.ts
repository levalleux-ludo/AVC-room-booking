export class Website {
  _serviceDescription: string;

  constructor(fetched_data: any) {
    this._serviceDescription = (fetched_data.serviceDescription)?fetched_data.serviceDescription:'';
  }

  public get serviceDescription(): string {
    return this._serviceDescription;
  }

  public set serviceDescription(value: string) {
    this._serviceDescription = value;
  }

}
