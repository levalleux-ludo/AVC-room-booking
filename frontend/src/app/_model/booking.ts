import * as moment from 'moment';
import { Extra } from './extra';

// export class BookingExtra {
//     extra: string;
//     rate: number;
//     quantity: number;
//     comments: string;
// }

export class BookingPrivateData {
  title: string;
  details: string;
  organizationId: any;
  extras: Extra[];
  totalPrice: number;
}
export class Booking {
    id: any;
    ref: string;
    startDate: Date;
    endDate: Date;
    roomId: any;
    privateData: any;
    privateDataRef: BookingPrivateData = {
      title: '',
      details: '',
      organizationId: undefined,
      extras: [],
      totalPrice: 0
    };

    constructor(fetched_data: any) {
      this.id = fetched_data.id;
      this.ref = fetched_data.ref;
      this.startDate = new Date(fetched_data.startDate);
      this.endDate = new Date(fetched_data.endDate);
      this.roomId = fetched_data.roomId;
      this.privateData = fetched_data.privateData;
  }
}

export function duration(booking: Booking) {
    let start = moment(booking.startDate);
    let end = moment(booking.endDate);
    var duration = moment.duration(end.diff(start));
    return duration.asHours();
}
export function computeEndDate(booking: Booking, durationHours: number) {
    let res = moment.utc(booking.startDate);
    res = res.add(durationHours, 'hours');
    booking.endDate = new Date(res.utc().year(), res.utc().month(), res.utc().date(), res.utc().hours(), res.utc().minutes());
}
