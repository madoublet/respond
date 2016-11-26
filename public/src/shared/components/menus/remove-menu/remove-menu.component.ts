import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { GalleryService } from '../../../../shared/services/gallery.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-menu',
    templateUrl: 'remove-menu.component.html',
    providers: [MenuService]
})

export class RemoveMenuComponent {

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
  set menu(menu){

    // set visible
    this.model = menu;

  }

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _menuService: MenuService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      id: '',
      name: ''
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

    this._menuService.remove(this.model.id)
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