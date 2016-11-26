import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from '../shared/services/page.service';

declare var toast: any;
declare var __moduleName: string;

@Component({
    selector: 'respond-pages',
    templateUrl: 'pages.component.html',
    providers: [PageService]
})

export class PagesComponent {

  id;
  page;
  pages;
  errorMessage;
  selectedPage;
  addVisible: boolean = false;
  removeVisible: boolean = false;
  drawerVisible: boolean = false;
  settingsVisible: boolean = false;

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
   * Edits a page
   *
   * @param {Page} page
   */
  edit(page) {
    localStorage.setItem('respond.pageUrl', page.url);
    localStorage.setItem('respond.editMode', 'page');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/edit',  id] );
  }

  /**
   * Edits code for a page
   *
   * @param {Page} page
   */
  editCode(page) {
    localStorage.setItem('respond.codeUrl', page.url);
    localStorage.setItem('respond.codeType', 'page');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/code',  id] );
  }

  /**
   * handles error
   */
  failure (obj) {
    console.log(obj);

    toast.show('failure');

    if(obj.status == 401) {
      this._router.navigate( ['/login', this.id] );
    }

  }


}