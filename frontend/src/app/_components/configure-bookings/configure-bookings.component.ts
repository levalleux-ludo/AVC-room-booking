import { Component, OnInit } from '@angular/core';
import { BookingsConfigService } from 'src/app/_services/bookings-config.service';
import { BookingsConfig } from 'src/app/_model/bookingsConfig';
import { WaiterService } from 'src/app/_services/waiter.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileUploadAction } from '../material-file-upload/material-file-upload.component';
import { FilesService } from 'src/app/_services/files.service';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-configure-bookings',
  templateUrl: './configure-bookings.component.html',
  styleUrls: ['./configure-bookings.component.scss']
})
export class ConfigureBookingsComponent implements OnInit {

  editable = true;
  edited: BookingsConfig;
  original: BookingsConfig;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '500px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
};

pdfSrc = {
  url: ''
};

constructor(
    private bookingsConfigService: BookingsConfigService,
    private waiter: WaiterService,
    private filesService: FilesService,
    public sanitizer: DomSanitizer,

  ) { }

  ngOnInit() {
    this.refresh();
  }

  protected refresh() {
    const waiterTask = this.waiter.addTask();
    this.bookingsConfigService.get().subscribe((bookingsConfig: any) => {
      this.edited = new BookingsConfig(bookingsConfig);
      this.original = new BookingsConfig(bookingsConfig);
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }

  isModified() {
    return (this.edited && (
      (this.edited.startTime !== this.original.startTime) ||
      (this.edited.endTime !== this.original.endTime) ||
      (this.edited.termsAndConditions && (!this.original.termsAndConditions || (this.edited.termsAndConditions.fileId !== this.original.termsAndConditions.fileId))) ||
      false // reserved for other fields
    ));
  }

  isValid() {
    return (this.edited.startTime
      && this.edited.endTime
      && this.edited.endTime > this.edited.startTime);
  }

  onClickSubmit() {
    const waiterTask = this.waiter.addTask();
    this.bookingsConfigService.update(this.edited).subscribe(() => {
      this.refresh();
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }

  onClickCancel() {
    this.edited = new BookingsConfig(this.original.getData());
  }

  onClickEdit(itemNum: number) {

  }

  uploadFile(data: FileUploadAction) {
    const file = data.fileModel;
    console.log(`uploadFile(${file})`);
    file.inProgress = true;
    file.sub = this.filesService.uploadFile(file.data)
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          if (this.edited) {
            this.edited.termsAndConditions = {
              fileId: '',
              fileName: file.data.name,
              uploadDate: new Date(Date.now())
            };
          }
          data.onSuccess(event);
        }
      }, (error: any) => {
        data.onFailure(error);
      });
  }


  onTACUploaded(data: {fileId: string}) {
    console.log(`onFileUploaded(${JSON.stringify(data)})`);
    const fileId = data.fileId;
    this.filesService.getFileUrl(fileId).subscribe((url) => {
      if (this.edited) {
        this.edited.termsAndConditions.fileId = fileId;
      }
    });
  }

  getFileUrlFromId(fileId: string): Observable<any> {
    if (!fileId || (fileId === '')) {
      return of(null);
    }
    return new Observable(subscribe => {
      this.filesService.getFileUrl(fileId).subscribe(url => {
        subscribe.next(url);
        subscribe.complete();
      });
    });
  }

}
