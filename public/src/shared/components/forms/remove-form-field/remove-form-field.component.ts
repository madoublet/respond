import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormFieldService } from '../../../../shared/services/form-field.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-form-field',
    templateUrl: 'remove-form-field.component.html',
    providers: [FormFieldService]
})

export class RemoveFormFieldComponent {

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

  // field input
  @Input()
  set field(field){

    // set visible
    this.model = field;

  }

  // form input
  @Input() form;

  // index
  @Input() index

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _formFieldService: FormFieldService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      label: '',
      type: ''
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

    this._formFieldService.remove(this.form.id, this.index)
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