System.register(['@angular/core', 'angular2-jwt/angular2-jwt', '@angular/router-deprecated', 'ng2-translate/ng2-translate', '/app/shared/services/menu.service', '/app/shared/services/menu-item.service', '/app/shared/components/menus/add-menu/add-menu.component', '/app/shared/components/menus/edit-menu/edit-menu.component', '/app/shared/components/menus/remove-menu/remove-menu.component', '/app/shared/components/menus/add-menu-item/add-menu-item.component', '/app/shared/components/menus/edit-menu-item/edit-menu-item.component', '/app/shared/components/menus/remove-menu-item/remove-menu-item.component', '/app/shared/components/drawer/drawer.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, angular2_jwt_1, router_deprecated_1, ng2_translate_1, menu_service_1, menu_item_service_1, add_menu_component_1, edit_menu_component_1, remove_menu_component_1, add_menu_item_component_1, edit_menu_item_component_1, remove_menu_item_component_1, drawer_component_1;
    var MenusComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (angular2_jwt_1_1) {
                angular2_jwt_1 = angular2_jwt_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            },
            function (menu_service_1_1) {
                menu_service_1 = menu_service_1_1;
            },
            function (menu_item_service_1_1) {
                menu_item_service_1 = menu_item_service_1_1;
            },
            function (add_menu_component_1_1) {
                add_menu_component_1 = add_menu_component_1_1;
            },
            function (edit_menu_component_1_1) {
                edit_menu_component_1 = edit_menu_component_1_1;
            },
            function (remove_menu_component_1_1) {
                remove_menu_component_1 = remove_menu_component_1_1;
            },
            function (add_menu_item_component_1_1) {
                add_menu_item_component_1 = add_menu_item_component_1_1;
            },
            function (edit_menu_item_component_1_1) {
                edit_menu_item_component_1 = edit_menu_item_component_1_1;
            },
            function (remove_menu_item_component_1_1) {
                remove_menu_item_component_1 = remove_menu_item_component_1_1;
            },
            function (drawer_component_1_1) {
                drawer_component_1 = drawer_component_1_1;
            }],
        execute: function() {
            MenusComponent = (function () {
                function MenusComponent(_menuService, _menuItemService, _router) {
                    this._menuService = _menuService;
                    this._menuItemService = _menuItemService;
                    this._router = _router;
                }
                /**
                 * Init
                 *
                 */
                MenusComponent.prototype.ngOnInit = function () {
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
                };
                /**
                 * Updates the list
                 */
                MenusComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._menuService.list()
                        .subscribe(function (data) { _this.menus = data; _this.success(); }, function (error) { _this.failure(error); });
                };
                /**
                 * handles the list successfully updated
                 */
                MenusComponent.prototype.success = function () {
                    var x, flag = false;
                    // check if selected menu is set
                    if (this.menus.length > 0 && this.menus != undefined) {
                        if (this.selectedMenu !== undefined && this.selectedMenu !== null) {
                            for (x = 0; x < this.menus.length; x++) {
                                if (this.menus[x].id === this.selectedMenu.id) {
                                    flag = true;
                                }
                            }
                        }
                        // check if id is in array
                        if (flag === false) {
                            this.selectedMenu = this.menus[0];
                        }
                    }
                    // update items
                    if (this.selectedMenu !== null) {
                        this.listItems();
                    }
                };
                /**
                 * list items in the menu
                 */
                MenusComponent.prototype.listItems = function () {
                    var _this = this;
                    this._menuItemService.list(this.selectedMenu.id)
                        .subscribe(function (data) { _this.items = data; }, function (error) { _this.failure(error); });
                };
                /**
                 * Resets screen
                 */
                MenusComponent.prototype.reset = function () {
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.addItemVisible = false;
                    this.editItemVisible = false;
                    this.removeItemVisible = false;
                    this.drawerVisible = false;
                    this.overflowVisible = false;
                };
                /**
                 * Sets the menu to active
                 *
                 * @param {Menu} menu
                 */
                MenusComponent.prototype.setActive = function (menu) {
                    this.selectedMenu = menu;
                    this.listItems();
                };
                /**
                 * Sets the list item to active
                 *
                 * @param {MenuItem} item
                 */
                MenusComponent.prototype.setItemActive = function (item) {
                    this.selectedItem = item;
                    this.selectedIndex = this.items.indexOf(item);
                };
                /**
                 * Shows the drawer
                 */
                MenusComponent.prototype.toggleDrawer = function () {
                    this.drawerVisible = !this.drawerVisible;
                };
                /**
                 * Shows the overflow menu
                 */
                MenusComponent.prototype.toggleOverflow = function () {
                    this.overflowVisible = !this.overflowVisible;
                };
                /**
                 * Shows the add dialog
                 */
                MenusComponent.prototype.showAdd = function () {
                    this.addVisible = true;
                };
                /**
                 * Shows the edit dialog
                 */
                MenusComponent.prototype.showEdit = function () {
                    this.editVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {menu} menu
                 */
                MenusComponent.prototype.showRemove = function (menu) {
                    this.removeVisible = true;
                    this.menu = menu;
                };
                /**
                 * Shows the add dialog
                 */
                MenusComponent.prototype.showAddItem = function () {
                    this.addItemVisible = true;
                };
                /**
                 * Shows the edit dialog
                 */
                MenusComponent.prototype.showEditItem = function () {
                    this.editItemVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {menu} menu
                 */
                MenusComponent.prototype.showRemoveItem = function (menu) {
                    this.removeItemVisible = true;
                };
                /**
                 * Move the item up
                 *
                 * @param {item} menu
                 */
                MenusComponent.prototype.moveItemUp = function (item) {
                    var i = this.items.indexOf(item);
                    if (i != 0) {
                        this.items.splice(i, 1);
                        this.items.splice(i - 1, 0, item);
                    }
                    this.updateOrder();
                };
                /**
                 * Move the item down
                 *
                 * @param {item} menu
                 */
                MenusComponent.prototype.moveItemDown = function (item) {
                    var i = this.items.indexOf(item);
                    if (i != (this.items.length - 1)) {
                        this.items.splice(i, 1);
                        this.items.splice(i + 1, 0, item);
                    }
                    this.updateOrder();
                };
                /**
                 * Updates the order of the menu items
                 *
                 */
                MenusComponent.prototype.updateOrder = function () {
                    var _this = this;
                    this._menuItemService.updateOrder(this.selectedMenu.id, this.items)
                        .subscribe(function (data) { }, function (error) { _this.failure(error); });
                };
                /**
                 * handles error
                 */
                MenusComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                    if (obj.status == 401) {
                        this._router.navigate(['Login', { id: this.id }]);
                    }
                };
                MenusComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-menus',
                        templateUrl: './app/menus/menus.component.html',
                        providers: [menu_service_1.MenuService, menu_item_service_1.MenuItemService],
                        directives: [add_menu_component_1.AddMenuComponent, edit_menu_component_1.EditMenuComponent, remove_menu_component_1.RemoveMenuComponent, add_menu_item_component_1.AddMenuItemComponent, edit_menu_item_component_1.EditMenuItemComponent, remove_menu_item_component_1.RemoveMenuItemComponent, drawer_component_1.DrawerComponent],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, (typeof (_b = typeof menu_item_service_1.MenuItemService !== 'undefined' && menu_item_service_1.MenuItemService) === 'function' && _b) || Object, router_deprecated_1.Router])
                ], MenusComponent);
                return MenusComponent;
                var _a, _b;
            }());
            exports_1("MenusComponent", MenusComponent);
        }
    }
});
//# sourceMappingURL=menus.component.js.map