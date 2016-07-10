System.register(['@angular/core', '@angular/router-deprecated', 'ng2-translate/ng2-translate', 'angular2-jwt/angular2-jwt', '/app/shared/services/gallery.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, ng2_translate_1, angular2_jwt_1, gallery_service_1;
    var RemoveGalleryComponent;
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
            function (gallery_service_1_1) {
                gallery_service_1 = gallery_service_1_1;
            }],
        execute: function() {
            RemoveGalleryComponent = (function () {
                function RemoveGalleryComponent(_galleryService) {
                    this._galleryService = _galleryService;
                    this._visible = false;
                    // outputs
                    this.onCancel = new core_1.EventEmitter();
                    this.onUpdate = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                }
                Object.defineProperty(RemoveGalleryComponent.prototype, "visible", {
                    get: function () { return this._visible; },
                    // visible input
                    set: function (visible) {
                        // set visible
                        this._visible = visible;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RemoveGalleryComponent.prototype, "gallery", {
                    // gallery input
                    set: function (gallery) {
                        // set visible
                        this.model = gallery;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Init
                 */
                RemoveGalleryComponent.prototype.ngOnInit = function () {
                    this.model = {
                        id: '',
                        name: ''
                    };
                };
                /**
                 * Hides the modal
                 */
                RemoveGalleryComponent.prototype.hide = function () {
                    this._visible = false;
                    this.onCancel.emit(null);
                };
                /**
                 * Submits the gallery
                 */
                RemoveGalleryComponent.prototype.submit = function () {
                    var _this = this;
                    this._galleryService.remove(this.model.id)
                        .subscribe(function (data) { _this.success(); }, function (error) { _this.onError.emit(error); });
                };
                /**
                 * Handles a successful submission
                 */
                RemoveGalleryComponent.prototype.success = function () {
                    this._visible = false;
                    this.onUpdate.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], RemoveGalleryComponent.prototype, "visible", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], RemoveGalleryComponent.prototype, "gallery", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryComponent.prototype, "onCancel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryComponent.prototype, "onUpdate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RemoveGalleryComponent.prototype, "onError", void 0);
                RemoveGalleryComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-remove-gallery',
                        templateUrl: './app/shared/components/galleries/remove-gallery/remove-gallery.component.html',
                        providers: [gallery_service_1.GalleryService],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof gallery_service_1.GalleryService !== 'undefined' && gallery_service_1.GalleryService) === 'function' && _a) || Object])
                ], RemoveGalleryComponent);
                return RemoveGalleryComponent;
                var _a;
            }());
            exports_1("RemoveGalleryComponent", RemoveGalleryComponent);
        }
    }
});
//# sourceMappingURL=remove-gallery.component.js.map