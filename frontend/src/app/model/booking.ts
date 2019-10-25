import * as moment from 'moment';
import { Extra } from './extra';

// export class BookingExtra {
//     extra: string;
//     rate: number;
//     quantity: number;
//     comments: string;
// }
export class Booking {
    id: any;
    ref: string;
    title: string;
    details: string;
    organizationId: any;
    startDate: Date;
    endDate: Date;
    roomId: any;
    extras: Extra[];
    totalPrice: number;
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
