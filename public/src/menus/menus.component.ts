import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../shared/services/menu.service';
import { MenuItemService } from '../shared/services/menu-item.service';

declare var toast: any;

@Component({
    selector: 'respond-menus',
    templateUrl: 'menus.component.html',
    providers: [MenuService, MenuItemService],
})

export class MenusComponent {

  id;
  menu;
  menus;
  items;
  errorMessage;
  selectedMenu;
  selectedItem;
  selectedIndex;
  addVisible: boolean;
  editVisible: boolean;
  removeVisible: boolean;
  addItemVisible: boolean;
  editItemVisible: boolean;
  removeItemVisible: boolean;
  drawerVisible: boolean;
  overflowVisible: boolean;

  constructor (private _menuService: MenuService, private _menuItemService: MenuItemService, private _router: Router) {}

  /**
   * Init
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.addVisible = false;
    this.editVisible = false;
    this.removeVisible = false;
    this.addItemVisible = false;
    this.editItemVisible = false;
    this.removeItemVisible = false;
    this.drawerVisible = false;
    this.overflowVisible = false;
    this.menus = [];
    this.items = [];

    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();

    this._menuService.list()
                     .subscribe(
                       data => { this.menus = data; this.success(); },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * handles the list successfully updated
   */
  success () {

    var x, flag = false;

    // check if selected menu is set
    if(this.menus.length > 0 && this.menus != undefined) {

      if(this.selectedMenu !== undefined && this.selectedMenu !== null) {
        for(x=0; x<this.menus.length; x++) {
          if(this.menus[x].id === this.selectedMenu.id) {
            flag = true;
          }
        }
      }

      // check if id is in array
      if(flag === false) {
        this.selectedMenu = this.menus[0];
      }

    }

    // update items
    if(this.selectedMenu !== null) {
      this.listItems();
    }

  }

  /**
   * list items in the menu
   */
  listItems() {

    this._menuItemService.list(this.selectedMenu.id)
                     .subscribe(
                       data => { this.items = data; },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Resets screen
   */
  reset() {
    this.addVisible = false;
    this.editVisible = false;
    this.removeVisible = false;
    this.addItemVisible = false;
    this.editItemVisible = false;
    this.removeItemVisible = false;
    this.drawerVisible = false;
    this.overflowVisible = false;
  }

  /**
   * Sets the menu to active
   *
   * @param {Menu} menu
   */
  setActive(menu) {
    this.selectedMenu = menu;

    this.listItems();
  }

  /**
   * Sets the list item to active
   *
   * @param {MenuItem} item
   */
  setItemActive(item) {
    this.selectedItem = item;
    this.selectedIndex = this.items.indexOf(item);
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the overflow menu
   */
  toggleOverflow() {
    this.overflowVisible = !this.overflowVisible;
  }

  /**
   * Shows the add dialog
   */
  showAdd() {
    this.addVisible = true;
  }

  /**
   * Shows the edit dialog
   */
  showEdit() {
    this.editVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {menu} menu
   */
  showRemove(menu) {
    this.removeVisible = true;
    this.menu = menu;
  }

  /**
   * Shows the add dialog
   */
  showAddItem() {
    this.addItemVisible = true;
  }

  /**
   * Shows the edit dialog
   */
  showEditItem() {
    this.editItemVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {menu} menu
   */
  showRemoveItem(menu) {
    this.removeItemVisible = true;
  }

  /**
   * Move the item up
   *
   * @param {item} menu
   */
  moveItemUp(item) {

    var i = this.items.indexOf(item);

    if(i != 0) {
      this.items.splice(i, 1);
      this.items.splice(i-1, 0, item);
    }

    this.updateOrder();

  }

  /**
   * Move the item down
   *
   * @param {item} menu
   */
  moveItemDown(item) {

    var i = this.items.indexOf(item);

    if(i != (this.items.length-1)) {
      this.items.splice(i, 1);
      this.items.splice(i+1, 0, item);
    }

    this.updateOrder();

  }

  /**
   * Updates the order of the menu items
   *
   */
  updateOrder() {

    this._menuItemService.updateOrder(this.selectedMenu.id, this.items)
                     .subscribe(
                       data => { },
                       error =>  { this.failure(<any>error); }
                      );
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