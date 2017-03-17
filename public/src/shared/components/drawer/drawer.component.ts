import { Component, Renderer, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../../../shared/services/site.service';
import { AppService } from '../../../shared/services/app.service';

declare var toast: any;

@Component({
    selector: 'respond-drawer',
    templateUrl: 'drawer.component.html',
    providers: [SiteService, AppService]
})

export class DrawerComponent {

  globalListener: any;

  status: string;
  daysRemaining: int;

  activationMethod: string;
  activationUrl: string;
  stripeAmount: int;
  stripeName: string;
  stripeDescription: string;
  stripePublishableKey: string;

  id;
  dev;
  siteUrl;
  _visible: boolean = false;
  _active: string;

  @Input()
  set visible(visible: boolean){
    this._visible = visible;
  }

  get visible() { return this._visible; }

  @Input()
  set active(active: string){
    this._active = active;
  }

  get active() { return this._active; }

  @Output() onHide = new EventEmitter<any>();

  constructor (private _siteService: SiteService, private _appService: AppService, private _router: Router, private renderer: Renderer) {}

  /**
   * Init pages
   */
  ngOnInit() {
    this.id = localStorage.getItem('respond.siteId');
    this.dev = false;
    this.siteUrl = '';
    this.status = 'Active';
    this.daysRemaining = 0;
    this.activationUrl = '';

    var url = window.location.href;

    if(url.indexOf('?dev') !== -1) {
      this.dev = true;
    }

    // get app settings
    this.settings();
  }

  /**
   * Get settings
   */
  settings() {

    // set trial information
    this.status = localStorage.getItem('site_status');
    this.daysRemaining = parseInt(localStorage.getItem('site_trial_days_remaining'));

    // activation
    this.activationMethod = localStorage.getItem('activation_method');
    this.activationUrl = localStorage.getItem('activation_url');
    this.stripeAmount = parseInt(localStorage.getItem('stripe_amount'));
    this.stripeName = localStorage.getItem('stripe_name');
    this.stripeDescription = localStorage.getItem('stripe_description');
    this.stripePublishableKey = localStorage.getItem('stripe_publishable_key');

    // list themes in the app
    this._appService.retrieveSettings()
                     .subscribe(
                       data => {
                         this.siteUrl = data.siteUrl;
                         this.siteUrl = this.siteUrl.replace('{{siteId}}', this.id);
                       },
                       error =>  { }
                      );
  }

  /**
   * View the code editor
   */
  viewCode() {

    localStorage.setItem('respond.codeUrl', 'templates/default.html');
    localStorage.setItem('respond.codeType', 'template');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/code',  id] );

  }

  /**
   * Hides the add page modal
   */
  hide() {
    this._visible = false;
    this.onHide.emit(null);
  }

  /**
   * Reload system files
   */
  reload() {

    this._siteService.reload()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );

  }

  /**
   * Republish sitemap
   */
  sitemap() {
    this._siteService.sitemap()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );
  }

  /**
   * Stripe checkout
   */
  checkout() {

    var context = this;

    var handler = (<any>window).StripeCheckout.configure({
      key: this.stripePublishableKey,
      locale: 'auto',
      token: function (token: any) {

        console.log(token);

        // subscribe
        context._siteService.subscribe(token.id, token.email)
                     .subscribe(
                       data => { context.subscribed(); toast.show('success'); },
                       error => { toast.show('failure');  }
                      );


        // send this to the server to create the subscription

        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: this.stripeName,
      description: this.stripeDescription,
      amount: this.stripeAmount
    });

    this.globalListener = this.renderer.listenGlobal('window', 'popstate', () => {
      handler.close();
    });
  }

  /**
   * Successfully subscribed
   */
  subscribed() {
    localStorage.setItem('site_status', 'Active');
    this.status = 'Active';
  }

  /**
   * Signs out of the system
   */
  signOut() {

    // remove token
    localStorage.removeItem('respond.siteId');

    // redirect
    this._router.navigate( ['/login', this.id] );

  }

}