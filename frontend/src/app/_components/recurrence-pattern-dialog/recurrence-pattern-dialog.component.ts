/* tslint:disable: no-bitwise */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatRadioChange } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Booking, RecurrencePattern } from 'src/app/_model/booking';
import { DateInPastErrorMatcher } from '../booking-dialog/booking-dialog.component';
import { RecurrentEventService } from 'src/app/_services/recurrent-event.service';


const DAYS = [
  {day: 'Sunday', value: 1 << 0, num: 0},
  {day: 'Monday', value: 1 << 1, num: 1},
  {day: 'Tuesday', value: 1 << 2, num: 2},
  {day: 'Wednesday', value: 1 << 3, num: 3},
  {day: 'Thursday', value: 1 << 4, num: 4},
  {day: 'Friday', value: 1 << 5, num: 5},
  {day: 'Saturday', value: 1 << 6, num: 6}
];

function dayNumToString(dayNum: number): string {
  return DAYS[dayNum].day;
}

function dayNumFromString(dayStr: string): number {
  for (const day of DAYS) {
    if (day.day === dayStr) {
      return day.num;
    }
  }
  return -1;
}

const WEEKS = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

export function decodeDay(dayMask: number): {day: string, num: number}[] {
  const days = [];
  for (const day of DAYS) {
    if (dayMask & day.value) {
      days.push({day: day.day, num: day.num});
    }
  }
  return days;
}

export function computeOccurences(pattern: RecurrencePattern, startDate: Date, monthlyMode: string): Date[] {
  const occurrences = [];

  return occurrences;
}

export function recurrencePattern2String(pattern: RecurrencePattern, startDate: Date, monthlyMode: string) {
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
          ondays += days[i].day;
        } else if (i === days.length - 1) {
          ondays += ' and ' + days[i].day;
        } else {
          ondays += ', ' + days[i].day;
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
          ondays = ' the ' + WEEKS[pattern.weekInMonth - 1] + ' ' + dayNumToString(pattern.weekDayInMonth);
        }
      } else {
        ondays = ' on day ' + pattern.dayInMonth;
      }
      break;
    }
  }
  return `Occurs every ${occurrence}${ondays} by ${startDate.toLocaleDateString()} until ${pattern.endDate ? pattern.endDate.toLocaleDateString() : '?'}`;
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
    recurrencePattern: RecurrencePattern,
    startDate: Date,
    onCompleted: (pattern: any) => void) {
      const dialogConfig = new MatDialogConfig();
      if (!recurrencePattern) {
        recurrencePattern = {
          // empty pattern0
          frequency: '',
          recurrence: 1,
          weekMask: 0,
          dayInMonth: 1,
          weekInMonth: 1,
          weekDayInMonth: 1,
          endDate: new Date(startDate),
        };
      }

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {...recurrencePattern, startDate};
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
              startDate: new Date(result.startDate),
              endDate: new Date(result.endDate)
            };
            onCompleted(patternData);
          }
        },
        err => {
          console.error(err);
          alert(err);
        }
      );
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private recurrentEventService: RecurrentEventService,
    private dialogRef: MatDialogRef<RecurrencePatternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
      startDate: new FormControl(this.data.startDate),
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
    const pattern = { ...this.form.value };
    pattern.endDate = new Date (this.form.controls.endDate.value);
    const occurrences = computeOccurences(pattern, this.startDate, this.monthlyMode);
    this.dialogRef.close(form.value);
  }

  onFrequencyChange(newFrequency: string) {
    this.selectedFrequency = newFrequency;
  }

  get startDate(): Date {
    const startDate = new Date(this.form.controls.startDate.value);
    startDate.setHours(
      this.data.startDate.getHours(),
      this.data.startDate.getMinutes(),
      this.data.startDate.getSeconds(),
      this.data.startDate.getMilliseconds()
    );
    return startDate;
  }

  recurrencePattern2String(): string {
    const pattern = { ...this.form.value };
    pattern.endDate = new Date (this.form.controls.endDate.value);
    return recurrencePattern2String(pattern, this.startDate, this.monthlyMode);
  }

  computeOccurrences(): Date[] {
    const pattern = { ...this.form.value };
    pattern.endDate = new Date (this.form.controls.endDate.value);
    return this.recurrentEventService.computeOccurences(pattern, this.startDate, this.monthlyMode);
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

  setEndDateMin(value: any) {
    console.log(value);
  }

  dayNumToString(dayNum: number): string {
    return dayNumToString(dayNum);
  }

  dayNumFromString(dayStr: string): number {
    return dayNumFromString(dayStr);
  }


}
