System.register(['@angular/core', 'angular2-jwt/angular2-jwt', '@angular/router-deprecated', 'ng2-translate/ng2-translate', '/app/shared/services/user.service', '/app/shared/components/users/add-user/add-user.component', '/app/shared/components/users/edit-user/edit-user.component', '/app/shared/components/users/remove-user/remove-user.component', '/app/shared/components/drawer/drawer.component'], function(exports_1, context_1) {
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
    var core_1, angular2_jwt_1, router_deprecated_1, ng2_translate_1, user_service_1, add_user_component_1, edit_user_component_1, remove_user_component_1, drawer_component_1;
    var UsersComponent;
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
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (add_user_component_1_1) {
                add_user_component_1 = add_user_component_1_1;
            },
            function (edit_user_component_1_1) {
                edit_user_component_1 = edit_user_component_1_1;
            },
            function (remove_user_component_1_1) {
                remove_user_component_1 = remove_user_component_1_1;
            },
            function (drawer_component_1_1) {
                drawer_component_1 = drawer_component_1_1;
            }],
        execute: function() {
            UsersComponent = (function () {
                function UsersComponent(_userService, _router) {
                    this._userService = _userService;
                    this._router = _router;
                }
                /**
                 * Init
                 *
                 */
                UsersComponent.prototype.ngOnInit = function () {
                    this.id = localStorage.getItem('respond.siteId');
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.drawerVisible = false;
                    this.user = {};
                    this.users = [];
                    this.list();
                };
                /**
                 * Updates the list
                 */
                UsersComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._userService.list()
                        .subscribe(function (data) { _this.users = data; }, function (error) { _this.failure(error); });
                };
                /**
                 * Resets an modal booleans
                 */
                UsersComponent.prototype.reset = function () {
                    this.addVisible = false;
                    this.editVisible = false;
                    this.removeVisible = false;
                    this.drawerVisible = false;
                    this.user = {};
                };
                /**
                 * Sets the list item to active
                 *
                 * @param {User} user
                 */
                UsersComponent.prototype.setActive = function (user) {
                    this.selectedUser = user;
                };
                /**
                 * Shows the drawer
                 */
                UsersComponent.prototype.toggleDrawer = function () {
                    this.drawerVisible = !this.drawerVisible;
                };
                /**
                 * Shows the add dialog
                 */
                UsersComponent.prototype.showAdd = function () {
                    this.addVisible = true;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {User} user
                 */
                UsersComponent.prototype.showRemove = function (user) {
                    this.removeVisible = true;
                    this.user = user;
                };
                /**
                 * Shows the edit dialog
                 *
                 * @param {User} user
                 */
                UsersComponent.prototype.showEdit = function (user) {
                    this.editVisible = true;
                    this.user = user;
                };
                /**
                 * handles error
                 */
                UsersComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                    if (obj.status == 401) {
                        this._router.navigate(['Login', { id: this.id }]);
                    }
                };
                UsersComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-users',
                        templateUrl: './app/users/users.component.html',
                        providers: [user_service_1.UserService],
                        directives: [add_user_component_1.AddUserComponent, edit_user_component_1.EditUserComponent, remove_user_component_1.RemoveUserComponent, drawer_component_1.DrawerComponent],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _a) || Object, router_deprecated_1.Router])
                ], UsersComponent);
                return UsersComponent;
                var _a;
            }());
            exports_1("UsersComponent", UsersComponent);
        }
    }
});
//# sourceMappingURL=users.component.js.map