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
    var ForgotComponent;
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
            ForgotComponent = (function () {
                function ForgotComponent(_userService, _routeParams) {
                    this._userService = _userService;
                    this._routeParams = _routeParams;
                }
                ForgotComponent.prototype.ngOnInit = function () {
                    this.id = this._routeParams.get('id');
                };
                ForgotComponent.prototype.forgot = function (event, email, password) {
                    var _this = this;
                    event.preventDefault();
                    this._userService.forgot(this.id, email)
                        .subscribe(function () { toast.show('success'); }, function (error) { _this.failure(error); });
                };
                /**
                 * handles errors
                 */
                ForgotComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                };
                ForgotComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-forgot',
                        templateUrl: './app/forgot/forgot.component.html',
                        providers: [user_service_1.UserService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _a) || Object, router_deprecated_1.RouteParams])
                ], ForgotComponent);
                return ForgotComponent;
                var _a;
            }());
            exports_1("ForgotComponent", ForgotComponent);
        }
    }
});
//# sourceMappingURL=forgot.component.js.map