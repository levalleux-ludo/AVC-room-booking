import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Room } from '../model';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent implements OnInit {

  form: FormGroup;

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;

  // selectedRoom: string;
  selectedRoom: Room;

  // _date = new Date();
  // set date(value: Date) {
  //   this._date = value;
  //   this.dateControl = new FormControl(this._date);
  // }
  // get date() {
  //   return this._date;
  // }

  // _dateControl: FormControl;
  // get dateControl() {
  //   return this._dateControl;
  // }
  // set dateControl(value: FormControl) {
  //   this._dateControl = value;
  //   this._date = this._dateControl.value;
  //   this.calendar.setSelection(this.date, this.startTime, this.endTime)
  // }

  selectOnCalendar() {
    // this.calendar.setSelection(this.form.value.date, this.startTime, this.endTime);
      if (this.calendar && this.shallUpdateCalendar) {
        this.calendar.previewEvent(this.form.value.title, this.startDate, this.endDate);
      }
  }
  
  time: NgbTimeStruct = {hour: 13, minute: 30, second:0 };

  minTime = 8;
  maxTime = 19;

  shallUpdateCalendar = true;
  updateCalendar() {
    if (this.calendar && this.shallUpdateCalendar) {
      this.calendar.previewEvent(this.form.value.title, this.startDate, this.endDate);
    }
  }

  get startDate(): Date {
    let date: Date = new Date(this.form.value.date);
    date.setHours(Math.floor(this.startTime));
    date.setMinutes(60 * (this.startTime - Math.floor(this.startTime)) );
    return date;
  }

  get endDate(): Date {
    let date: Date = new Date(this.form.value.date);
    date.setHours(Math.floor(this.endTime));
    date.setMinutes(60 * (this.endTime - Math.floor(this.endTime)) );
    return date;
  }

  _startTime: number;
  get startTime() {
    return this._startTime;
  }
  set startTime(value: number) {
    if (this._startTime !== value) {
      if (value >= this.maxTime) {
        value = this.maxTime - 0.5;
      }
      if (value < this.minTime) {
        value = this.minTime;
      }
      this._startTime = value;
      //this.calendar.setSelection(this.form.value.date, this.startTime, this.endTime);
      this.updateCalendar();
    }
  }
  _endTime: number;
  get endTime() {
    return this._endTime;
  }
  set endTime(value: number) {
    if (this._endTime !== value) {
      if (value > this.maxTime) {
        value = this.maxTime;
      }
      if (value <= this.minTime) {
        value = this.minTime + 0.5;
      }
      this._endTime = value;
      // this.calendar.setSelection(this.form.value.date, this.startTime, this.endTime);
      this.updateCalendar();
    }
  }

  OnCalendarSelect(event: {startDate: Date, endDate: Date}) {
    console.log("BookingDialogComponent::OnCalendarSelect, event", event);
    let startTime: number = event.startDate.getHours() + (event.startDate.getMinutes() / 60);
    let endTime: number = event.endDate.getHours() + (event.endDate.getMinutes() / 60);
    let date: number = new Date(event.startDate).setHours(0,0,0,0);

    this.shallUpdateCalendar = false;
    this.form.patchValue({date: new Date(date)});
    this.startTime = startTime;
    this.endTime = endTime;
    this.shallUpdateCalendar = true;
    this.updateCalendar();
  }

  OnCalendarPreviewUpdated(event: {startDate: Date, endDate: Date}) {
    console.log("BookingDialogComponent::OnCalendarPreviewUpdated, event", event);
    let startTime: number = event.startDate.getHours() + (event.startDate.getMinutes() / 60);
    let endTime: number = event.endDate.getHours() + (event.endDate.getMinutes() / 60);
    let date: number = new Date(event.startDate).setHours(0,0,0,0);

    this.shallUpdateCalendar = false;
    this.form.patchValue({date: new Date(date)});
    this.startTime = startTime;
    this.endTime = endTime;
    this.shallUpdateCalendar = true;
    this.updateCalendar();
  }

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<BookingDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.selectedRoom = this.data.room;
      }

  ngOnInit() {
      this.form = this.fb.group({
          title: '',
          organization: 'Company#3',
          room: this.selectedRoom,
          time: this.time,
          date: new FormControl(new Date()),
       });
  }

  submit(form) {
      this.dialogRef.close(form.value);
  }

  compareRooms(room1: Room, room2: Room): boolean {
    if(room1 && room2) {
      return room1.id === room2.id
     } else {
      return room1 === room2
     }
  }

}
