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
    var MenuItemService;
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
            MenuItemService = (function () {
                function MenuItemService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._listUrl = 'api/menus/items/list';
                    this._addUrl = 'api/menus/items/add';
                    this._editUrl = 'api/menus/items/edit';
                    this._removeUrl = 'api/menus/items/remove';
                    this._updateOrderUrl = 'api/menus/items/order';
                }
                /**
                 * Lists items
                 *
                 */
                MenuItemService.prototype.list = function (id) {
                    var url = this._listUrl + '/' + encodeURI(id);
                    return this.authHttp.get(url).map(function (res) { return res.json(); });
                };
                /**
                 * Adds a menu item
                 *
                 * @param {string} id
                 * @param {string} html
                 * @param {string} cssClass
                 * @param {string} isNested
                 * @param {string} priority
                 * @param {string} url
                 * @return {Observable}
                 */
                MenuItemService.prototype.add = function (id, html, cssClass, isNested, url) {
                    var body = JSON.stringify({ id: id, html: html, cssClass: cssClass, isNested: isNested, url: url });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._addUrl, body, options);
                };
                /**
                 * Edits a menu item
                 *
                 * @param {string} id
                 * @param {string} index
                 * @param {string} html
                 * @param {string} cssClass
                 * @param {string} isNested
                 * @param {string} priority
                 * @param {string} url
                 * @return {Observable}
                 */
                MenuItemService.prototype.edit = function (id, index, html, cssClass, isNested, url) {
                    var body = JSON.stringify({ id: id, index: index, html: html, cssClass: cssClass, isNested: isNested, url: url });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._editUrl, body, options);
                };
                /**
                 * Removes a menu item
                 *
                 * @param {string} name
                 * @param {string} index
                 * @return {Observable}
                 */
                MenuItemService.prototype.remove = function (id, index) {
                    var body = JSON.stringify({ id: id, index: index });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._removeUrl, body, options);
                };
                /**
                 * Updates the order of a list
                 *
                 * @param {string} name
                 * @param {string} priority
                 * @return {Observable}
                 */
                MenuItemService.prototype.updateOrder = function (id, items) {
                    var body = JSON.stringify({ id: id, items: items });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._updateOrderUrl, body, options);
                };
                MenuItemService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], MenuItemService);
                return MenuItemService;
            }());
            exports_1("MenuItemService", MenuItemService);
        }
    }
});
//# sourceMappingURL=menu-item.service.js.map