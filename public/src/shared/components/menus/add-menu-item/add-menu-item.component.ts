import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItemService } from '../../../../shared/services/menu-item.service';
import { PageService } from '../../../../shared/services/page.service';

declare var toast: any;

@Component({
    selector: 'respond-add-menu-item',
    templateUrl: 'add-menu-item.component.html',
    providers: [MenuItemService, PageService]
})

export class AddMenuItemComponent {

  pages;
  errorMessage;

  // model to store
  model = {
    html: '',
    cssClass: '',
    isNested: false,
    url: '',
    target: ''
  };

  flip: boolean = false;

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
      url: '',
      target: ''
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

    this._menuItemService.add(this.menu.id, this.model.html, this.model.cssClass, this.model.isNested, this.model.url, this.model.target)
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

  /**
   * Handles a successful add
   */
  flipCard() {

    // flip
    this.flip = !this.flip;

  }

  /**
   * Handles a successful add
   */
  setUrl(item) {

    // flip
    this.flip = !this.flip;

    this.model.url = item.url;

  }

}