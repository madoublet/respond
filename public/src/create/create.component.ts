import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../shared/services/site.service';
import { AppService } from '../shared/services/app.service';

declare var toast: any;

@Component({
    selector: 'respond-create',
    templateUrl: 'create.component.html',
    providers: [SiteService, AppService]
})

export class CreateComponent {

  themes;
  visible;
  selectedTheme;
  selectedThemeIndex;
  hasPasscode;
  logoUrl;
  themesLocation;
  model;
  site;

  constructor (private _siteService: SiteService, private _appService: AppService, private _router: Router) {}

  /**
   * Init pages
   */
  ngOnInit() {

    // init
    this.themes = [];
    this.visible = false;
    this.selectedTheme = null;
    this.selectedThemeIndex = 0;
    this.hasPasscode = true;
    this.logoUrl = '';
    this.themesLocation = '';

    // set model
    this.model = {
      name: '',
      theme: '',
      email: '',
      password: '',
      passcode: ''
    };

    // list themes
    this.list();

    // retrieve settings
    this.settings();

  }

  /**
   * Create the site
   *
   */
  submit() {

      this._siteService.create(this.model.name, this.selectedTheme.location, this.model.email, this.model.password, this.model.passcode)
                   .subscribe(
                     data => { this.site = data; this.success(); },
                     error =>  { this.failure(<any>error); }
                    );

  }

  /**
   * Get settings
   */
  settings() {

    // list themes in the app
    this._appService.retrieveSettings()
                     .subscribe(
                       data => {
                         this.hasPasscode = data.hasPasscode;
                         this.logoUrl = data.logoUrl;
                         this.themesLocation = data.themesLocation;
                       },
                       error =>  { this.failure(<any>error); }
                      );


  }

  /**
   * Updates the list
   */
  list() {

    // list themes in the app
    this._appService.listThemes()
                     .subscribe(
                       data => {
                         this.themes = data;
                         this.selectedTheme = this.themes[0];
                         this.selectedThemeIndex = 0;
                         this.visible = false;
                       },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Cycles through themes
   */
  next () {

    // increment or cycle
    if((this.selectedThemeIndex + 1) < this.themes.length) {
      this.selectedThemeIndex = this.selectedThemeIndex + 1;
    }
    else {
      this.selectedThemeIndex = 0;
    }

    // set new theme
    this.selectedTheme = this.themes[this.selectedThemeIndex];

  }

  /**
   * Selects a theme
   */
  select (index) {

    this.selectedThemeIndex = index;
    this.selectedTheme = this.themes[this.selectedThemeIndex];

    window.scrollTo(0, 0);
  }


  /**
   * Uses the selected theme
   */
  useTheme () {

    // set new theme
    this.visible = true;

  }

  /**
   * Hides the create modal
   */
  hide () {

    // set new theme
    this.visible = false;

  }

  /**
   * Handles a successful create
   *
   */
  success() {

    toast.show('success');

    this._router.navigate( ['/login', this.site.id] );

    // clear model
    this.model = {
      name: '',
      theme: '',
      email: '',
      password: '',
      passcode: ''
    };

  }

  /**
   * handles errors
   */
  failure(obj) {

    toast.show('failure');

  }

}
