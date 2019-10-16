import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
// import { EventEmitter } from 'events';
import { throwError } from 'rxjs';
import { max } from 'moment';

export interface TimeInSelect {
  value: number;
  view: string;
  disabled: boolean;
}

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

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

  _unavailableHours: number[];
  @Input()
  get unavailableHours(): number[] {
    return this._unavailableHours;
  }
  set unavailableHours(value: number[]) {
    console.log("TimePickerComponent::set unavailableHours()", value);
    this._unavailableHours = value;
    this.computeSelectTimes();
  }

  computeSelectTimes() {
    let oldSelected = this.selectedHour;
    this.selectTimes = [];
    for (let time = this.minTime; time < this.maxTime; time = time + this.increment) {
      let date = new Date();
      date.setHours(Math.floor(time), 60*(time - Math.floor(time)), 0, 0);
      let disabled = (this._unavailableHours && this._unavailableHours.includes(time));
      this.selectTimes.push({
        value: time,
        view: date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
        disabled: disabled
      })
    }
    if (oldSelected && this.selectTimes.find(time => (!time.disabled && time.value === oldSelected.value))) {
      this.selectedHour = oldSelected;
    } else {
      this.selectedHour = this.selectTimes.find(time => (!time.disabled));
    }
  }
  selectTimes: TimeInSelect[] = [];

  constructor() {
  }

  ngOnInit() {
    this.computeSelectTimes();
  }

  compareTimes(time1: TimeInSelect, time2: TimeInSelect) {
    if (time1 && time2) {
      return time1.value == time2.value;
    } else {
      return time1 === time2;
    }
  }

}
