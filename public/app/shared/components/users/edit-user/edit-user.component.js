System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/user.service', '/app/shared/services/app.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, user_service_1, app_service_1;
    var EditUserComponent;
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
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            }],
        execute: function() {
            EditUserComponent = (function () {
                function EditUserComponent(_userService, _appService) {
                    this._userService = _userService;
                    this._appService = _appService;
                    this._visible = false;
                    this.onCancel = new core_1.EventEmitter();
                    this.onUpdate = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(EditUserComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                        // reset model
                        this.model = {
                            email: '',
                            firstName: '',
                            lastName: '',
                            password: '',
                            retype: '',
                            language: 'en'
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EditUserComponent.prototype, "user", {
                    set: function (user) {
                        // set visible
                        this.model = user;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Inits component
                 */
                EditUserComponent.prototype.ngOnInit = function () {
                    this.languages = [];
                    this.list();
                };
                /**
                 * Lists available languages
                 */
                EditUserComponent.prototype.list = function () {
                    var _this = this;
                    this._appService.listLanguages()
                        .subscribe(function (data) { _this.languages = data; }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Hides the modal
                 */
                EditUserComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the form
                 */
                EditUserComponent.prototype.submit = function () {
                    var _this = this;
                    if (this.model.password != this.model.retype) {
                        console.log('[respond.error] password mismatch');
                        toast.show('failure', 'The password does not match the retype field');
                        return;
                    }
                    // add user
                    this._userService.edit(this.model.email, this.model.firstName, this.model.lastName, this.model.password, this.model.language)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful edit
                 */
                EditUserComponent.prototype.success = function () {
                    toast.show('success');
                    this._visible = false;
                    this.onUpdate.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], EditUserComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], EditUserComponent.prototype, "user", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditUserComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditUserComponent.prototype, "onUpdate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditUserComponent.prototype, "onError", void 0);
                EditUserComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-edit-user',
                        templateUrl: './app/shared/components/users/edit-user/edit-user.component.html',
                        providers: [user_service_1.UserService, app_service_1.AppService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _a) || Object, (typeof (_b = typeof app_service_1.AppService !== 'undefined' && app_service_1.AppService) === 'function' && _b) || Object])
                ], EditUserComponent);
                return EditUserComponent;
                var _a, _b;
            }());
            exports_1("EditUserComponent", EditUserComponent);
        }
    }
});
//# sourceMappingURL=edit-user.component.js.map