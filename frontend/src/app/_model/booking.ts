import * as moment from 'moment';
import { Extra } from './extra';

// export class BookingExtra {
//     extra: string;
//     rate: number;
//     quantity: number;
//     comments: string;
// }

export interface RecurrencePattern {
  frequency: string;
  recurrence: number;
  weekMask: number;
  dayInMonth: number;
  weekInMonth: number;
  weekDayInMonth: number;
  endDate: Date;
}

export class BookingPrivateData {
  title: string;
  details: string;
  organizationId: any;
  extras: Extra[];
  totalPrice: number;
  hirersDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
  responsibleDetails: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}
export class Booking {
    id: any;
    ref: string;
    startDate: Date;
    endDate: Date;
    roomId: any;
    nbPeopleExpected: number;
    privateData: any;
    privateDataRef: BookingPrivateData = {
      title: '',
      details: '',
      organizationId: undefined,
      extras: [],
      totalPrice: 0,
      hirersDetails: {
        firstName: '',
        lastName: '',
        email: '',
      },
      responsibleDetails: {
        firstName: '',
        lastName: '',
        phone: '',
      },
    };
    recurrencePatternId: any;

    constructor(fetched_data: any) {
      this.id = fetched_data._id;
      this.ref = fetched_data.ref;
      this.startDate = new Date(fetched_data.startDate);
      this.endDate = new Date(fetched_data.endDate);
      this.roomId = fetched_data.roomId;
      this.nbPeopleExpected = fetched_data.nbPeopleExpected;
      this.privateData = fetched_data.privateData;
      this.recurrencePatternId = fetched_data.recurrencePatternId;
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
