import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {MenuItemService} from '../../../../shared/services/menu-item.service';

@Component({
    selector: 'respond-remove-menu-item',
    moduleId: __moduleName,
    templateUrl: '/app/shared/components/menus/remove-menu-item/remove-menu-item.component.html',
    providers: [MenuItemService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class RemoveMenuItemComponent {

  routes;

  // model to store
  model;

  _visible: boolean = false;

  // visible input
  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  // menu input
  @Input()
  set item(item){

    // set visible
    this.model = item;

  }

  // menu input
  @Input() menu;

  // index
  @Input() index

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _menuItemService: MenuItemService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      html: '',
      url: ''
    };

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

    this._menuItemService.remove(this.menu.id, this.index)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Handles a successful submission
   */
  success() {

    this._visible = false;
    this.onUpdate.emit(null);

  }


}