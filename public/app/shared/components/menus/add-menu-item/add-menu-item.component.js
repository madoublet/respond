System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/menu-item.service', '/app/shared/services/page.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, menu_item_service_1, page_service_1;
    var AddMenuItemComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            },
            function (angular2_jwt_1_1) {
                angular2_jwt_1 = angular2_jwt_1_1;
            },
            function (menu_item_service_1_1) {
                menu_item_service_1 = menu_item_service_1_1;
            },
            function (page_service_1_1) {
                page_service_1 = page_service_1_1;
            }],
        execute: function() {
            AddMenuItemComponent = (function () {
                function AddMenuItemComponent(_menuItemService, _pageService) {
                    this._menuItemService = _menuItemService;
                    this._pageService = _pageService;
                    // model to store
                    this.model = {
                        html: '',
                        cssClass: '',
                        isNested: false,
                        url: ''
                    };
                    // visible input
                    this._visible = false;
                    // outputs
                    this.onCancel = new core_1.EventEmitter();
                    this.onAdd = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(AddMenuItemComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                        // reset model
                        this.model = {
                            html: '',
                            cssClass: '',
                            isNested: false,
                            url: ''
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init
                 */
                AddMenuItemComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    // list pages
                    this._pageService.list()
                        .subscribe(function (data) { _this.pages = data; }, function (error) { return _this.errorMessage = error; });
                };
                /**
                 * Hides the add modal
                 */
                AddMenuItemComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the form
                 */
                AddMenuItemComponent.prototype.submit = function () {
                    var _this = this;
                    this._menuItemService.add(this.menu.id, this.model.html, this.model.cssClass, this.model.isNested, this.model.url)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful add
                 */
                AddMenuItemComponent.prototype.success = function () {
                    toast.show('success');
                    this._visible = false;
                    this.onAdd.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], AddMenuItemComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], AddMenuItemComponent.prototype, "menu", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AddMenuItemComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AddMenuItemComponent.prototype, "onAdd", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AddMenuItemComponent.prototype, "onError", void 0);
                AddMenuItemComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-add-menu-item',
                        templateUrl: './app/shared/components/menus/add-menu-item/add-menu-item.component.html',
                        providers: [menu_item_service_1.MenuItemService, page_service_1.PageService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof menu_item_service_1.MenuItemService !== 'undefined' && menu_item_service_1.MenuItemService) === 'function' && _a) || Object, (typeof (_b = typeof page_service_1.PageService !== 'undefined' && page_service_1.PageService) === 'function' && _b) || Object])
                ], AddMenuItemComponent);
                return AddMenuItemComponent;
                var _a, _b;
            }());
            exports_1("AddMenuItemComponent", AddMenuItemComponent);
        }
    }
});
//# sourceMappingURL=add-menu-item.component.js.map