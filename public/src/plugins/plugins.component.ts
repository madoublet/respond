import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../shared/services/site.service';

declare var toast: any;

@Component({
    selector: 'respond-plugins',
    templateUrl: 'plugins.component.html',
    providers: [SiteService]
})


export class PluginsComponent {

  id;
  plugin;
  Plugins;
  errorMessage;
  selectedPlugin;
  removeVisible: boolean;
  drawerVisible: boolean;


  constructor (private _siteService: SiteService, private _router: Router) {}

  /**
   * Init plugins
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.removeVisible = false;
    this.drawerVisible = false;
    this.plugin = {};
    this.plugins = [];

    // list plugins
    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();
    this._siteService.listPlugins()
                     .subscribe(
                       data => { this.plugins = data; },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.drawerVisible = false;
    this.removeVisible = false;
    this.plugin = {};
  }

  /**
   * Sets the list item to active
   *
   * @param {Plugin} plugin
   */
  setActive(plugin) {
    this.selectedPlugin = plugin;
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the remove dialog
   *
   * @param {Plugin} plugin
   */
  showRemove(plugin) {
    this.removeVisible = true;
    this.plugin = plugin;
  }

  /**
   * handles error
   */
  failure(obj) {

    toast.show('failure');

    if(obj.status == 401) {
      this._router.navigate( ['/login', this.id] );
    }

  }

}