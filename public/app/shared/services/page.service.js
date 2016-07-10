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
    var PageService;
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
            PageService = (function () {
                function PageService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._listUrl = 'api/pages/list';
                    this._addUrl = 'api/pages/add';
                    this._updateSettingsUrl = 'api/pages/settings';
                    this._removePageUrl = 'api/pages/remove';
                }
                /**
                 * Lists pages
                 *
                 */
                PageService.prototype.list = function () {
                    return this.authHttp.get(this._listUrl).map(function (res) { return res.json(); });
                };
                /**
                 * Adds a page
                 *
                 * @param {string} url
                 * @param {string} title
                 * @param {string} description
                 * @return {Observable}
                 */
                PageService.prototype.add = function (url, title, description) {
                    var body = JSON.stringify({ url: url, title: title, description: description });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._addUrl, body, options);
                };
                /**
                 * Updates the settings for a page
                 *
                 * @param {string} url
                 * @param {string} title
                 * @param {string} description
                 * @param {string} keywords
                 * @param {string} callout
                 * @param {string} layout
                 * @param {string} language
                 * @param {string} direction
                 * @return {Observable}
                 */
                PageService.prototype.updateSettings = function (url, title, description, keywords, callout, layout, language, direction) {
                    var body = JSON.stringify({ url: url, title: title, description: description, keywords: keywords, callout: callout, layout: layout, language: language, direction: direction });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._updateSettingsUrl, body, options);
                };
                /**
                 * Removes the page
                 *
                 * @param {string} url
                 * @return {Observable}
                 */
                PageService.prototype.remove = function (url) {
                    var body = JSON.stringify({ url: url });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._removePageUrl, body, options);
                };
                PageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], PageService);
                return PageService;
            }());
            exports_1("PageService", PageService);
        }
    }
});
//# sourceMappingURL=page.service.js.map