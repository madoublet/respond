System.register(['@angular/core', '@angular/http', 'angular2-jwt/angular2-jwt'], function(exports_1, context_1) {
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
    var core_1, http_1, angular2_jwt_1, http_2;
    var SiteService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
                http_2 = http_1_1;
            },
            function (angular2_jwt_1_1) {
                angular2_jwt_1 = angular2_jwt_1_1;
            }],
        execute: function() {
            SiteService = (function () {
                function SiteService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._createUrl = 'api/sites/create';
                    this._reloadUrl = 'api/sites/reload';
                }
                /**
                 * Login to the application
                 *
                 * @param {string} id The site id
                 * @param {string} email The user's login email
                 * @param {string} password The user's login password
                 * @return {Observable}
                 */
                SiteService.prototype.create = function (name, theme, email, password, passcode) {
                    var body = JSON.stringify({ name: name, theme: theme, email: email, password: password, passcode: passcode });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.post(this._createUrl, body, options)
                        .map(function (res) { return res.json(); });
                };
                /**
                 * Reloads the system files
                 *
                 * @return {Observable}
                 */
                SiteService.prototype.reload = function () {
                    return this.authHttp.get(this._reloadUrl);
                };
                SiteService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], SiteService);
                return SiteService;
            }());
            exports_1("SiteService", SiteService);
        }
    }
});
//# sourceMappingURL=site.service.js.map