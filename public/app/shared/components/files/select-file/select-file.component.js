System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/file.service', '/app/shared/components/dropzone/dropzone.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, file_service_1, dropzone_component_1;
    var SelectFileComponent;
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
            function (file_service_1_1) {
                file_service_1 = file_service_1_1;
            },
            function (dropzone_component_1_1) {
                dropzone_component_1 = dropzone_component_1_1;
            }],
        execute: function() {
            SelectFileComponent = (function () {
                function SelectFileComponent(_fileService) {
                    this._fileService = _fileService;
                    this._visible = false;
                    this.onCancel = new core_1.EventEmitter();
                    this.onSelect = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(SelectFileComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init files
                 */
                SelectFileComponent.prototype.ngOnInit = function () {
                    this.list();
                };
                /**
                 * Updates the list
                 */
                SelectFileComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._fileService.list()
                        .subscribe(function (data) { _this.files = data; }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Resets an modal booleans
                 */
                SelectFileComponent.prototype.reset = function () {
                    this.file = {};
                };
                /**
                 * Hides the modal
                 */
                SelectFileComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the form
                 */
                SelectFileComponent.prototype.select = function (file) {
                    this.onSelect.emit(file);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], SelectFileComponent.prototype, "visible", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], SelectFileComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], SelectFileComponent.prototype, "onSelect", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], SelectFileComponent.prototype, "onError", void 0);
                SelectFileComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-select-file',
                        templateUrl: './app/shared/components/files/select-file/select-file.component.html',
                        providers: [file_service_1.FileService],
                        directives: [dropzone_component_1.DropzoneComponent],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof file_service_1.FileService !== 'undefined' && file_service_1.FileService) === 'function' && _a) || Object])
                ], SelectFileComponent);
                return SelectFileComponent;
                var _a;
            }());
            exports_1("SelectFileComponent", SelectFileComponent);
        }
    }
});
//# sourceMappingURL=select-file.component.js.map