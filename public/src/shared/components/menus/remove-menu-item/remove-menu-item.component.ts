import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItemService } from '../../../../shared/services/menu-item.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-menu-item',
    templateUrl: 'remove-menu-item.component.html',
    providers: [MenuItemService]
})

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