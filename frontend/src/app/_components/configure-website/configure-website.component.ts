import { Component, OnInit } from '@angular/core';
import { Website } from 'src/app/_model/website';
import { WebsiteService } from 'src/app/_services/website.service';
import { WaiterService } from 'src/app/_services/waiter.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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

  isModified(): boolean {
    return (this.edited && (
      (this.edited.serviceDescription !== this.original.serviceDescription) ||
      (this.edited.presentationHTML !== this.original.presentationHTML) ||
      false // reserved for other fields
    ));
  }
}
