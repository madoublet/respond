System.register(['@angular/platform-browser-dynamic', '@angular/core', '@angular/http', './app.component', 'angular2-jwt/angular2-jwt', 'ng2-translate/ng2-translate', 'rxjs/add/operator/map'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, core_1, http_1, app_component_1, angular2_jwt_1, ng2_translate_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (angular2_jwt_1_1) {
                angular2_jwt_1 = angular2_jwt_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            },
            function (_1) {}],
        execute: function() {
            // enableProdMode();
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
                http_1.HTTP_PROVIDERS,
                ng2_translate_1.TRANSLATE_PROVIDERS,
                core_1.provide(angular2_jwt_1.AuthConfig, { useValue: new angular2_jwt_1.AuthConfig({
                        headerName: 'X-AUTH'
                    }) }),
                core_1.provide(angular2_jwt_1.AuthHttp, {
                    useFactory: function (http) {
                        return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
                            headerName: 'X-AUTH'
                        }), http);
                    },
                    deps: [http_1.Http]
                }),
                angular2_jwt_1.AuthHttp
            ]);
        }
    }
});
//# sourceMappingURL=main.js.map