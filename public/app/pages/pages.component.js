System.register(['@angular/core', 'angular2-jwt/angular2-jwt', '@angular/router-deprecated', '/app/shared/services/page.service', '/app/shared/components/pages/add-page/add-page.component', '/app/shared/components/pages/page-settings/page-settings.component', '/app/shared/components/pages/remove-page/remove-page.component', '/app/shared/components/drawer/drawer.component', '/app/shared/pipes/time-ago.pipe', 'ng2-translate/ng2-translate'], function(exports_1, context_1) {
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
    var core_1, angular2_jwt_1, router_deprecated_1, page_service_1, add_page_component_1, page_settings_component_1, remove_page_component_1, drawer_component_1, time_ago_pipe_1, ng2_translate_1;
    var PagesComponent;
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
            function (page_service_1_1) {
                page_service_1 = page_service_1_1;
            },
            function (add_page_component_1_1) {
                add_page_component_1 = add_page_component_1_1;
            },
            function (page_settings_component_1_1) {
                page_settings_component_1 = page_settings_component_1_1;
            },
            function (remove_page_component_1_1) {
                remove_page_component_1 = remove_page_component_1_1;
            },
            function (drawer_component_1_1) {
                drawer_component_1 = drawer_component_1_1;
            },
            function (time_ago_pipe_1_1) {
                time_ago_pipe_1 = time_ago_pipe_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            }],
        execute: function() {
            PagesComponent = (function () {
                function PagesComponent(_pageService, _router) {
                    this._pageService = _pageService;
                    this._router = _router;
                }
                /**
                 * Init pages
                 *
                 */
                PagesComponent.prototype.ngOnInit = function () {
                    this.id = localStorage.getItem('respond.siteId');
                    this.addVisible = false;
                    this.removeVisible = false;
                    this.settingsVisible = false;
                    this.drawerVisible = false;
                    this.page = {};
                    this.pages = [];
                    this.list();
                };
                /**
                 * Updates the list
                 */
                PagesComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._pageService.list()
                        .subscribe(function (data) { _this.pages = data; }, function (error) { _this.failure(error); });
                };
                /**
                 * Resets an modal booleans
                 */
                PagesComponent.prototype.reset = function () {
                    this.removeVisible = false;
                    this.addVisible = false;
                    this.settingsVisible = false;
                    this.drawerVisible = false;
                    this.page = {};
                };
                /**
                 * Sets the list item to active
                 *
                 * @param {Page} page
                 */
                PagesComponent.prototype.setActive = function (page) {
                    this.selectedPage = page;
                };
                /**
                 * Shows the drawer
                 */
                PagesComponent.prototype.toggleDrawer = function () {
                    this.drawerVisible = !this.drawerVisible;
                };
                /**
                 * Shows the add dialog
                 */
                PagesComponent.prototype.showAdd = function () {
                    this.addVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {Page} page
                 */
                PagesComponent.prototype.showRemove = function (page) {
                    this.removeVisible = true;
                    this.page = page;
                };
                /**
                 * Shows the settings dialog
                 *
                 * @param {Page} page
                 */
                PagesComponent.prototype.showSettings = function (page) {
                    this.settingsVisible = true;
                    this.page = page;
                };
                /**
                 * Shows the settings dialog
                 *
                 * @param {Page} page
                 */
                PagesComponent.prototype.edit = function (page) {
                    // window.location = '/edit?q=' + this.id + '/' + page.url;
                    localStorage.setItem('respond.pageUrl', page.url);
                    this._router.navigate(['Edit']);
                };
                /**
                 * handles error
                 */
                PagesComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                    if (obj.status == 401) {
                        this._router.navigate(['Login', { id: this.id }]);
                    }
                };
                PagesComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-pages',
                        templateUrl: './app/pages/pages.component.html',
                        providers: [page_service_1.PageService],
                        directives: [add_page_component_1.AddPageComponent, page_settings_component_1.PageSettingsComponent, remove_page_component_1.RemovePageComponent, drawer_component_1.DrawerComponent],
                        pipes: [time_ago_pipe_1.TimeAgoPipe, ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof page_service_1.PageService !== 'undefined' && page_service_1.PageService) === 'function' && _a) || Object, router_deprecated_1.Router])
                ], PagesComponent);
                return PagesComponent;
                var _a;
            }());
            exports_1("PagesComponent", PagesComponent);
        }
    }
});
//# sourceMappingURL=pages.component.js.map