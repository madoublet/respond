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
    var GalleryImageService;
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
            GalleryImageService = (function () {
                function GalleryImageService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._listUrl = 'api/galleries/images/list';
                    this._addUrl = 'api/galleries/images/add';
                    this._editUrl = 'api/galleries/images/edit';
                    this._removeUrl = 'api/galleries/images/remove';
                    this._updateOrderUrl = 'api/galleries/images/order';
                }
                /**
                 * Lists images
                 *
                 */
                GalleryImageService.prototype.list = function (galleryId) {
                    var url = this._listUrl + '/' + encodeURI(galleryId);
                    return this.authHttp.get(url).map(function (res) { return res.json(); });
                };
                /**
                 * Adds an image
                 *
                 * @param {string} name
                 * @param {string} caption
                 * @return {Observable}
                 */
                GalleryImageService.prototype.add = function (name, url, thumb, caption, galleryId) {
                    var body = JSON.stringify({ name: name, url: url, thumb: thumb, caption: caption, galleryId: galleryId });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var _options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._addUrl, body, _options);
                };
                /**
                 * Edits an image
                 *
                 * @param {string} id
                 * @param {number} index
                 * @param {string} label
                 * @param {string} type
                 * @param {boolean} required
                 * @param {string} options
                 * @param {string} helperText
                 * @param {string} placeholder
                 * @param {string} cssClass
                 * @return {Observable}
                 */
                GalleryImageService.prototype.edit = function (id, caption, galleryId) {
                    var body = JSON.stringify({ id: id, caption: caption, galleryId: galleryId });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var _options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._editUrl, body, _options);
                };
                /**
                 * Removes an image
                 *
                 * @param {string} id
                 * @return {Observable}
                 */
                GalleryImageService.prototype.remove = function (id, galleryId) {
                    var body = JSON.stringify({ id: id, galleryId: galleryId });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._removeUrl, body, options);
                };
                /**
                 * Updates the order of images
                 *
                 * @param {string} id
                 * @param {array} images
                 * @return {Observable}
                 */
                GalleryImageService.prototype.updateOrder = function (images, galleryId) {
                    var body = JSON.stringify({ images: images, galleryId: galleryId });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._updateOrderUrl, body, options);
                };
                GalleryImageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], GalleryImageService);
                return GalleryImageService;
            }());
            exports_1("GalleryImageService", GalleryImageService);
        }
    }
});
//# sourceMappingURL=gallery-image.service.js.map