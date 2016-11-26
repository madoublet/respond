import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-user',
    templateUrl: 'remove-user.component.html',
    providers: [UserService]
})

export class RemoveUserComponent {

  routes;

  // model to store
  model: {
    firstName: '',
    lastName: '',
    email: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  @Input()
  set user(user){

    // set visible
    this.model = user;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _userService: UserService) {}

  /**
   * Init pages
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

    this._userService.remove(this.model.email)
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