import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormService } from '../../../../shared/services/form.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-form',
    templateUrl: 'remove-form.component.html',
    providers: [FormService]
})

export class RemoveFormComponent {

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

  // form input
  @Input()
  set form(form){

    // set visible
    this.model = form;

  }

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _formService: FormService) {}

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

    this._formService.remove(this.model.id)
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