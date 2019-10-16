import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
// import { EventEmitter } from 'events';
import { throwError } from 'rxjs';
import { max } from 'moment';

export interface TimeInSelect {
  value: number;
  view: string
}

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  // hours: TimeInSelect[] = [
  //   {value:8, view:'8:00 AM'},
  //   {value:8.5, view:'8:30 AM'},
  //   {value:9, view:'9:00 AM'},
  //   {value:9.5, view:'9:30 AM'},
  //   {value:10, view:'10:00 AM'},
  //   {value:10.5, view:'10:30 AM'},
  //   {value:11, view:'11:00 AM'},
  //   {value:11.5, view:'11:30 AM'},
  //   {value:12, view:'12:00 PM'},
  //   {value:12.5, view:'12:30 PM'},
  //   {value:13, view:'1:00 PM'},
  //   {value:13.5, view:'1:30 PM'},
  //   {value:14, view:'2:00 PM'},
  //   {value:14.5, view:'2:30 PM'},
  //   {value:15, view:'3:00 PM'},
  //   {value:15.5, view:'3:30 PM'},
  //   {value:16, view:'4:00 PM'},
  //   {value:16.5, view:'4:30 PM'},
  //   {value:17, view:'5:00 PM'},
  //   {value:17.5, view:'5:30 PM'},
  //   {value:18, view:'6:00 PM'},
  //   {value:18.5, view:'6:30 PM'},
  //   {value:19, view:'7:00 PM'},
  //   {value:19.5, view:'7:30 PM'},
  // ];
  _selectedHour: TimeInSelect;
  get selectedHour(): TimeInSelect {
    return this._selectedHour;
  }
  set selectedHour(value: TimeInSelect) {
    this._selectedHour = value;
    if (this._selectedHour)
      this.hourChange.emit(value.value);
  }
  // minutes: TimeInSelect[] = [
  //   {value:0, view:'00'},
  //   {value:30, view:'30'},
  // ];
  // _selectedMinute: TimeInSelect = this.minutes[0];
  // get selectedMinute(): TimeInSelect {
  //   return this._selectedMinute;
  // }
  // set selectedMinute(value: TimeInSelect) {
  //   this._selectedMinute = value;
  //   if (this._selectedMinute)
  //     this.minuteChange.emit(value.value);
  // }

  @Input()
  get hour(): number {
    return this.selectedHour.value;
  }
  @Output() hourChange = new EventEmitter();
  set hour(value: number) {
    // if (value < this.hours[0].value) value = this.hours[0].value;
    // if (value > this.hours[this.hours.length-1].value) value = this.hours[this.hours.length-1].value;
    this.selectedHour = this.selectTimes.find(hour => hour.value === value);
    if (this.selectedHour) {
      console.log(`this.hourChange.emit(${this.selectedHour.value})`);
      this.hourChange.emit(this.selectedHour.value);
    }
  }

  _minTime: number = 0;
  @Input()
  get minTime(): number {
    return this._minTime;
  }
  set minTime(value: number) {
    this._minTime = value;
    this.computeSelectTimes();
  }

  _maxTime: number = 24;
  @Input()
  get maxTime(): number {
    return this._maxTime;
  }
  set maxTime(value: number) {
    this._maxTime = value;
    this.computeSelectTimes();
  }

  _increment: number = 0.5;
  @Input()
  get increment(): number {
    return this._increment;
  }
  set increment(value: number) {
    this._increment = value;
    this.computeSelectTimes();
  }

  computeSelectTimes() {
    let oldSelected = this.selectedHour;
    this.selectTimes = [];
    for (let time = this.minTime; time < this.maxTime; time = time + this.increment) {
      let date = new Date();
      date.setHours(Math.floor(time), 60*(time - Math.floor(time)), 0, 0);
      this.selectTimes.push({
        value: time,
        view: date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
      })
    }
    if (oldSelected && this.selectTimes.map(time => time.value).includes(oldSelected.value)) {
      this.selectedHour = oldSelected;
    } else {
      this.selectedHour = this.selectTimes[0];
    }
    // if (!this.selectedHour || (!this.selectTimes.map(time => time.value).includes(this.selectedHour.value))) {
    //   this.selectedHour = this.selectTimes[0];
    // }
    // this.selectTimes = this.hours.filter((time, index, array) => {return (time.value >= this.minTime) && (time.value <= this.maxTime);})
  }
  selectTimes: TimeInSelect[] = [];

  // @Input()
  // get minute(): number {
  //   return this.selectedMinute.value;
  // }
  // @Output() minuteChange = new EventEmitter();
  // set minute(value: number) {
  //   // if (value < 30) value = 0;
  //   // else value = 30;
  //   this.selectedMinute = this.minutes.find(minute => minute.value === value);
  //   if (this.selectedMinute)
  //     this.minuteChange.emit(this.selectedMinute.value);
  // }

  constructor() {
    this.computeSelectTimes();
  }

  ngOnInit() {
  }

  compareTimes(time1: TimeInSelect, time2: TimeInSelect) {
    if (time1 && time2) {
      return time1.value == time2.value;
    } else {
      return time1 === time2;
    }
  }

}
