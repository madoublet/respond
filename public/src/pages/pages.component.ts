import {Component} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, CanActivate} from '@angular/router-deprecated';
import {PageService} from '../shared/services/page.service';
import {AddPageComponent} from '../shared/components/pages/add-page/add-page.component';
import {PageSettingsComponent} from '../shared/components/pages/page-settings/page-settings.component';
import {RemovePageComponent} from '../shared/components/pages/remove-page/remove-page.component';
import {DrawerComponent} from '../shared/components/drawer/drawer.component';
import {TimeAgoPipe} from '../shared/pipes/time-ago.pipe';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'respond-pages',
    moduleId: __moduleName,
    templateUrl: '/app/pages/pages.component.html',
    providers: [PageService],
    directives: [AddPageComponent, PageSettingsComponent, RemovePageComponent, DrawerComponent],
    pipes: [TimeAgoPipe, TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class PagesComponent {

  id;
  page;
  pages;
  errorMessage;
  selectedPage;
  addVisible: boolean;
  removeVisible: boolean;
  drawerVisible: boolean;
  settingsVisible: boolean;

  constructor (private _pageService: PageService, private _router: Router) {}

  /**
   * Init pages
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.addVisible = false;
    this.removeVisible = false;
    this.settingsVisible = false;
    this.drawerVisible = false;
    this.page = {};
    this.pages = [];

    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();
    this._pageService.list()
                     .subscribe(
                       data => { this.pages = data; },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.removeVisible = false;
    this.addVisible = false;
    this.settingsVisible = false;
    this.drawerVisible = false;
    this.page = {};
  }

  /**
   * Sets the list item to active
   *
   * @param {Page} page
   */
  setActive(page) {
    this.selectedPage = page;
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the add dialog
   */
  showAdd() {
    this.addVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {Page} page
   */
  showRemove(page) {
    this.removeVisible = true;
    this.page = page;
  }

  /**
   * Shows the settings dialog
   *
   * @param {Page} page
   */
  showSettings(page) {
    this.settingsVisible = true;
    this.page = page;
  }

  /**
   * Shows the settings dialog
   *
   * @param {Page} page
   */
  edit(page) {
    // window.location = '/edit?q=' + this.id + '/' + page.url;
    
    localStorage.setItem('respond.pageUrl', page.url);
    
    this._router.navigate( ['Edit'] );
  }

  /**
   * handles error
   */
  failure (obj) {

    toast.show('failure');

    if(obj.status == 401) {
      this._router.navigate( ['Login', {id: this.id}] );
    }

  }


}