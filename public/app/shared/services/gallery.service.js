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
    var GalleryService;
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
            GalleryService = (function () {
                function GalleryService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._listUrl = 'api/galleries/list';
                    this._addUrl = 'api/galleries/add';
                    this._editUrl = 'api/galleries/edit';
                    this._removeUrl = 'api/galleries/remove';
                }
                /**
                 * Lists forms
                 *
                 */
                GalleryService.prototype.list = function () {
                    return this.authHttp.get(this._listUrl).map(function (res) { return res.json(); });
                };
                /**
                 * Adds a gallery
                 *
                 * @param {string} name
                 * @param {string} cssClass
                 * @return {Observable}
                 */
                GalleryService.prototype.add = function (name) {
                    var body = JSON.stringify({ name: name });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._addUrl, body, options);
                };
                /**
                 * Edits a gallery
                 *
                 * @param {string} name
                 * @return {Observable}
                 */
                GalleryService.prototype.edit = function (id, name) {
                    var body = JSON.stringify({ id: id, name: name });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._editUrl, body, options);
                };
                /**
                 * Removes a gallery
                 *
                 * @param {string} id
                 * @return {Observable}
                 */
                GalleryService.prototype.remove = function (id) {
                    var body = JSON.stringify({ id: id });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._removeUrl, body, options);
                };
                GalleryService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], GalleryService);
                return GalleryService;
            }());
            exports_1("GalleryService", GalleryService);
        }
    }
});
//# sourceMappingURL=gallery.service.js.map