import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AppService } from '../shared/services/app.service';

declare var toast: any;

@Component({
    selector: 'respond-login',
    templateUrl: 'login.component.html',
    providers: [UserService, AppService]
})

export class LoginComponent {

  data;
  id;
  errorMessage;
  logoUrl
  usesLDAP = false;
  acknowledgement;

  constructor (private _userService: UserService, private _appService: AppService, private _route: ActivatedRoute, private _router: Router, private _translate: TranslateService) {}

  ngOnInit() {

      this.logoUrl = '';
    this.acknowledgement = '';

      this._route.params.subscribe(params => {
        this.id = params['id'];
        localStorage.setItem('respond.siteId', this.id);
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
                         this.acknowledgement = data.acknowledgement;
                         this.usesLDAP = data.usesLDAP;

                         // set activation
                         this.setActivation(data.activationMethod, data.activationUrl, data.stripeAmount, data.stripeName, data.stripeDescription, data.stripePublishableKey)
                       },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Login to the app
   *
   * @param {Event} event
   * @param {string} email The user's login email
   * @param {string} password The user's login password
   */
  login(event, email, password) {

      event.preventDefault();

      this._userService.login(this.id, email, password)
                   .subscribe(
                     data => { this.data = data; this.success(); },
                     error => { this.failure(<any>error); }
                    );

  }

  /**
   * Handles a successful login
   */
  success() {

    toast.show('success');

    // set language
    this.setLanguage(this.data.user.language);

    // set token
    this.setToken(this.data.token);

    // set status
    this.setStatus(this.data.user.status, this.data.user.days);

    // navigate
    this._router.navigate( ['/pages'] );

  }

  /**
   * Routes to the forgot password screen
   */
  forgot() {
    this._router.navigate( ['/forgot', this.id] );
  }

  /**
   * Sets the language for the app
   */
  setLanguage(language) {
      localStorage.setItem('user_language', language);

      // set language
      this._translate.use(language);
  }

  /**
   * Sets the token in local storage
   */
  setToken(token) {
      localStorage.setItem('id_token', token);
  }

  /**
   * Sets the status
   */
  setStatus(status, days) {

      // set expired
      if(status == 'Trial' && days < 0) {
        status = 'Expired';
      }

      localStorage.setItem('site_status', status);
      localStorage.setItem('site_trial_days_remaining', days);
  }

  /**
   * Sets the activation
   */
  setActivation(activationMethod, activationUrl, stripeAmount, stripeName, stripeDescription, stripePublishableKey) {

      localStorage.setItem('activation_method', activationMethod);
      localStorage.setItem('activation_url', activationUrl);
      localStorage.setItem('stripe_amount', stripeAmount);
      localStorage.setItem('stripe_name', stripeName);
      localStorage.setItem('stripe_description', stripeDescription);
      localStorage.setItem('stripe_publishable_key', stripePublishableKey);
  }


  /**
   * handles error
   */
  failure(obj) {

    toast.show('failure');

  }


}