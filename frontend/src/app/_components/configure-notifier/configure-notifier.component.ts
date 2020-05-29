import { Component, OnInit } from '@angular/core';
import { Notifier } from 'src/app/_model/notifier';
import { WaiterService } from 'src/app/_services/waiter.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ImagesService } from 'src/app/_services/images.service';
import { Observable } from 'rxjs';
import { FileUploadAction } from '../material-file-upload/material-file-upload.component';
import { NotificationService } from 'src/app/_services/notification.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-configure-notifier',
  templateUrl: './configure-notifier.component.html',
  styleUrls: ['./configure-notifier.component.scss']
})
export class ConfigureNotifierComponent implements OnInit {

  editable = true;
  edited: Notifier;
  original: Notifier;
  _resetPassword = false;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private notifierService: NotificationService,
    private waiter: WaiterService
  ) {
    waiter.init();
  }

  ngOnInit() {
    this.refresh();
  }

  get resetPassword(): boolean {
    return this._resetPassword;
  }
  set resetPassword(value: boolean) {
    this._resetPassword = value;
    if (!this._resetPassword) {
      this.edited.newPassword = '';
      this.edited.oldPassword = '';
    }
  }

  protected refresh() {
    const waiterTask = this.waiter.addTask();
    this.notifierService.get().subscribe((notifierData: any) => {
      this.edited = new Notifier(notifierData);
      this.original = new Notifier(notifierData);
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }

  onClickSubmit() {
    const waiterTask = this.waiter.addTask();
    this.notifierService.update(this.edited).subscribe(() => {
      this.refresh();
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }

  onClickCancel() {
    // this.edited.serviceDescription = this.original.serviceDescription;
    this.edited = new Notifier(this.original.getData());
  }

  compareReceiversArray(receivers1: string[], receivers2: string[]): boolean {
    if (receivers1.length !== receivers2.length) {
      return false;
    }
    const copyReceivers1 = Array.from(receivers1);
    for (const recv2 of receivers2) {
      const index = copyReceivers1.indexOf(recv2);
      if (index > -1) {
        copyReceivers1.splice(index, 1);
      }
    }
    return copyReceivers1.length === 0;
  }

  isModified(): boolean {
    return (this.edited && (
      (this.edited.host !== this.original.host) ||
      (this.edited.port !== this.original.port) ||
      (this.edited.secure !== this.original.secure) ||
      (!this.compareReceiversArray(this.edited.receivers, this.original.receivers)) ||
      (this.edited.auth.user !== this.original.auth.user) ||
      (this.edited.newPassword && (this.edited.newPassword !== '')) ||
      false // reserved for other fields
    ));
  }
}
