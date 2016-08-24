(function(global) {

  // map tells the System loader where to look for things
  var map = {
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
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  };

  var packageNames = [    
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade'
    
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', map: 'dev/libs/@angular/'+pkgName, defaultExtension: 'js' };
  });

  var config = {
    defaultJSExtensions: true,
    map: map,
    packages: packages
  }

  System.config(config);

})(this);