import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
// import { EventEmitter } from 'events';
import { throwError } from 'rxjs';

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

  hours: TimeInSelect[] = [
    {value:8, view:'8 AM'},
    {value:9, view:'9 AM'},
    {value:10, view:'10 AM'},
    {value:11, view:'11 AM'},
    {value:12, view:'12 PM'},
    {value:13, view:'1 PM'},
    {value:14, view:'2 PM'},
    {value:15, view:'3 PM'},
    {value:16, view:'4 PM'},
    {value:17, view:'5 PM'},
    {value:18, view:'6 PM'},
    {value:19, view:'7 PM'},
  ];
  _selectedHour: TimeInSelect = this.hours[0];
  get selectedHour(): TimeInSelect {
    return this._selectedHour;
  }
  set selectedHour(value: TimeInSelect) {
    this._selectedHour = value;
    if (this._selectedHour)
      this.hourChange.emit(value.value);
  }
  minutes: TimeInSelect[] = [
    {value:0, view:'00'},
    {value:30, view:'30'},
  ];
  _selectedMinute: TimeInSelect = this.minutes[0];
  get selectedMinute(): TimeInSelect {
    return this._selectedMinute;
  }
  set selectedMinute(value: TimeInSelect) {
    this._selectedMinute = value;
    if (this._selectedMinute)
      this.minuteChange.emit(value.value);
  }

  @Input()
  get hour(): number {
    return this.selectedHour.value;
  }
  @Output() hourChange = new EventEmitter();
  set hour(value: number) {
    // if (value < this.hours[0].value) value = this.hours[0].value;
    // if (value > this.hours[this.hours.length-1].value) value = this.hours[this.hours.length-1].value;
    this.selectedHour = this.hours.find(hour => hour.value === value);
    if (this.selectedHour) {
      console.log(`this.hourChange.emit(${this.selectedHour.value})`);
      this.hourChange.emit(this.selectedHour.value);
    }
  }
  @Input()
  get minute(): number {
    return this.selectedMinute.value;
  }
  @Output() minuteChange = new EventEmitter();
  set minute(value: number) {
    // if (value < 30) value = 0;
    // else value = 30;
    this.selectedMinute = this.minutes.find(minute => minute.value === value);
    if (this.selectedMinute)
      this.minuteChange.emit(this.selectedMinute.value);
  }

  constructor() { }

  ngOnInit() {
  }

}
