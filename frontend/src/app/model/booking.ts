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