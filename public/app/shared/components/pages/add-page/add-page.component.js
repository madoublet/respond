System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/page.service', '/app/shared/services/route.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, page_service_1, route_service_1;
    var AddPageComponent;
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
            function (page_service_1_1) {
                page_service_1 = page_service_1_1;
            },
            function (route_service_1_1) {
                route_service_1 = route_service_1_1;
            }],
        execute: function() {
            AddPageComponent = (function () {
                function AddPageComponent(_pageService, _routeService) {
                    this._pageService = _pageService;
                    this._routeService = _routeService;
                    this._visible = false;
                    this.onCancel = new core_1.EventEmitter();
                    this.onAdd = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(AddPageComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                        // reset model
                        this.model = {
                            path: '/',
                            url: '',
                            title: '',
                            description: ''
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init pages
                 */
                AddPageComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._routeService.list()
                        .subscribe(function (data) { _this.routes = data; }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Hides the add page modal
                 */
                AddPageComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the form
                 */
                AddPageComponent.prototype.submit = function () {
                    var _this = this;
                    // set full path
                    var fullUrl = this.model.path + '/' + this.model.url;
                    if (this.model.path == '/') {
                        fullUrl = '/' + this.model.url;
                    }
                    this._pageService.add(fullUrl, this.model.title, this.model.description)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful add
                 */
                AddPageComponent.prototype.success = function () {
                    toast.show('success');
                    this._visible = false;
                    this.onAdd.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], AddPageComponent.prototype, "visible", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AddPageComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AddPageComponent.prototype, "onAdd", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AddPageComponent.prototype, "onError", void 0);
                AddPageComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-add-page',
                        templateUrl: './app/shared/components/pages/add-page/add-page.component.html',
                        providers: [page_service_1.PageService, route_service_1.RouteService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof page_service_1.PageService !== 'undefined' && page_service_1.PageService) === 'function' && _a) || Object, (typeof (_b = typeof route_service_1.RouteService !== 'undefined' && route_service_1.RouteService) === 'function' && _b) || Object])
                ], AddPageComponent);
                return AddPageComponent;
                var _a, _b;
            }());
            exports_1("AddPageComponent", AddPageComponent);
        }
    }
});
//# sourceMappingURL=add-page.component.js.map