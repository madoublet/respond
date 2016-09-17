(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'ng2-translate/ng2-translate': 'dev/libs/ng2-translate/ng2-translate.js',
    'app':                         'app', // 'dist',
    'rxjs':                        'dev/libs/rxjs',
    'angular2-in-memory-web-api':  'dev/libs/angular2-in-memory-web-api',
    '@angular':                    'dev/libs/@angular',
    '@angular/core':                'dev/libs/@angular/core/bundles/core.umd.js',
    '@angular/common':              'dev/libs/@angular/common/bundles/common.umd.js',
    '@angular/compiler':            'dev/libs/@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser':    'dev/libs/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'dev/libs/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http':                'dev/libs/@angular/http/bundles/http.umd.js',
    '@angular/router':              'dev/libs/@angular/router/bundles/router.umd.js',
    '@angular/forms':               'dev/libs/@angular/forms/bundles/forms.umd.js',
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  };

  var config = {
    defaultJSExtensions: true,
    map: map,
    packages: packages
  }

  System.config(config);

})(this);