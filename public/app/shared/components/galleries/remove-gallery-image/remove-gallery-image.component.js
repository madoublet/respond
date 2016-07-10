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
    var RemoveGalleryImageComponent;
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
            RemoveGalleryImageComponent = (function () {
                function RemoveGalleryImageComponent(_galleryImageService) {
                    this._galleryImageService = _galleryImageService;
                    this._visible = false;
                    // outputs
                    this.onCancel = new core_1.EventEmitter();
                    this.onUpdate = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(RemoveGalleryImageComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    // visible input
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RemoveGalleryImageComponent.prototype, "image", {
                    // image input
                    set: function (image) {
                        // set visible
                        this.model = image;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init
                 */
                RemoveGalleryImageComponent.prototype.ngOnInit = function () {
                    this.model = {
                        id: '',
                        name: '',
                        url: '',
                        caption: ''
                    };
                };
                /**
                 * Hides the modal
                 */
                RemoveGalleryImageComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the gallery image
                 */
                RemoveGalleryImageComponent.prototype.submit = function () {
                    var _this = this;
                    this._galleryImageService.remove(this.model.id, this.gallery.id)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful submission
                 */
                RemoveGalleryImageComponent.prototype.success = function () {
                    this._visible = false;
                    this.onUpdate.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], RemoveGalleryImageComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], RemoveGalleryImageComponent.prototype, "image", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryImageComponent.prototype, "gallery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryImageComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryImageComponent.prototype, "onUpdate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryImageComponent.prototype, "onError", void 0);
                RemoveGalleryImageComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-remove-gallery-image',
                        templateUrl: './app/shared/components/galleries/remove-gallery-image/remove-gallery-image.component.html',
                        providers: [gallery_image_service_1.GalleryImageService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof gallery_image_service_1.GalleryImageService !== 'undefined' && gallery_image_service_1.GalleryImageService) === 'function' && _a) || Object])
                ], RemoveGalleryImageComponent);
                return RemoveGalleryImageComponent;
                var _a;
            }());
            exports_1("RemoveGalleryImageComponent", RemoveGalleryImageComponent);
        }
    }
});
//# sourceMappingURL=remove-gallery-image.component.js.map