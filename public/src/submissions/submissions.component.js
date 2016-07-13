System.register(['@angular/core', 'angular2-jwt/angular2-jwt', '@angular/router-deprecated', 'ng2-translate/ng2-translate', './app/shared/services/submission.service', './app/shared/components/submissions/remove-submission/remove-submission.component', './app/shared/components/submissions/view-submission/view-submission.component', './app/shared/components/drawer/drawer.component', './app/shared/pipes/time-ago.pipe'], function(exports_1, context_1) {
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
    var core_1, angular2_jwt_1, router_deprecated_1, ng2_translate_1, submission_service_1, remove_submission_component_1, view_submission_component_1, drawer_component_1, time_ago_pipe_1;
    var SubmissionsComponent;
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
            function (submission_service_1_1) {
                submission_service_1 = submission_service_1_1;
            },
            function (remove_submission_component_1_1) {
                remove_submission_component_1 = remove_submission_component_1_1;
            },
            function (view_submission_component_1_1) {
                view_submission_component_1 = view_submission_component_1_1;
            },
            function (drawer_component_1_1) {
                drawer_component_1 = drawer_component_1_1;
            },
            function (time_ago_pipe_1_1) {
                time_ago_pipe_1 = time_ago_pipe_1_1;
            }],
        execute: function() {
            SubmissionsComponent = (function () {
                function SubmissionsComponent(_submissionService, _router) {
                    this._submissionService = _submissionService;
                    this._router = _router;
                }
                /**
                 * Init submissions
                 *
                 */
                SubmissionsComponent.prototype.ngOnInit = function () {
                    this.id = localStorage.getItem('respond.siteId');
                    this.removeVisible = false;
                    this.drawerVisible = false;
                    this.submission = {};
                    this.submissions = [];
                    this.list();
                };
                /**
                 * Updates the list
                 */
                SubmissionsComponent.prototype.list = function () {
                    var _this = this;
                    this.reset();
                    this._submissionService.list()
                        .subscribe(function (data) { _this.submissions = data; }, function (error) { _this.failure(error); });
                };
                /**
                 * Resets an modal booleans
                 */
                SubmissionsComponent.prototype.reset = function () {
                    this.removeVisible = false;
                    this.viewVisible = false;
                    this.drawerVisible = false;
                    this.submission = {};
                };
                /**
                 * Sets the list item to active
                 *
                 * @param {Submission} submission
                 */
                SubmissionsComponent.prototype.setActive = function (submission) {
                    this.selectedSubmission = submission;
                };
                /**
                 * Shows the drawer
                 */
                SubmissionsComponent.prototype.toggleDrawer = function () {
                    this.drawerVisible = !this.drawerVisible;
                };
                /**
                 * Shows the view dialog
                 *
                 * @param {Submission} submission
                 */
                SubmissionsComponent.prototype.showView = function (submission) {
                    this.viewVisible = true;
                    this.submission = submission;
                };
                /**
                 * Shows the remove dialog
                 *
                 * @param {Submission} submission
                 */
                SubmissionsComponent.prototype.showRemove = function (submission) {
                    this.removeVisible = true;
                    this.submission = submission;
                };
                /**
                 * handles error
                 */
                SubmissionsComponent.prototype.failure = function (obj) {
                    toast.show('failure');
                    if (obj.status == 401) {
                        this._router.navigate(['Login', { id: this.id }]);
                    }
                };
                SubmissionsComponent = __decorate([
                    core_1.Component({
                        selector: 'respond-submissions',
                        templateUrl: './app/submissions/submissions.component.html',
                        providers: [submission_service_1.SubmissionService],
                        directives: [remove_submission_component_1.RemoveSubmissionComponent, view_submission_component_1.ViewSubmissionComponent, drawer_component_1.DrawerComponent],
                        pipes: [time_ago_pipe_1.TimeAgoPipe, ng2_translate_1.TranslatePipe]
                    }),
                    router_deprecated_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof submission_service_1.SubmissionService !== 'undefined' && submission_service_1.SubmissionService) === 'function' && _a) || Object, router_deprecated_1.Router])
                ], SubmissionsComponent);
                return SubmissionsComponent;
                var _a;
            }());
            exports_1("SubmissionsComponent", SubmissionsComponent);
        }
    }
});

//# sourceMappingURL=submissions.component.js.map
