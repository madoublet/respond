import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormService } from '../../../../shared/services/form.service';

declare var toast: any;

@Component({
    selector: 'respond-add-form',
    templateUrl: 'add-form.component.html',
    providers: [FormService]
})

export class AddFormComponent {

  routes;

  // model to store
  model: {
    name: '',
    cssClass: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

    // reset model
    this.model = {
      name: '',
      cssClass: ''
    };

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _formService: FormService) {}

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

    this._formService.add(this.model.name, this.model.cssClass)
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