import { Injectable } from '@angular/core';
import { Booking, RecurrencePatternParams, BookingPrivateData, RecurrencePattern } from '../_model/booking';
import { MILLISEC_PER_DAY, addDays, findNextDateByDayNum, findDateByDayNumAndWeekNum } from '../_helpers/dateUtils';
import { BookingService } from './booking.service';
import { decodeDay } from '../_components/recurrence-pattern-dialog/recurrence-pattern-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class RecurrentEventService {
  constructor(
    private bookingService: BookingService
  ) { }

  async delete(recurrencePatternId: any, currentBookingId: any) {
    throw new Error("Method not implemented.");
    // for each booking where recurrencePatternId=recurrencePatternId and date in future and id!=currentBookingId
    // --> delete
    // then delete recurrencePattern with id recurrencePatternId
  }

  async create(booking: Booking, privateData: BookingPrivateData, recurrencePattern: RecurrencePatternParams): Promise<RecurrencePattern> {
    return new Promise((resolve, reject) => {
      // create the recurrencePattern, then create the events
      this.bookingService.createRecurrencePattern(recurrencePattern).subscribe(pattern => {
        resolve(pattern);
      }, err => reject(err));
    });
  }
  async update(booking: Booking, recurrencePattern: RecurrencePatternParams) {
    throw new Error("Method not implemented.");
  }

  computeOccurrences(pattern: RecurrencePatternParams, startDate: Date, monthlyMode: string): Date[] {
    const occurrences = [];
    const endDate = new Date(pattern.endDate);
    endDate.setHours(23, 59, 59, 999); // end of day in local time
    switch (pattern.frequency) {
      case 'Daily': {
        const maxDays = (endDate.valueOf() - startDate.valueOf()) / MILLISEC_PER_DAY;
        for (let offsetDay = 0; offsetDay < maxDays; offsetDay += pattern.recurrence) {
          occurrences.push(addDays(startDate, offsetDay));
        }
        break;
      }
      case 'Weekly': {
        const maxWeeks = (1 + (endDate.valueOf() - startDate.valueOf()) / MILLISEC_PER_DAY) / 7;
        for (let offsetWeek = 0; offsetWeek < maxWeeks; offsetWeek += pattern.recurrence) {
          const weekStartDate = addDays(startDate, offsetWeek * 7);
          const weekDays = decodeDay(pattern.weekMask);
          for (const weekDay of weekDays) {
            const dayDate = findNextDateByDayNum(weekStartDate, weekDay.num);
            if (dayDate <= endDate) {
              occurrences.push(dayDate);
            }
          }
        }
        break;
      }
      case 'Monthly': {
        let monthStartDate: Date;
        if (monthlyMode === 'week') {
          monthStartDate = findDateByDayNumAndWeekNum(startDate, pattern.weekDayInMonth, pattern.weekInMonth)
        } else {
          monthStartDate = new Date(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            pattern.dayInMonth,
            startDate.getUTCHours(),
            startDate.getUTCMinutes()
          );
        }
        if (monthStartDate < startDate) {
          // starts next month
          monthStartDate = new Date(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth() + 1,
            startDate.getUTCDay(),
            startDate.getUTCHours(),
            startDate.getUTCMinutes()
          );
        }
        while (monthStartDate <= endDate) {
          occurrences.push(monthStartDate);
          monthStartDate = new Date(
            startDate.getUTCFullYear(),
            monthStartDate.getUTCMonth() + pattern.recurrence,
            pattern.dayInMonth,
            startDate.getUTCHours(),
            startDate.getUTCMinutes()
          );
        }
        break;
      }
    }
    return occurrences.sort((date1, date2) => date1.valueOf() - date2.valueOf());
  }

}
