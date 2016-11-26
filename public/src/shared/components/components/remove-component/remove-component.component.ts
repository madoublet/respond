import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentService } from '../../../../shared/services/component.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-component',
    templateUrl: 'remove-component.component.html',
    providers: [ComponentService]
})

export class RemoveComponentComponent {

  errorMessage;

  // model to store
  model: {
    url: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  @Input()
  set component(component){

    // set visible
    this.model = component;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _componentService: ComponentService) {}

  /**
   * Init
   */
  ngOnInit() {

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

    this._componentService.remove(this.model.url)
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