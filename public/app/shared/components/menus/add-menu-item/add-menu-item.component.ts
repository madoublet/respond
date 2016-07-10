import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {MenuItemService} from '/app/shared/services/menu-item.service';
import {PageService} from '/app/shared/services/page.service';

@Component({
    selector: 'respond-add-menu-item',
    templateUrl: './app/shared/components/menus/add-menu-item/add-menu-item.component.html',
    providers: [MenuItemService, PageService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class AddMenuItemComponent {

  menu;
  pages;

  // model to store
  model = {
    html: '',
    cssClass: '',
    isNested: false,
    url: ''
  };

  // visible input
  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

    // reset model
    this.model = {
      html: '',
      cssClass: '',
      isNested: false,
      url: ''
    };

  }

  get visible() { return this._visible; }

  // menu input
  @Input() menu;

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _menuItemService: MenuItemService, private _pageService: PageService) {}

  /**
   * Init
   */
  ngOnInit() {

    // list pages
    this._pageService.list()
                     .subscribe(
                       data => { this.pages = data; },
                       error =>  this.errorMessage = <any>error
                      );

  }

  /**
   * Hides the add modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  submit() {

    this._menuItemService.add(this.menu.id, this.model.html, this.model.cssClass, this.model.isNested, this.model.url)
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