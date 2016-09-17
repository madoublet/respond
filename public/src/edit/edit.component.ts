import { Component } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var __moduleName: string;
declare var toast: any;

@Component({
    selector: 'respond-edit',
    moduleId: __moduleName,
    templateUrl: '/app/edit/edit.component.html'
})

export class EditComponent {

  url: SafeResourceUrl;

  constructor (private _sanitizer: DomSanitizer) {}

  /**
   * Init pages
   *
   */
  ngOnInit() {

    var id, pageUrl;

    id = localStorage.getItem('respond.siteId');
    pageUrl = localStorage.getItem('respond.pageUrl');

    this.url = this._sanitizer.bypassSecurityTrustResourceUrl('/edit?q=' + id + '/' + pageUrl);

  }

}