import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BookingService } from '../../_services/booking.service';
import { Booking, duration } from '../../_model/booking';
import { jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler/public_api';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.scss']
})
export class BookingOverviewComponent implements OnInit {

  // @ViewChild('schedulerReference', {static: false})
  // myScheduler: jqxSchedulerComponent;

  bookings: Booking[];
  // source: any =
  // {
  //     dataType: "array",
  //     dataFields: [
  //         { name: 'id', type: 'string' },
  //         { name: 'organization', type: 'string' },
  //         { name: 'subject', type: 'string' },
  //         { name: 'privateDatas', type: 'string' },
  //         { name: 'room', type: 'string' },
  //         { name: 'start', type: 'date' },
  //         { name: 'end', type: 'date' },
  //     ],
  //     id: 'id',
  //     localData: [],
  // };
  // dataAdapter: any = new jqx.dataAdapter(this.source);
  // date: any = new jqx.date('todayDate');
  // appointmentDataFields: any  = {
  //     from: "start",
  //     to: "end",
  //     id: "id",
  //     description: "privateDatas",
  //     location: "organization",
  //     subject: "subject",
  //     resourceId: "room",
  // };
  // resources: any =
  // {
  //     colorScheme: "scheme05",
  //     dataField: "room",
  //     orientation: "horizontal",
  //     source: new jqx.dataAdapter(this.source)
  // };
  // views: any[] = [];
  // @Input()
  // scaleStartHour = 8;
  // @Input()
  // scaleEndHour = 19;
  // @Input()
  // height = 500;
  // @Input()
  // width = 800;
  constructor(
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    this.getBookings();
  //   this.views.push({
  //     type: 'weekView',
  //     showWeekends: false,
  //     timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
  //     allDayRowHeight: 24,
  //     rowHeight: (this.height - 160) / 20,
  //     showWorkTime : false,
  // });
  // this.views.push({
  //     type: 'dayView',
  //     showWeekends: false,
  //     timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
  //     allDayRowHeight: 24,
  //     rowHeight: (this.height - 160) / 20,
  //     showWorkTime : false,
  // });
  // this.views.push({
  //   type: 'monthView',
  //   showWeekends: false,
  //   timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
  //   // allDayRowHeight: 24,
  //   // rowHeight: (this.height - 160) / 20,
  //   showWorkTime : false,
// });
}

  getBookings() {
    this.bookingService.getBookings().subscribe(
      bookings => this.bookings = bookings
    );
  }

  duration (booking: Booking) {
    duration(booking);
  }


}
