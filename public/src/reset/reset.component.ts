import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';

declare var __moduleName: string;
declare var toast: any;

@Component({
    selector: 'respond-reset',
    moduleId: __moduleName,
    templateUrl: '/app/reset/reset.component.html',
    providers: [UserService]
})

export class ResetComponent {

  data;
  id;
  token;
  errorMessage;

  constructor (private _userService: UserService, private _route: ActivatedRoute) {}

  ngOnInit() {
      this._route.params.subscribe(params => {
        this.id = params['id'];
        this.token = params['token'];
      });
  }

  reset(event, password, retype){

      event.preventDefault();

      if(password !== retype) {
        alert('Password mismatch');
      }
      else {
        this._userService.reset(this.id, this.token, password)
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