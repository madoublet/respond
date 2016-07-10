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
    var UserService;
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
            UserService = (function () {
                function UserService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._listUrl = 'api/users/list';
                    this._loginUrl = 'api/users/login';
                    this._forgotUrl = 'api/users/forgot';
                    this._resetUrl = 'api/users/reset';
                    this._addUrl = 'api/users/add';
                    this._editUrl = 'api/users/edit';
                    this._removeUrl = 'api/users/remove';
                }
                /**
                 * Lists users
                 *
                 */
                UserService.prototype.list = function () {
                    return this.authHttp.get(this._listUrl).map(function (res) { return res.json(); });
                };
                /**
                 * Login to the application
                 *
                 * @param {string} id The site id
                 * @param {string} email The user's login email
                 * @param {string} password The user's login password
                 * @return {Observable}
                 */
                UserService.prototype.login = function (id, email, password) {
                    var body = JSON.stringify({ id: id, email: email, password: password });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.post(this._loginUrl, body, options)
                        .map(function (res) { return res.json(); });
                };
                /**
                 * Requests the user's password to be reset
                 *
                 * @param {string} id The site id
                 * @param {string} email The user's login email
                 * @return {Observable}
                 */
                UserService.prototype.forgot = function (id, email) {
                    var body = JSON.stringify({ id: id, email: email });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.post(this._forgotUrl, body, options);
                };
                /**
                 * Resets the password
                 *
                 * @param {string} id The site id
                 * @param {string} token The token needed to reset the password
                 * @param {string} password The new password
                 * @return {Observable}
                 */
                UserService.prototype.reset = function (id, token, password) {
                    var body = JSON.stringify({ id: id, token: token, password: password });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.post(this._resetUrl, body, options);
                };
                /**
                 * Adds the user
                 *
                 * @param {string} email
                 * @param {string} firstName
                 * @param {string} lastName
                 * @param {string} password
                 * @param {string} language
                 * @return {Observable}
                 */
                UserService.prototype.add = function (email, firstName, lastName, password, language) {
                    var body = JSON.stringify({ email: email, firstName: firstName, lastName: lastName, password: password, language: language });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._addUrl, body, options);
                };
                /**
                 * Edits the user
                 *
                 * @param {string} email
                 * @param {string} firstName
                 * @param {string} lastName
                 * @param {string} password
                 * @param {string} language
                 * @return {Observable}
                 */
                UserService.prototype.edit = function (email, firstName, lastName, password, language) {
                    var body = JSON.stringify({ email: email, firstName: firstName, lastName: lastName, password: password, language: language });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._editUrl, body, options);
                };
                /**
                 * Removes the user
                 *
                 * @param {string} email
                 * @return {Observable}
                 */
                UserService.prototype.remove = function (email) {
                    var body = JSON.stringify({ email: email });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._removeUrl, body, options);
                };
                UserService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], UserService);
                return UserService;
            }());
            exports_1("UserService", UserService);
        }
    }
});
//# sourceMappingURL=user.service.js.map