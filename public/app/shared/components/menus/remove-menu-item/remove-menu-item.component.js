System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/menu-item.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, menu_item_service_1;
    var RemoveMenuItemComponent;
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
            }],
        execute: function() {
            RemoveMenuItemComponent = (function () {
                function RemoveMenuItemComponent(_menuItemService) {
                    this._menuItemService = _menuItemService;
                    this._visible = false;
                    // outputs
                    this.onCancel = new core_1.EventEmitter();
                    this.onUpdate = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(RemoveMenuItemComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    // visible input
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RemoveMenuItemComponent.prototype, "item", {
                    // menu input
                    set: function (item) {
                        // set visible
                        this.model = item;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init
                 */
                RemoveMenuItemComponent.prototype.ngOnInit = function () {
                    this.model = {
                        html: '',
                        url: ''
                    };
                };
                /**
                 * Hides the modal
                 */
                RemoveMenuItemComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the form
                 */
                RemoveMenuItemComponent.prototype.submit = function () {
                    var _this = this;
                    this._menuItemService.remove(this.menu.id, this.index)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful submission
                 */
                RemoveMenuItemComponent.prototype.success = function () {
                    this._visible = false;
                    this.onUpdate.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], RemoveMenuItemComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], RemoveMenuItemComponent.prototype, "item", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RemoveMenuItemComponent.prototype, "menu", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RemoveMenuItemComponent.prototype, "index", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveMenuItemComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveMenuItemComponent.prototype, "onUpdate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveMenuItemComponent.prototype, "onError", void 0);
                RemoveMenuItemComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-remove-menu-item',
                        templateUrl: './app/shared/components/menus/remove-menu-item/remove-menu-item.component.html',
                        providers: [menu_item_service_1.MenuItemService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof menu_item_service_1.MenuItemService !== 'undefined' && menu_item_service_1.MenuItemService) === 'function' && _a) || Object])
                ], RemoveMenuItemComponent);
                return RemoveMenuItemComponent;
                var _a;
            }());
            exports_1("RemoveMenuItemComponent", RemoveMenuItemComponent);
        }
    }
});
//# sourceMappingURL=remove-menu-item.component.js.map