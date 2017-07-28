import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageService } from '../../../../shared/services/page.service';
import { SiteService } from '../../../../shared/services/site.service';
import { RouteService } from '../../../../shared/services/route.service';

declare var toast: any;

@Component({
    selector: 'respond-page-settings',
    templateUrl: 'page-settings.component.html',
    providers: [PageService, SiteService, RouteService]
})

export class PageSettingsComponent {

  routes: any;
  templates: any
  errorMessage: any;
  model: any;
  selectVisible: boolean;

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  @Input()
  set page(page){

    // set visible
    this.model = page;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _pageService: PageService, private _siteService: SiteService, private _routeService: RouteService) {}

  /**
   * Init pages
   */
  ngOnInit() {

    this._routeService.list()
                     .subscribe(
                       data => { this.routes = data; },
                       error =>  { this.onError.emit(<any>error); }
                      );

    this._siteService.listTemplates()
                     .subscribe(
                       data => { this.templates = data; },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  submit() {

    this._pageService.updateSettings(this.model.url, this.model.title, this.model.description, this.model.keywords, this.model.tags, this.model.callout, this.model.language, this.model.direction, this.model.template, this.model.customHeader, this.model.customFooter, this.model.photo, this.model.thumb, this.model.location)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.errorMessage = <any>error; this.error() }
                      );

  }
  
  /**
   * Shows the select modal
   */
  showSelect() {
    this.selectVisible = true;
  }
  
  /**
   * Handles the selection of an image
   */
  select(event) {
    this.model.photo = 'files/' + event.name;
    this.model.thumb = 'files/thumbs/' + event.name;
    this.selectVisible = false;
  }

  /**
   * Handles a successful submission
   */
  success() {

    toast.show('success');

    this._visible = false;
    this.onUpdate.emit(null);

  }

  /**
   * Handles an error
   */
  error() {

    console.log('[respond.error] ' + this.errorMessage);
    toast.show('failure');

  }


}