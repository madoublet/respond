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
    var FormFieldService;
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
            FormFieldService = (function () {
                function FormFieldService(http, authHttp, authConfig) {
                    this.http = http;
                    this.authHttp = authHttp;
                    this.authConfig = authConfig;
                    this._listUrl = 'api/forms/fields/list';
                    this._addUrl = 'api/forms/fields/add';
                    this._editUrl = 'api/forms/fields/edit';
                    this._removeUrl = 'api/forms/fields/remove';
                    this._updateOrderUrl = 'api/forms/fields/order';
                }
                /**
                 * Lists fields
                 *
                 */
                FormFieldService.prototype.list = function (id) {
                    var url = this._listUrl + '/' + encodeURI(id);
                    return this.authHttp.get(url).map(function (res) { return res.json(); });
                };
                /**
                 * Adds a form filed
                 *
                 * @param {string} label
                 * @param {string} type
                 * @param {boolean} required
                 * @param {string} options
                 * @param {string} helperText
                 * @param {string} placeholder
                 * @param {string} cssClass
                 * @return {Observable}
                 */
                FormFieldService.prototype.add = function (id, label, type, required, options, helperText, placeholder, cssClass) {
                    var body = JSON.stringify({ id: id, label: label, type: type, required: required, options: options, helperText: helperText, placeholder: placeholder, cssClass: cssClass });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var _options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._addUrl, body, _options);
                };
                /**
                 * Edits a form field
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
                FormFieldService.prototype.edit = function (id, index, label, type, required, options, helperText, placeholder, cssClass) {
                    var body = JSON.stringify({ id: id, index: index, label: label, type: type, required: required, options: options, helperText: helperText, placeholder: placeholder, cssClass: cssClass });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var _options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._editUrl, body, _options);
                };
                /**
                 * Removes a form field
                 *
                 * @param {string} name
                 * @param {string} index
                 * @return {Observable}
                 */
                FormFieldService.prototype.remove = function (id, index) {
                    var body = JSON.stringify({ id: id, index: index });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._removeUrl, body, options);
                };
                /**
                 * Updates the order of fields
                 *
                 * @param {string} name
                 * @param {string} priority
                 * @return {Observable}
                 */
                FormFieldService.prototype.updateOrder = function (id, fields) {
                    var body = JSON.stringify({ id: id, fields: fields });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.authHttp.post(this._updateOrderUrl, body, options);
                };
                FormFieldService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp, angular2_jwt_1.AuthConfig])
                ], FormFieldService);
                return FormFieldService;
            }());
            exports_1("FormFieldService", FormFieldService);
        }
    }
});
//# sourceMappingURL=form-field.service.js.map