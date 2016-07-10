System.register(['@angular/core', 'angular2-jwt/angular2-jwt', '@angular/router-deprecated', 'ng2-translate/ng2-translate', '/app/shared/services/gallery.service', '/app/shared/services/gallery-image.service', '/app/shared/components/files/select-file/select-file.component', '/app/shared/components/galleries/add-gallery/add-gallery.component', '/app/shared/components/galleries/edit-gallery/edit-gallery.component', '/app/shared/components/galleries/remove-gallery/remove-gallery.component', '/app/shared/components/galleries/edit-caption/edit-caption.component', '/app/shared/components/galleries/remove-gallery-image/remove-gallery-image.component', '/app/shared/components/drawer/drawer.component'], function(exports_1, context_1) {
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
    var core_1, angular2_jwt_1, router_deprecated_1, ng2_translate_1, gallery_service_1, gallery_image_service_1, select_file_component_1, add_gallery_component_1, edit_gallery_component_1, remove_gallery_component_1, edit_caption_component_1, remove_gallery_image_component_1, drawer_component_1;
    var GalleriesComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (angular2_jwt_1_1) {
                angular2_jwt_1 = angular2_jwt_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            },
            function (gallery_service_1_1) {
                gallery_service_1 = gallery_service_1_1;
            },
            function (gallery_image_service_1_1) {
                gallery_image_service_1 = gallery_image_service_1_1;
            },
            function (select_file_component_1_1) {
                select_file_component_1 = select_file_component_1_1;
            },
            function (add_gallery_component_1_1) {
                add_gallery_component_1 = add_gallery_component_1_1;
            },
            function (edit_gallery_component_1_1) {
                edit_gallery_component_1 = edit_gallery_component_1_1;
            },
            function (remove_gallery_component_1_1) {
                remove_gallery_component_1 = remove_gallery_component_1_1;
            },
            function (edit_caption_component_1_1) {
                edit_caption_component_1 = edit_caption_component_1_1;
            },
            function (remove_gallery_image_component_1_1) {
                remove_gallery_image_component_1 = remove_gallery_image_component_1_1;
            },
            function (drawer_component_1_1) {
                drawer_component_1 = drawer_component_1_1;
            }],
        execute: function() {
            GalleriesComponent = (function () {
                function GalleriesComponent(_galleryService, _galleryImageService, _router) {
                    this._galleryService = _galleryService;
                    this._galleryImageService = _galleryImageService;
                    this._router = _router;
                }
                /**
                 * Init
                 *
                 */
                GalleriesComponent.prototype.ngOnInit = function () {
                    this.id = localStorage.getItem('respond.siteId');
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.selectVisible = false;
                    this.removeImageVisible = false;
                    this.drawerVisible = false;
                    this.overflowVisible = false;
                    this.galleries = [];
                    this.images = [];
                    this.selectedGallery = null;
                    this.selectedImage = null;
                    this.list();
                };
                /**
                 * Updates the list
                 */
                GalleriesComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._galleryService.list()
                        .subscribe(function (data) { _this.galleries = data; _this.success(); }, function (error) { _this.failure(error); });
                };
                /**
                 * handles the list successfully updated
                 */
                GalleriesComponent.prototype.success = function () {
                    var x, flag = false;
                    // check if selected gallery is set
                    if (this.galleries.length > 0 && this.galleries != undefined) {
                        if (this.selectedGallery !== undefined && this.selectedGallery !== null) {
                            for (x = 0; x < this.galleries.length; x++) {
                                if (this.galleries[x].id === this.selectedGallery.id) {
                                    flag = true;
                                }
                            }
                        }
                        // check if id is in array
                        if (flag === false) {
                            this.selectedGallery = this.galleries[0];
                        }
                    }
                    // update images
                    if (this.selectedGallery !== null) {
                        this.listImages();
                    }
                };
                /**
                 * list images for the gallery
                 */
                GalleriesComponent.prototype.listImages = function () {
                    var _this = this;
                    this._galleryImageService.list(this.selectedGallery.id)
                        .subscribe(function (data) { _this.images = data; }, function (error) { _this.failure(error); });
                };
                /**
                 * Resets screen
                 */
                GalleriesComponent.prototype.reset = function () {
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.selectVisible = false;
                    this.removeImageVisible = false;
                    this.editImageVisible = false;
                    this.drawerVisible = false;
                    this.overflowVisible = false;
                };
                /**
                 * Sets the gallery to active
                 *
                 * @param {Gallery} gallery
                 */
                GalleriesComponent.prototype.setActive = function (gallery) {
                    this.selectedGallery = gallery;
                    this.listImages();
                };
                /**
                 * Sets the image to active
                 *
                 * @param {Image} image
                 */
                GalleriesComponent.prototype.setImageActive = function (image) {
                    this.selectedImage = image;
                    this.selectedIndex = this.images.indexOf(image);
                };
                /**
                 * Shows the drawer
                 */
                GalleriesComponent.prototype.toggleDrawer = function () {
                    this.drawerVisible = !this.drawerVisible;
                };
                /**
                 * Shows the overflow menu
                 */
                GalleriesComponent.prototype.toggleOverflow = function () {
                    this.overflowVisible = !this.overflowVisible;
                };
                /**
                 * Shows the add dialog
                 */
                GalleriesComponent.prototype.showAdd = function () {
                    this.addVisible = true;
                };
                /**
                 * Shows the edit dialog
                 */
                GalleriesComponent.prototype.showEdit = function () {
                    this.editVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 */
                GalleriesComponent.prototype.showRemove = function () {
                    this.removeVisible = true;
                };
                /**
                 * Shows the select dialog
                 */
                GalleriesComponent.prototype.showSelect = function () {
                    this.selectVisible = true;
                };
                /**
                 * Handles the selection of an image
                 */
                GalleriesComponent.prototype.select = function (event) {
                    var _this = this;
                    var caption = '';
                    this._galleryImageService.add(event.name, event.url, event.thumb, caption, this.selectedGallery.id)
                        .subscribe(function (data) { _this.listImages(); toast.show('success'); }, function (error) { _this.failure(error); });
                    this.selectVisible = false;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {Image} image
                 */
                GalleriesComponent.prototype.showRemoveImage = function (image) {
                    this.selectedImage = image;
                    this.removeImageVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {Image} image
                 */
                GalleriesComponent.prototype.showEditImage = function (image) {
                    this.selectedImage = image;
                    this.editImageVisible = true;
                };
                /**
                 * Move the image up
                 *
                 * @param {Image} image
                 */
                GalleriesComponent.prototype.moveImageUp = function (image) {
                    var i = this.images.indexOf(image);
                    if (i != 0) {
                        this.images.splice(i, 1);
                        this.images.splice(i - 1, 0, image);
                    }
                    this.updateOrder();
                };
                /**
                 * Move the image down
                 *
                 * @param {Image} image
                 */
                GalleriesComponent.prototype.moveImageDown = function (image) {
                    var i = this.images.indexOf(image);
                    if (i != (this.images.length - 1)) {
                        this.images.splice(i, 1);
                        this.images.splice(i + 1, 0, image);
                    }
                    this.updateOrder();
                };
                /**
                 * Updates the order of the field fields
                 *
                 */
                GalleriesComponent.prototype.updateOrder = function () {
                    var _this = this;
                    this._galleryImageService.updateOrder(this.images, this.selectedGallery.id)
                        .subscribe(function (data) { }, function (error) { _this.failure(error); });
                };
                /**
                 * handles error
                 */
                GalleriesComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                    if (obj.status == 401) {
                        this._router.navigate(['Login', { id: this.id }]);
                    }
                };
                GalleriesComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-galleries',
                        templateUrl: './app/galleries/galleries.component.html',
                        providers: [gallery_service_1.GalleryService, gallery_image_service_1.GalleryImageService],
                        directives: [select_file_component_1.SelectFileComponent, add_gallery_component_1.AddGalleryComponent, edit_gallery_component_1.EditGalleryComponent, remove_gallery_component_1.RemoveGalleryComponent, edit_caption_component_1.EditCaptionComponent, remove_gallery_image_component_1.RemoveGalleryImageComponent, drawer_component_1.DrawerComponent],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof gallery_service_1.GalleryService !== 'undefined' && gallery_service_1.GalleryService) === 'function' && _a) || Object, (typeof (_b = typeof gallery_image_service_1.GalleryImageService !== 'undefined' && gallery_image_service_1.GalleryImageService) === 'function' && _b) || Object, router_deprecated_1.Router])
                ], GalleriesComponent);
                return GalleriesComponent;
                var _a, _b;
            }());
            exports_1("GalleriesComponent", GalleriesComponent);
        }
    }
});
//# sourceMappingURL=galleries.component.js.map