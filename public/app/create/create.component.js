System.register(['@angular/core', '@angular/router-deprecated', '/app/shared/services/site.service', '/app/shared/services/app.service', 'ng2-translate/ng2-translate'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, site_service_1, app_service_1, ng2_translate_1;
    var CreateComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (site_service_1_1) {
                site_service_1 = site_service_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            }],
        execute: function() {
            CreateComponent = (function () {
                function CreateComponent(_siteService, _appService, _router) {
                    this._siteService = _siteService;
                    this._appService = _appService;
                    this._router = _router;
                }
                /**
                 * Init pages
                 */
                CreateComponent.prototype.ngOnInit = function () {
                    // init
                    this.themes = [];
                    this.visible = false;
                    this.selectedTheme = null;
                    this.selectedThemeIndex = 0;
                    this.hasPasscode = true;
                    // set model
                    this.model = {
                        name: '',
                        theme: '',
                        email: '',
                        password: '',
                        passcode: ''
                    };
                    // list themes
                    this.list();
                    // retrieve settings
                    this.settings();
                };
                /**
                 * Create the site
                 *
                 */
                CreateComponent.prototype.submit = function () {
                    var _this = this;
                    this._siteService.create(this.model.name, this.selectedTheme.location, this.model.email, this.model.password, this.model.passcode)
                        .subscribe(function (data) { _this.site = data; _this.success(); }, function (error) { _this.failure(error); });
                };
                /**
                 * Get settings
                 */
                CreateComponent.prototype.settings = function () {
                    var _this = this;
                    // list themes in the app
                    this._appService.retrieveSettings()
                        .subscribe(function (data) {
                        _this.hasPasscode = data.hasPasscode;
                    }, function (error) { _this.failure(error); });
                };
                /**
                 * Updates the list
                 */
                CreateComponent.prototype.list = function () {
                    var _this = this;
                    // list themes in the app
                    this._appService.listThemes()
                        .subscribe(function (data) {
                        _this.themes = data;
                        _this.selectedTheme = _this.themes[0];
                        _this.selectedThemeIndex = 0;
                        _this.visible = false;
                    }, function (error) { _this.failure(error); });
                };
                /**
                 * Cycles through themes
                 */
                CreateComponent.prototype.next = function () {
                    // increment or cycle
                    if ((this.selectedThemeIndex + 1) < this.themes.length) {
                        this.selectedThemeIndex = this.selectedThemeIndex + 1;
                    }
                    else {
                        this.selectedThemeIndex = 0;
                    }
                    // set new theme
                    this.selectedTheme = this.themes[this.selectedThemeIndex];
                };
                /**
                 * Selects a theme
                 */
                CreateComponent.prototype.select = function (index) {
                    this.selectedThemeIndex = index;
                    this.selectedTheme = this.themes[this.selectedThemeIndex];
                    window.scrollTo(0, 0);
                };
                /**
                 * Uses the selected theme
                 */
                CreateComponent.prototype.useTheme = function () {
                    // set new theme
                    this.visible = true;
                };
                /**
                 * Hides the create modal
                 */
                CreateComponent.prototype.hide = function () {
                    // set new theme
                    this.visible = false;
                };
                /**
                 * Handles a successful create
                 *
                 */
                CreateComponent.prototype.success = function () {
                    toast.show('success');
                    this._router.navigate(['Login', { id: this.site.id }]);
                    // clear model
                    this.model = {
                        name: '',
                        theme: '',
                        email: '',
                        password: '',
                        passcode: ''
                    };
                };
                /**
                 * handles errors
                 */
                CreateComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                };
                CreateComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-create',
                        templateUrl: './app/create/create.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: [site_service_1.SiteService, app_service_1.AppService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof site_service_1.SiteService !== 'undefined' && site_service_1.SiteService) === 'function' && _a) || Object, (typeof (_b = typeof app_service_1.AppService !== 'undefined' && app_service_1.AppService) === 'function' && _b) || Object, router_deprecated_1.Router])
                ], CreateComponent);
                return CreateComponent;
                var _a, _b;
            }());
            exports_1("CreateComponent", CreateComponent);
        }
    }
});
//# sourceMappingURL=create.component.js.map