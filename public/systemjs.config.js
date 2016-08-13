(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'angular2-jwt/angular2-jwt':   'dev/libs/angular2-jwt.js',
    'ng2-translate/ng2-translate': 'dev/libs/ng2-translate/ng2-translate.js',
    'app':                         'app', // 'dist',
    'rxjs':                        'dev/libs/rxjs',
    'angular2-in-memory-web-api':  'dev/libs/angular2-in-memory-web-api',
    '@angular':                    'dev/libs/@angular'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
  };

  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/forms',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade',
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    defaultJSExtensions: true,
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);