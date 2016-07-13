import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {UserService} from '../shared/services/user.service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'respond-forgot',
    moduleId: __moduleName,
    templateUrl: '/app/forgot/forgot.component.html',
    providers: [UserService],
    pipes: [TranslatePipe]
})

export class ForgotComponent {

  data;
  id;
  errorMessage;

  constructor (private _userService: UserService, private _routeParams: RouteParams) {}

  ngOnInit() {
      this.id = this._routeParams.get('id');
  }

  forgot(event, email, password){

      event.preventDefault();

      this._userService.forgot(this.id, email)
                   .subscribe(
                     () => { toast.show('success'); },
                     error =>  { this.failure(<any>error); }
                    );

  }

  /**
   * handles errors
   */
  failure(obj) {

    toast.show('failure');

  }


}