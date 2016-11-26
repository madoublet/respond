import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { AppService } from '../shared/services/app.service';

declare var toast: any;

@Component({
    selector: 'respond-forgot',
    templateUrl: 'forgot.component.html',
    providers: [UserService, AppService]
})

export class ForgotComponent {

  data;
  id;
  errorMessage;
  logoUrl;

  constructor (private _userService: UserService, private _appService: AppService, private _route: ActivatedRoute) {}

  ngOnInit() {

      this.logoUrl = '';

      this._route.params.subscribe(params => {
        this.id = params['id'];
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
   * Submit forgot request
   */
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