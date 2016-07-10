System.register(['@angular/core', 'angular2-jwt/angular2-jwt', '@angular/router-deprecated', 'ng2-translate/ng2-translate', '/app/shared/services/form.service', '/app/shared/services/form-field.service', '/app/shared/components/forms/add-form/add-form.component', '/app/shared/components/forms/edit-form/edit-form.component', '/app/shared/components/forms/remove-form/remove-form.component', '/app/shared/components/forms/add-form-field/add-form-field.component', '/app/shared/components/forms/edit-form-field/edit-form-field.component', '/app/shared/components/forms/remove-form-field/remove-form-field.component', '/app/shared/components/drawer/drawer.component'], function(exports_1, context_1) {
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
    var core_1, angular2_jwt_1, router_deprecated_1, ng2_translate_1, form_service_1, form_field_service_1, add_form_component_1, edit_form_component_1, remove_form_component_1, add_form_field_component_1, edit_form_field_component_1, remove_form_field_component_1, drawer_component_1;
    var FormsComponent;
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
            function (form_service_1_1) {
                form_service_1 = form_service_1_1;
            },
            function (form_field_service_1_1) {
                form_field_service_1 = form_field_service_1_1;
            },
            function (add_form_component_1_1) {
                add_form_component_1 = add_form_component_1_1;
            },
            function (edit_form_component_1_1) {
                edit_form_component_1 = edit_form_component_1_1;
            },
            function (remove_form_component_1_1) {
                remove_form_component_1 = remove_form_component_1_1;
            },
            function (add_form_field_component_1_1) {
                add_form_field_component_1 = add_form_field_component_1_1;
            },
            function (edit_form_field_component_1_1) {
                edit_form_field_component_1 = edit_form_field_component_1_1;
            },
            function (remove_form_field_component_1_1) {
                remove_form_field_component_1 = remove_form_field_component_1_1;
            },
            function (drawer_component_1_1) {
                drawer_component_1 = drawer_component_1_1;
            }],
        execute: function() {
            FormsComponent = (function () {
                function FormsComponent(_formService, _formFieldService, _router) {
                    this._formService = _formService;
                    this._formFieldService = _formFieldService;
                    this._router = _router;
                }
                /**
                 * Init
                 *
                 */
                FormsComponent.prototype.ngOnInit = function () {
                    this.id = localStorage.getItem('respond.siteId');
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.addFieldVisible = false;
                    this.editFieldVisible = false;
                    this.removeFieldVisible = false;
                    this.drawerVisible = false;
                    this.overflowVisible = false;
                    this.forms = [];
                    this.fields = [];
                    this.list();
                };
                /**
                 * Updates the list
                 */
                FormsComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._formService.list()
                        .subscribe(function (data) { _this.forms = data; _this.success(); }, function (error) { _this.failure(error); });
                };
                /**
                 * handles the list successfully updated
                 */
                FormsComponent.prototype.success = function () {
                    var x, flag = false;
                    // check if selected form is set
                    if (this.forms.length > 0 && this.forms != undefined) {
                        if (this.selectedForm !== undefined && this.selectedForm !== null) {
                            for (x = 0; x < this.forms.length; x++) {
                                if (this.forms[x].id === this.selectedForm.id) {
                                    flag = true;
                                }
                            }
                        }
                        // check if id is in array
                        if (flag === false) {
                            this.selectedForm = this.forms[0];
                        }
                    }
                    // update fields
                    if (this.selectedForm !== null) {
                        this.listFields();
                    }
                };
                /**
                 * list fields in the form
                 */
                FormsComponent.prototype.listFields = function () {
                    var _this = this;
                    this._formFieldService.list(this.selectedForm.id)
                        .subscribe(function (data) { _this.fields = data; }, function (error) { _this.failure(error); });
                };
                /**
                 * Resets screen
                 */
                FormsComponent.prototype.reset = function () {
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.addFieldVisible = false;
                    this.editFieldVisible = false;
                    this.removeFieldVisible = false;
                    this.drawerVisible = false;
                    this.overflowVisible = false;
                };
                /**
                 * Sets the form to active
                 *
                 * @param {Form} form
                 */
                FormsComponent.prototype.setActive = function (form) {
                    this.selectedForm = form;
                    this.listFields();
                };
                /**
                 * Sets the list field to active
                 *
                 * @param {FormField} field
                 */
                FormsComponent.prototype.setFieldActive = function (field) {
                    this.selectedField = field;
                    this.selectedIndex = this.fields.indexOf(field);
                };
                /**
                 * Shows the drawer
                 */
                FormsComponent.prototype.toggleDrawer = function () {
                    this.drawerVisible = !this.drawerVisible;
                };
                /**
                 * Shows the overflow menu
                 */
                FormsComponent.prototype.toggleOverflow = function () {
                    this.overflowVisible = !this.overflowVisible;
                };
                /**
                 * Shows the add dialog
                 */
                FormsComponent.prototype.showAdd = function () {
                    this.addVisible = true;
                };
                /**
                 * Shows the edit dialog
                 */
                FormsComponent.prototype.showEdit = function () {
                    this.editVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {Form} form
                 */
                FormsComponent.prototype.showRemove = function () {
                    this.removeVisible = true;
                };
                /**
                 * Shows the add dialog
                 */
                FormsComponent.prototype.showAddField = function () {
                    this.addFieldVisible = true;
                };
                /**
                 * Shows the edit dialog
                 */
                FormsComponent.prototype.showEditField = function () {
                    this.editFieldVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {FormField} field
                 */
                FormsComponent.prototype.showRemoveField = function (field) {
                    this.removeFieldVisible = true;
                };
                /**
                 * Move the field up
                 *
                 * @param {FormField} field
                 */
                FormsComponent.prototype.moveFieldUp = function (field) {
                    var i = this.fields.indexOf(field);
                    if (i != 0) {
                        this.fields.splice(i, 1);
                        this.fields.splice(i - 1, 0, field);
                    }
                    this.updateOrder();
                };
                /**
                 * Move the field down
                 *
                 * @param {FormField} field
                 */
                FormsComponent.prototype.moveFieldDown = function (field) {
                    var i = this.fields.indexOf(field);
                    if (i != (this.fields.length - 1)) {
                        this.fields.splice(i, 1);
                        this.fields.splice(i + 1, 0, field);
                    }
                    this.updateOrder();
                };
                /**
                 * Updates the order of the field fields
                 *
                 */
                FormsComponent.prototype.updateOrder = function () {
                    var _this = this;
                    this._formFieldService.updateOrder(this.selectedForm.id, this.fields)
                        .subscribe(function (data) { }, function (error) { return _this.errorMessage = error; });
                };
                /**
                 * handles errors
                 */
                FormsComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                    if (obj.status == 401) {
                        this._router.navigate(['Login', { id: this.id }]);
                    }
                };
                FormsComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-forms',
                        templateUrl: './app/forms/forms.component.html',
                        providers: [form_service_1.FormService, form_field_service_1.FormFieldService],
                        directives: [add_form_component_1.AddFormComponent, edit_form_component_1.EditFormComponent, remove_form_component_1.RemoveFormComponent, add_form_field_component_1.AddFormFieldComponent, edit_form_field_component_1.EditFormFieldComponent, remove_form_field_component_1.RemoveFormFieldComponent, drawer_component_1.DrawerComponent],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof form_service_1.FormService !== 'undefined' && form_service_1.FormService) === 'function' && _a) || Object, (typeof (_b = typeof form_field_service_1.FormFieldService !== 'undefined' && form_field_service_1.FormFieldService) === 'function' && _b) || Object, router_deprecated_1.Router])
                ], FormsComponent);
                return FormsComponent;
                var _a, _b;
            }());
            exports_1("FormsComponent", FormsComponent);
        }
    }
});
//# sourceMappingURL=forms.component.js.map