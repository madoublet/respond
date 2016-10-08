import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageService } from '../../../../shared/services/page.service';
import { RouteService } from '../../../../shared/services/route.service';

declare var toast: any;
declare var __moduleName: string;

@Component({
    selector: 'respond-add-page',
    moduleId: __moduleName,
    templateUrl: '/shared/components/pages/add-page/add-page.component.html',
    providers: [PageService, RouteService]
})

export class AddPageComponent {

  routes;

  // model to store
  model: {
    path: '/',
    url: '',
    title: '',
    description: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

    // reset model
    this.model = {
      path: '/',
      url: '',
      title: '',
      description: ''
    };

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
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
   * Hides the add page modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  submit() {

    // set full path
    var fullUrl = this.model.path + '/' + this.model.url;

    if(this.model.path == '/') {
      fullUrl = '/' + this.model.url;
    }

    this._pageService.add(fullUrl, this.model.title, this.model.description)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Handles a successful add
   */
  success() {

    toast.show('success');

    this._visible = false;
    this.onAdd.emit(null);

  }

}