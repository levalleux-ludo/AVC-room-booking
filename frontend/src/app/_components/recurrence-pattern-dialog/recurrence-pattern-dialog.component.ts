/* tslint:disable: no-bitwise */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatRadioChange } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Booking, RecurrencePattern } from 'src/app/_model/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { DateInPastErrorMatcher } from '../booking-dialog/booking-dialog.component';


const DAYS = [
  {day: 'Sunday', value: 1 << 0},
  {day: 'Monday', value: 1 << 1},
  {day: 'Tuesday', value: 1 << 2},
  {day: 'Wednesday', value: 1 << 3},
  {day: 'Thursday', value: 1 << 4},
  {day: 'Friday', value: 1 << 5},
  {day: 'Saturday', value: 1 << 6}
];

const WEEKS = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

function decodeDay(dayMask: number): string[] {
  const days = [];
  for (const day of DAYS) {
    if (dayMask & day.value) {
      days.push(day.day);
    }
  }
  return days;
}

export function recurrencePattern2String(pattern: RecurrencePattern, monthlyMode: string) {
  if (!pattern) {
    return '';
  }
  let occurrence = ``;
  let ondays = '';
  switch (pattern.frequency) {
    case 'Daily': {
      if (pattern.recurrence === 1) {
        occurrence = 'day';
      } else {
        occurrence = `${pattern.recurrence} days`;
      }
      break;
    }
    case 'Weekly': {
      if (pattern.recurrence === 1) {
        occurrence = 'week';
      } else {
        occurrence = `${pattern.recurrence} weeks`;
      }
      ondays = ' on ';
      const days = decodeDay(pattern.weekMask);
      for (let i = 0; i < days.length; i++) {
        if (i === 0) {
          ondays += days[i];
        } else if (i === days.length - 1) {
          ondays += ' and ' + days[i];
        } else {
          ondays += ', ' + days[i];
        }
      }
      break;
    }
    case 'Monthly': {
      if (pattern.recurrence === 1) {
        occurrence = 'month';
      } else {
        occurrence = `${pattern.recurrence} months`;
      }
      if (monthlyMode === 'week') {
        if ((pattern.weekInMonth > 0) && (pattern.weekInMonth <= WEEKS.length)) {
          ondays = ' the ' + WEEKS[pattern.weekInMonth - 1] + ' ' + pattern.weekDayInMonth;
        }
      } else {
        ondays = ' on day ' + pattern.dayInMonth;
      }
      break;
    }
  }
  return `Occurs every ${occurrence}${ondays} until ${pattern.endDate ? pattern.endDate.toLocaleDateString() : '?'}`;
}

@Component({
  selector: 'app-recurrence-pattern-dialog',
  templateUrl: './recurrence-pattern-dialog.component.html',
  styleUrls: ['./recurrence-pattern-dialog.component.scss']
})
export class RecurrencePatternDialogComponent implements OnInit {

  form: FormGroup;
  selectedFrequency;
  days = DAYS;
  weeks = WEEKS;
  monthlyMode;
  today = new Date(Date.now());
  errorMatcher = new DateInPastErrorMatcher();

  static editPattern(
    dialog: MatDialog,
    recurrencePatternId: any,
    bookingService: BookingService,
    onCompleted: (pattern: any) => void) {
      new Promise<RecurrencePattern>((resolve, reject) => {
        if (recurrencePatternId) {
          bookingService.getRecurrencePattern(recurrencePatternId).subscribe( pattern => {
            resolve(pattern);
          }, err => {
            reject(err);
          });
        } else {
          resolve({
            // empty pattern0
            frequency: '',
            recurrence: 1,
            weekMask: 0,
            dayInMonth: 1,
            weekInMonth: 1,
            weekDayInMonth: 'Monday',
            endDate: new Date(Date.now())
          });
        }
      }).then(pattern => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = pattern;
        const dialogRef = dialog.open(RecurrencePatternDialogComponent, dialogConfig);
        return dialogRef.afterClosed().subscribe(
          result => {
            console.log(result);
            if (result) {
              const patternData = {
                frequency: result.frequency,
                recurrence: result.recurrence,
                weekMask: result.weekMask,
                dayInMonth: result.dayInMonth,
                weekInMonth: result.weekInMonth,
                weekDayInMonth: result.weekDayInMonth,
                endDate: new Date(result.endDate)
              };
              if (recurrencePatternId) {
                // update the pattern on backend
                bookingService.updateRecurrencePattern(recurrencePatternId, patternData).subscribe((newPattern) => {
                  newPattern.endDate = new Date(newPattern.endDate);
                  onCompleted(newPattern);
                });
              } else {
                // create a new pattern on backend
                bookingService.createRecurrencePattern(patternData).subscribe((newPattern) => {
                  newPattern.endDate = new Date(newPattern.endDate);
                  onCompleted(newPattern);
                });
              }
            }
          },
          err => {
            console.error(err);
            alert(err);
          }
        );
      }).catch(err => {
        console.error(err);
        alert(err);
      });
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecurrencePatternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecurrencePattern
  ) {
    this.selectedFrequency = this.data.frequency;
   }

  ngOnInit() {
    this.monthlyMode = this.data.dayInMonth > 0 ? 'day' : 'week';
    this.form = this.fb.group({
      frequency: new FormControl(this.data.frequency),
      recurrence: new FormControl(this.data.recurrence),
      weekMask: new FormControl(this.data.weekMask),
      dayInMonth: new FormControl(this.data.dayInMonth),
      weekInMonth: new FormControl(this.data.weekInMonth),
      weekDayInMonth: new FormControl(this.data.weekDayInMonth),
      monthlyMode: new FormControl(this.monthlyMode),
      endDate: new FormControl(this.data.endDate)
    }, { validators: [this.weekDaysIsChecked] });
  }

  weekDaysIsChecked(form: FormGroup) {
    if ((form.controls.frequency.value === 'Weekly')
    && (form.controls.weekMask.value === 0)) {
      return { noWeekDayChecked: true };
    }
    return null;
  }

  submit(form) {
    if (this.monthlyMode === 'week') {
      this.form.patchValue({dayInMonth: 0});
    }
    this.dialogRef.close(form.value);
  }

  onFrequencyChange(newFrequency: string) {
    this.selectedFrequency = newFrequency;
  }

  recurrencePattern2String(): string {
    const pattern = { ...this.form.value };
    pattern.endDate = new Date (this.form.controls.endDate.value);
    return recurrencePattern2String(pattern, this.monthlyMode);
  }

  isDayChecked(dayValue: number): boolean {
    const weekMask = this.form.controls.weekMask.value;
    return (weekMask & dayValue) !== 0;
  }

  checkDay(dayValue: number, isChecked: boolean) {
    let weekMask = this.form.controls.weekMask.value;
    if (isChecked) {
      weekMask = weekMask | dayValue;
    } else {
      weekMask = weekMask & ~dayValue;
    }
    this.form.patchValue({weekMask});
  }

  onDayChange(event: any) {
  }

  onDayModeChange(event: any) {
    if (event instanceof MatRadioChange) {
      this.monthlyMode = event.value;
    }
  }

  selectDayInMonth(event: any) {
    console.log(event);
  }

  selectWeekInMonth(event: any) {
    console.log(event);
  }

}
