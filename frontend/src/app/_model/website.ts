export class Website {
  _serviceDescription: string;
  _presentationHTML: string;
  _indicatorsHTML: string;
  _pictures: string[];
  _backgroundPicture: string;

  constructor(fetched_data: any) {
    this._serviceDescription = (fetched_data.serviceDescription) ? fetched_data.serviceDescription : '';
    this._presentationHTML = (fetched_data.presentationHTML) ? fetched_data.presentationHTML : '';
    this._indicatorsHTML = (fetched_data.indicatorsHTML) ? fetched_data.indicatorsHTML : '';
    this._pictures = (fetched_data.pictures) ? Array.from(fetched_data.pictures) : [];
    this._backgroundPicture = (fetched_data.backgroundPicture) ? fetched_data.backgroundPicture : '';
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

  get pictures(): string[] {
    return this._pictures;
  }

  set pictures(value: string[]) {
      this._pictures = value;
  }

  get backgroundPicture(): string {
    return this._backgroundPicture;
  }

  set backgroundPicture(value: string) {
    this._backgroundPicture = value;
  }

  public getData(): any {
    return {
        serviceDescription: this.serviceDescription,
        presentationHTML: this.presentationHTML,
        indicatorsHTML: this.indicatorsHTML,
        pictures: Array.from(this.pictures),
        backgroundPicture: this.backgroundPicture
    };
  }


}
