import * as moment from 'moment';

export class BookingExtra {
    extra: string;
    rate: number;
    quantity: number;
    comments: string;
}
export class Booking {
    ref: string;
    title: string;
    details: string;
    organization: string;
    date: Date;
    startTime: Date;
    duration: number;
    endTime: Date;
    roomId: any;
    extras: BookingExtra[];
}

export function computeEndTime(booking: Booking) {
    let res = moment.utc(booking.startTime);
    res = res.add(booking.duration, 'hours');
    booking.endTime = new Date(res.utc().year(), res.utc().month(), res.utc().date(), res.utc().hours(), res.utc().minutes());
}
