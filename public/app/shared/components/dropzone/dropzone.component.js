System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var DropzoneComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DropzoneComponent = (function () {
                function DropzoneComponent(elementRef) {
                    this.elementRef = elementRef;
                    this.onAdd = new core_1.EventEmitter();
                }
                /**
                 * Init
                 */
                DropzoneComponent.prototype.ngOnInit = function () {
                    this.setupDropzone();
                };
                DropzoneComponent.prototype.setupDropzone = function () {
                    var el = this.elementRef.nativeElement.querySelector('.dropzone');
                    var dropzone;
                    // set dropzone options
                    var options = {
                        url: '/api/images/add'
                    };
                    // setup token headers
                    options.headers = {};
                    options.headers['X-AUTH'] = 'Bearer ' + localStorage.getItem('id_token');
                    // create the dropzone
                    dropzone = new Dropzone(el, options);
                    var context = this;
                    dropzone.on("complete", function (file) {
                        dropzone.removeFile(file);
                        context.onAdd.emit(null);
                    });
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], DropzoneComponent.prototype, "onAdd", void 0);
                DropzoneComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-dropzone',
                        template: '<form class="dropzone"></form>'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], DropzoneComponent);
                return DropzoneComponent;
            }());
            exports_1("DropzoneComponent", DropzoneComponent);
        }
    }
});
//# sourceMappingURL=dropzone.component.js.map