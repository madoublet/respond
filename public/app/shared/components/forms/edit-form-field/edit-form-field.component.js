System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/form-field.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, form_field_service_1;
    var EditFormFieldComponent;
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
            function (form_field_service_1_1) {
                form_field_service_1 = form_field_service_1_1;
            }],
        execute: function() {
            EditFormFieldComponent = (function () {
                function EditFormFieldComponent(_formFieldService) {
                    this._formFieldService = _formFieldService;
                    // model to store
                    this.model = {
                        label: '',
                        type: '',
                        required: false,
                        options: '',
                        helperText: '',
                        placeholder: '',
                        cssClass: ''
                    };
                    // visible input
                    this._visible = false;
                    // outputs
                    this.onCancel = new core_1.EventEmitter();
                    this.onAdd = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(EditFormFieldComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EditFormFieldComponent.prototype, "field", {
                    // item input
                    set: function (field) {
                        // set item
                        this.model = field;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init
                 */
                EditFormFieldComponent.prototype.ngOnInit = function () {
                    this.model = {
                        label: '',
                        type: '',
                        required: false,
                        options: '',
                        helperText: '',
                        placeholder: '',
                        cssClass: ''
                    };
                };
                /**
                 * Hides the add modal
                 */
                EditFormFieldComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the form
                 */
                EditFormFieldComponent.prototype.submit = function () {
                    var _this = this;
                    this._formFieldService.edit(this.form.id, this.index, this.model.label, this.model.type, this.model.required, this.model.options, this.model.helperText, this.model.placeholder, this.model.cssClass)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful add
                 */
                EditFormFieldComponent.prototype.success = function () {
                    toast.show('success');
                    this._visible = false;
                    this.onAdd.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], EditFormFieldComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], EditFormFieldComponent.prototype, "form", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], EditFormFieldComponent.prototype, "index", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], EditFormFieldComponent.prototype, "field", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditFormFieldComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditFormFieldComponent.prototype, "onAdd", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditFormFieldComponent.prototype, "onError", void 0);
                EditFormFieldComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-edit-form-field',
                        templateUrl: './app/shared/components/forms/edit-form-field/edit-form-field.component.html',
                        providers: [form_field_service_1.FormFieldService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof form_field_service_1.FormFieldService !== 'undefined' && form_field_service_1.FormFieldService) === 'function' && _a) || Object])
                ], EditFormFieldComponent);
                return EditFormFieldComponent;
                var _a;
            }());
            exports_1("EditFormFieldComponent", EditFormFieldComponent);
        }
    }
});
//# sourceMappingURL=edit-form-field.component.js.map