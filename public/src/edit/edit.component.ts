import { Component } from '@angular/core';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';

declare var __moduleName: string;
declare var toast: any;

@Component({
    selector: 'respond-edit',
    moduleId: __moduleName,
    templateUrl: '/app/edit/edit.component.html',
    providers: [],
    directives: [],
    pipes: []
})

export class EditComponent {

  url: SafeResourceUrl;

  constructor (private _sanitizer: DomSanitizationService) {}

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