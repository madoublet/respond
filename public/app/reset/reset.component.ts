import {Component} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {UserService} from '/app/shared/services/user.service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'respond-reset',
    templateUrl: './app/reset/reset.component.html',
    providers: [UserService],
    pipes: [TranslatePipe]
})

export class ResetComponent {

  data;
  id;
  token;
  errorMessage;

  constructor (private _userService: UserService, private _routeParams: RouteParams) {}

  ngOnInit() {
      this.id = this._routeParams.get('id');
      this.token = this._routeParams.get('token');
  }

  reset(event, password, retype){

      event.preventDefault();

      if(password !== retype) {
        alert('Password mismatch');
      }
      else {
        this._userService.reset(this.id, this.token, password, retype)
                     .subscribe(
                       () => { alert('success'); },
                       error =>  { this.failure(<any>error); }
                      );
      }

  }

  /**
   * handles error
   */
  failure (obj) {

    toast.show('failure');

  }


}