import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { AppService } from '../shared/services/app.service';

declare var toast: any;

@Component({
    selector: 'respond-reset',
    templateUrl: 'reset.component.html',
    providers: [UserService, AppService]
})

export class ResetComponent {

  data;
  id;
  token;
  errorMessage;
  logoUrl;

  constructor (private _userService: UserService, private _appService: AppService, private _route: ActivatedRoute) {}

  ngOnInit() {
      this.logoUrl = '';

      this._route.params.subscribe(params => {
        this.id = params['id'];
        this.token = params['token'];
      });

      // retrieve settings
      this.settings();
  }

  /**
   * Get settings
   */
  settings() {

    // list themes in the app
    this._appService.retrieveSettings()
                     .subscribe(
                       data => {
                         this.logoUrl = data.logoUrl;
                       },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Reset the password
   */
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