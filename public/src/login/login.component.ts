import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

declare var __moduleName: string;
declare var toast: any;

@Component({
    selector: 'respond-login',
    moduleId: __moduleName,
    templateUrl: '/app/login/login.component.html',
    providers: [UserService],
    pipes: [TranslatePipe]
})

export class LoginComponent {

  data;
  id;
  errorMessage;

  constructor (private _userService: UserService, private _route: ActivatedRoute, private _router: Router, private _translate: TranslateService) {}

  ngOnInit() {

      this._route.params.subscribe(params => {
        this.id = params['id'];
        localStorage.setItem('respond.siteId', this.id);
      });

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
   * handles error
   */
  failure(obj) {

    toast.show('failure');

  }

}