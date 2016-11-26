import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from '../shared/services/component.service';

declare var toast: any;
declare var __moduleName: string;

@Component({
    selector: 'respond-components',
    templateUrl: 'components.component.html',
    providers: [ComponentService]
})

export class ComponentsComponent {

  id: string;
  component: any;
  components: any;
  errorMessage: string;
  selectedComponent: any;
  addVisible: boolean = false;
  removeVisible: boolean = false;
  drawerVisible: boolean = false;

  constructor (private _componentService: ComponentService, private _router: Router) {}

  /**
   * Init
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.addVisible = false;
    this.removeVisible = false;
    this.drawerVisible = false;
    this.component = {};
    this.components = [];

    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();
    this._componentService.list()
                     .subscribe(
                       data => { this.components = data; },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Resets modal booleans
   */
  reset() {
    this.removeVisible = false;
    this.addVisible = false;
    this.drawerVisible = false;
    this.component = {};
  }

  /**
   * Sets the list item to active
   *
   * @param {Any} component
   */
  setActive(component) {
    this.selectedComponent = component;
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
   * @param {Any} component
   */
  showRemove(component) {
    this.removeVisible = true;
    this.component = component;
  }

  /**
   * Edits a component
   *
   * @param {Any} component
   */
  edit(component) {
    localStorage.setItem('respond.pageUrl', 'components/' + component.url);
    localStorage.setItem('respond.editMode', 'component');

    var id = Math.random().toString(36).substr(2, 9);

    this._router.navigate( ['/edit',  id] );
  }

  /**
   * Edits code for a component
   *
   * @param {Any} component
   */
  editCode(component) {
    localStorage.setItem('respond.codeUrl', 'components/' + component.url);
    localStorage.setItem('respond.codeType', 'component');

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