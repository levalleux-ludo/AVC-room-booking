import { Component, OnInit } from '@angular/core';
import { Website } from 'src/app/_model/website';
import { WebsiteService } from 'src/app/_services/website.service';
import { WaiterService } from 'src/app/_services/waiter.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ImagesService } from 'src/app/_services/images.service';
import { Observable } from 'rxjs';
import { FileUploadAction } from '../material-file-upload/material-file-upload.component';

@Component({
  selector: 'app-configure-website',
  templateUrl: './configure-website.component.html',
  styleUrls: ['./configure-website.component.scss']
})
export class ConfigureWebsiteComponent implements OnInit {

  editable = true;
  edited: Website;
  original: Website;

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

  constructor(
    private websiteService: WebsiteService,
    private imagesService: ImagesService,
    private waiter: WaiterService
  ) {
    waiter.init();
  }

  ngOnInit() {
    this.refresh();
  }

  protected refresh() {
    const waiterTask = this.waiter.addTask();
    this.websiteService.get().subscribe((websiteData: any) => {
      this.edited = new Website(websiteData);
      this.original = new Website(websiteData);
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }

  onClickSubmit() {
    const waiterTask = this.waiter.addTask();
    this.websiteService.update(this.edited).subscribe(() => {
      this.refresh();
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }

  onClickCancel() {
    // this.edited.serviceDescription = this.original.serviceDescription;
    this.edited = new Website(this.original.getData());
  }

  comparePicturesArray(pics1: string[], pics2: string[]): boolean {
    if (pics1.length !== pics2.length) {
      return false;
    }
    const copyPics1 = Array.from(pics1);
    for (const pic2 of pics2) {
      const index = copyPics1.indexOf(pic2);
      if (index > -1) {
        copyPics1.splice(index, 1);
      }
    }
    return copyPics1.length === 0;
  }

  isModified(): boolean {
    return (this.edited && (
      (this.edited.serviceDescription !== this.original.serviceDescription) ||
      (this.edited.presentationHTML !== this.original.presentationHTML) ||
      (this.edited.indicatorsHTML !== this.original.indicatorsHTML) ||
      (!this.comparePicturesArray(this.edited.pictures, this.original.pictures)) ||
      (this.edited.backgroundPicture !== this.original.backgroundPicture) ||
      false // reserved for other fields
    ));
  }

  onImageUploaded(data: {fileId: string}) {
    console.log(`onImageUploaded(${JSON.stringify(data)})`);
    const imageId = data.fileId;
    this.imagesService.getImageUrl(imageId).subscribe((url) => {
      if (this.edited && !this.edited.pictures.includes(imageId)) {
        this.edited.pictures.push(imageId);
      }
    });
  }

  getImageUrlFromId(imageId: string): Observable<string> {
    let url = this.imagesService.getImageUrl(imageId);
    return url;
  }

  uploadFile(data: FileUploadAction) {
    const file = data.fileModel;
    console.log(`uploadFile(${file})`);
    file.inProgress = true;
    file.sub = this.imagesService.uploadImage(file.data)
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          data.onSuccess(event);
        }
      }, (error: any) => {
        data.onFailure(error);
      });
  }

  onDeleteImage(imageId: string) {
    if (this.edited && this.edited.pictures.includes(imageId)) {
      this.edited.pictures.splice(this.edited.pictures.indexOf(imageId), 1);
    }
  }

  onBackgroundImageUploaded(data: {fileId: string}) {
    console.log(`onImageUploaded(${JSON.stringify(data)})`);
    const imageId = data.fileId;
    this.imagesService.getImageUrl(imageId).subscribe((url) => {
      if (this.edited) {
        this.edited.backgroundPicture = imageId;
      }
    });
  }

}
