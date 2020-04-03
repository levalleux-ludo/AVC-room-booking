export class Website {
  _serviceDescription: string;
  _presentationHTML: string;
  _indicatorsHTML: string;

  constructor(fetched_data: any) {
    this._serviceDescription = (fetched_data.serviceDescription) ? fetched_data.serviceDescription : '';
    this._presentationHTML = (fetched_data.presentationHTML) ? fetched_data.presentationHTML : '';
    this._indicatorsHTML = (fetched_data.indicatorsHTML) ? fetched_data.indicatorsHTML : '';
  }

  public get serviceDescription(): string {
    return this._serviceDescription;
  }

  public set serviceDescription(value: string) {
    this._serviceDescription = value;
  }

  public get presentationHTML(): string {
    return this._presentationHTML;
  }

  public set presentationHTML(value: string) {
    this._presentationHTML = value;
  }

  public get indicatorsHTML(): string {
    return this._indicatorsHTML;
  }

  public set indicatorsHTML(value: string) {
    this._indicatorsHTML = value;
  }

  public getData(): any {
    return {
        serviceDescription: this.serviceDescription,
        presentationHTML: this.presentationHTML,
        indicatorsHTML: this.indicatorsHTML
    };
  }


}
