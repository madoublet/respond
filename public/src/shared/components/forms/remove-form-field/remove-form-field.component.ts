import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {FormFieldService} from '../../../../shared/services/form-field.service';

@Component({
    selector: 'respond-remove-form-field',
    moduleId: __moduleName,
    templateUrl: '/app/shared/components/forms/remove-form-field/remove-form-field.component.html',
    providers: [FormFieldService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

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