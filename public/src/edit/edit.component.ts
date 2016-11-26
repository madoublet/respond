import { Component } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var toast: any;

@Component({
    selector: 'respond-edit',
    templateUrl: 'edit.component.html'
})

export class EditComponent {

  url: SafeResourceUrl;

  constructor (private _sanitizer: DomSanitizer) {}

  /**
   * Init pages
   *
   */
  ngOnInit() {

    var id, pageUrl, editMode;

    id = localStorage.getItem('respond.siteId');
    pageUrl = localStorage.getItem('respond.pageUrl');
    editMode = localStorage.getItem('respond.editMode');

    this.url = this._sanitizer.bypassSecurityTrustResourceUrl('/edit?q=' + id + '/' + pageUrl + '&mode=' + editMode);

  }

}