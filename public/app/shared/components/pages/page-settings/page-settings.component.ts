import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {PageService} from '/app/shared/services/page.service';
import {RouteService} from '/app/shared/services/route.service';

@Component({
    selector: 'respond-page-settings',
    templateUrl: './app/shared/components/pages/page-settings/page-settings.component.html',
    providers: [PageService, RouteService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class PageSettingsComponent {

  routes;
  errorMessage;

  // model to store
  model: {
    url: '',
    title: '',
    description: '',
    keywords: '',
    callout: '',
    layout: 'content',
    language: 'en',
    direction: 'ltr'
  };

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

  constructor (private _pageService: PageService, private _routeService: RouteService) {}

  /**
   * Init pages
   */
  ngOnInit() {

    this._routeService.list()
                     .subscribe(
                       data => { this.routes = data; },
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


    this._pageService.updateSettings(this.model.url, this.model.title, this.model.description, this.model.keywords, this.model.callout, this.model.layout, this.model.language, this.model.direction)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.errorMessage = <any>error; this.error() }
                      );

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