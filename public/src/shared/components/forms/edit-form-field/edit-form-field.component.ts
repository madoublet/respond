import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormFieldService } from '../../../../shared/services/form-field.service';

declare var toast: any;

@Component({
    selector: 'respond-edit-form-field',
    templateUrl: 'edit-form-field.component.html',
    providers: [FormFieldService]
})

export class EditFormFieldComponent {

  // model to store
  model = {
    label: '',
    type: '',
    required: false,
    options: '',
    helperText: '',
    placeholder: '',
    cssClass: ''
  };

  // visible input
  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  // form input
  @Input() form;

  // index
  @Input() index;

  // item input
  @Input()
  set field(field){

    // set item
    this.model = field;

  }

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _formFieldService: FormFieldService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      label: '',
      type: '',
      required: false,
      options: '',
      helperText: '',
      placeholder: '',
      cssClass: ''
    };

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

    this._formFieldService.edit(this.form.id, this.index, this.model.label, this.model.type, this.model.required, this.model.options, this.model.helperText, this.model.placeholder, this.model.cssClass)
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