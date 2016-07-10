System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/gallery-image.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, gallery_image_service_1;
    var EditCaptionComponent;
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
            function (gallery_image_service_1_1) {
                gallery_image_service_1 = gallery_image_service_1_1;
            }],
        execute: function() {
            EditCaptionComponent = (function () {
                function EditCaptionComponent(_galleryImageService) {
                    this._galleryImageService = _galleryImageService;
                    // model to store
                    this.model = {
                        caption: ''
                    };
                    // visible input
                    this._visible = false;
                    // outputs
                    this.onCancel = new core_1.EventEmitter();
                    this.onAdd = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(EditCaptionComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EditCaptionComponent.prototype, "image", {
                    // item input
                    set: function (image) {
                        // set item
                        this.model = image;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init
                 */
                EditCaptionComponent.prototype.ngOnInit = function () {
                    this.model = {
                        caption: ''
                    };
                };
                /**
                 * Hides the add modal
                 */
                EditCaptionComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the gallery image
                 */
                EditCaptionComponent.prototype.submit = function () {
                    var _this = this;
                    this._galleryImageService.edit(this.model.id, this.model.caption, this.gallery.id)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful add
                 */
                EditCaptionComponent.prototype.success = function () {
                    toast.show('success');
                    this._visible = false;
                    this.onAdd.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], EditCaptionComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], EditCaptionComponent.prototype, "image", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], EditCaptionComponent.prototype, "index", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], EditCaptionComponent.prototype, "image", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], EditCaptionComponent.prototype, "gallery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditCaptionComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditCaptionComponent.prototype, "onAdd", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], EditCaptionComponent.prototype, "onError", void 0);
                EditCaptionComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-edit-caption',
                        templateUrl: './app/shared/components/galleries/edit-caption/edit-caption.component.html',
                        providers: [gallery_image_service_1.GalleryImageService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof gallery_image_service_1.GalleryImageService !== 'undefined' && gallery_image_service_1.GalleryImageService) === 'function' && _a) || Object])
                ], EditCaptionComponent);
                return EditCaptionComponent;
                var _a;
            }());
            exports_1("EditCaptionComponent", EditCaptionComponent);
        }
    }
});
//# sourceMappingURL=edit-caption.component.js.map