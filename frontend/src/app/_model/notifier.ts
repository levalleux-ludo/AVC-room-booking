export class Notifier {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string,
  };
  receivers: string[];
  newPassword: string;
  oldPassword: string;

  constructor(fetched_data: any) {
    this.host = (fetched_data.host) ? fetched_data.host : '';
    this.port = (fetched_data.port) ? fetched_data.port : -1;
    this.secure = (fetched_data.secure) ? fetched_data.secure : false;
    this.auth = (fetched_data.auth) ? { user: fetched_data.auth.user } : { user: '' };
    this.receivers = (fetched_data.receivers) ? Array.from(fetched_data.receivers) : [];
  }

  public getData(): any {
    return {
        host: this.host,
        port: this.port,
        secure: this.secure,
        auth: this.auth,
        receivers: Array.from(this.receivers),
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
    };
  }


}
