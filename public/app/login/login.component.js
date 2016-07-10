System.register(['@angular/core', '@angular/router-deprecated', '/app/shared/services/user.service', 'ng2-translate/ng2-translate'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, user_service_1, ng2_translate_1;
    var LoginComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent(_userService, _routeParams, _router, _translate) {
                    this._userService = _userService;
                    this._routeParams = _routeParams;
                    this._router = _router;
                    this._translate = _translate;
                }
                LoginComponent.prototype.ngOnInit = function () {
                    this.id = this._routeParams.get('id');
                    localStorage.setItem('respond.siteId', this.id);
                };
                /**
                 * Login to the app
                 *
                 * @param {Event} event
                 * @param {string} email The user's login email
                 * @param {string} password The user's login password
                 */
                LoginComponent.prototype.login = function (event, email, password) {
                    var _this = this;
                    event.preventDefault();
                    this._userService.login(this.id, email, password)
                        .subscribe(function (data) { _this.data = data; _this.success(); }, function (error) { _this.failure(error); });
                };
                /**
                 * Handles a successful login
                 */
                LoginComponent.prototype.success = function () {
                    toast.show('success');
                    // set language
                    this.setLanguage(this.data.user.language);
                    // set token
                    this.setToken(this.data.token);
                    // navigate
                    this._router.navigate(['Pages']);
                };
                /**
                 * Routes to the forgot password screen
                 */
                LoginComponent.prototype.forgot = function () {
                    this._router.navigate(['Forgot', { id: this.id }]);
                };
                /**
                 * Sets the language for the app
                 */
                LoginComponent.prototype.setLanguage = function (language) {
                    localStorage.setItem('user_language', language);
                    // set language
                    this._translate.use(language);
                };
                /**
                 * Sets the token in local storage
                 */
                LoginComponent.prototype.setToken = function (token) {
                    localStorage.setItem('id_token', token);
                };
                /**
                 * handles error
                 */
                LoginComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                };
                LoginComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-login',
                        templateUrl: './app/login/login.component.html',
                        providers: [user_service_1.UserService],
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _a) || Object, router_deprecated_1.RouteParams, router_deprecated_1.Router, ng2_translate_1.TranslateService])
                ], LoginComponent);
                return LoginComponent;
                var _a;
            }());
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map