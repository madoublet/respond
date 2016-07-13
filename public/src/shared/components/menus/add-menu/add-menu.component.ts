import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {MenuService} from '/app/shared/services/menu.service';

@Component({
    selector: 'respond-add-menu',
    templateUrl: './app/shared/components/menus/add-menu/add-menu.component.html',
    providers: [MenuService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class AddMenuComponent {

  routes;

  // model to store
  model: {
    name: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

    // reset model
    this.model = {
      name: ''
    };

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _menuService: MenuService) {}

  /**
   * Init
   */
  ngOnInit() {

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

    this._menuService.add(this.model.name)
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