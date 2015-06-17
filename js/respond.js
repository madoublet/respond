// setup helper modules
angular.module('respond.controllers', []);
angular.module('respond.factories', []);
angular.module('respond.directives', []);

// set application module
angular.module('respond', ['ui.router', 
	'ui.codemirror',
	'respond.setup',
	'respond.controllers',
	'respond.factories',
	'respond.directives',
	'respond.filters',
	'jm.i18next'])
	
// disable header during development
.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}])

// configure the module
.config(function($stateProvider, $locationProvider, $urlRouterProvider, $i18nextProvider, $httpProvider, Setup) {

	var lang = Setup.language;

	// retrieve user from session storage
	if(sessionStorage.user != null){
		var user = JSON.parse(sessionStorage.user);
		
		if(user != null){
			lang = user.Language;
		}
	}

	// config $il8nextProvider
	$i18nextProvider.options = {
        lng: lang,
        getAsync : false,
        useCookie: false,
        useLocalStorage: false,
        fallbackLng: Setup.language,
        resGetPath: 'locales/__lng__/__ns__.json'
    };
	
	// set language for moment
	moment.lang(lang);
	
	// set authInterceptor
	$httpProvider.interceptors.push('authInterceptor');
	
	// set html5 mode #HTML5MODE
	if(Setup.urlMode.toUpperCase() == 'HTML5'){
		$locationProvider.html5Mode(true);
	}
	
	// set states
	$stateProvider
		.state('login', {
		  url: "/login/:id",
		  templateUrl: "templates/login.html",
		  controller: 'LoginCtrl'
		})
		
		.state('info', {
		  url: "/info/:id",
		  templateUrl: "templates/info.html",
		  controller: 'InfoCtrl'
		})
		
		.state('forgot', {
		  url: "/forgot/:id",
		  templateUrl: "templates/forgot.html",
		  controller: 'ForgotCtrl'
		})
		
		.state('reset', {
		  url: "/reset/:id/:token",
		  templateUrl: "templates/reset.html",
		  controller: 'ResetCtrl'
		})
		
		.state('create', {
		  url: "/create",
		  templateUrl: "templates/create.html",
		  controller: 'CreateCtrl'
		})
		
		.state('app', {
		  url: "/app",
		  templateUrl: "templates/menu.html",
		  controller: 'MenuCtrl'
		})
		
		.state('app.pages', {
		  url: "/pages",
		  views: {
		    'content' :{
		      templateUrl: "templates/pages.html",
		      controller: 'PagesCtrl'
		    }
		  }
		})
		
		.state('app.content', {
		  url: "/content/:id",
		  views: {
		    'content' :{
		      templateUrl: "templates/content.html",
		      controller: 'ContentCtrl'
		    }
		  }
		})
		
		.state('app.menus', {
		  url: "/menus",
		  views: {
		    'content' :{
		      templateUrl: "templates/menus.html",
		      controller: 'MenusCtrl'
		    }
		  }
		})
		
		.state('app.layouts', {
		  url: "/layouts",
		  views: {
		    'content' :{
		      templateUrl: "templates/layouts.html",
		      controller: 'LayoutsCtrl'
		    }
		  }
		})
		
		.state('app.styles', {
		  url: "/styles",
		  views: {
		    'content' :{
		      templateUrl: "templates/styles.html",
		      controller: 'StylesCtrl'
		    }
		  }
		})
		
		.state('app.settings', {
		  url: "/settings",
		  views: {
		    'content' :{
		      templateUrl: "templates/settings.html",
		      controller: 'SettingsCtrl'
		    }
		  }
		})
		
		.state('app.theme', {
		  url: "/theme",
		  views: {
		    'content' :{
		      templateUrl: "templates/theme.html",
		      controller: 'ThemeCtrl'
		    }
		  }
		})
		
		.state('app.branding', {
		  url: "/branding",
		  views: {
		    'content' :{
		      templateUrl: "templates/branding.html",
		      controller: 'BrandingCtrl'
		    }
		  }
		})
		
		.state('app.files', {
		  url: "/files",
		  views: {
		    'content' :{
		      templateUrl: "templates/files.html",
		      controller: 'FilesCtrl'
		    }
		  }
		})
		
		.state('app.users', {
		  url: "/users",
		  views: {
		    'content' :{
		      templateUrl: "templates/users.html",
		      controller: 'UsersCtrl'
		    }
		  }
		})
		
		.state('app.profile', {
		  url: "/profile",
		  views: {
		    'content' :{
		      templateUrl: "templates/profile.html",
		      controller: 'ProfileCtrl'
		    }
		  }
		})
		
		.state('app.roles', {
		  url: "/roles",
		  views: {
		    'content' :{
		      templateUrl: "templates/roles.html",
		      controller: 'RolesCtrl'
		    }
		  }
		})
		
		.state('app.scripts', {
		  url: "/scripts",
		  views: {
		    'content' :{
		      templateUrl: "templates/scripts.html",
		      controller: 'ScriptsCtrl'
		    }
		  }
		})
		
		.state('app.translations', {
		  url: "/translations",
		  views: {
		    'content' :{
		      templateUrl: "templates/translations.html",
		      controller: 'TranslationsCtrl'
		    }
		  }
		})
		
		.state('app.signup', {
		  url: "/signup",
		  views: {
		    'content' :{
		      templateUrl: "templates/signup.html",
		      controller: 'SignupCtrl'
		    }
		  }
		})
		
		.state('app.thankyou', {
		  url: "/thankyou",
		  views: {
		    'content' :{
		      templateUrl: "templates/thankyou.html",
		      controller: 'ThankyouCtrl'
		    }
		  }
		})
		
		.state('app.account', {
		  url: "/account",
		  views: {
		    'content' :{
		      templateUrl: "templates/account.html",
		      controller: 'AccountCtrl'
		    }
		  }
		})
		
		.state('app.admin', {
		  url: "/admin",
		  views: {
		    'content' :{
		      templateUrl: "templates/admin.html",
		      controller: 'AdminCtrl'
		    }
		  }
		})
		
		.state('app.configure', {
		  url: "/configure",
		  views: {
		    'content' :{
		      templateUrl: "templates/configure.html",
		      controller: 'ConfigureCtrl'
		    }
		  }
		});
	
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/create');
  
})

.run(function($rootScope, $i18next, $window, Setup, $sce, Site) {

	// set app title
	$rootScope.title = Setup.app;
	$rootScope.direction = Setup.direction;
	$rootScope.css = Setup.css;
	$rootScope.urlMode = Setup.urlMode;
	$rootScope.firstLogin = false;
	$rootScope.introShown = true;
	
	// retrieve site from session storage
	if($window.sessionStorage.site != null){
	
		var str = $window.sessionStorage.site;
		
		$rootScope.site = JSON.parse(str);
	}
	
	// retrieve user from session storage
	if($window.sessionStorage.user != null){
	
		var str = $window.sessionStorage.user;
		
		$rootScope.user = JSON.parse(str);
	}
	
	// retrieve editorItems from session storage
	if($window.sessionStorage.editorItems != null){
	
		var str = $window.sessionStorage.editorItems;
		var data = JSON.parse(str);
		
		$rootScope.editorItems = data;
		
		// set cache to true so it won't reload scripts
		$.ajaxSetup({
		    cache: true
		});
		
		// holds loaded scripts
		var loaded = [];
		
		// load scripts for all plugins
		for(x=0; x<data.length; x++){
		
			if(data[x].script != undefined){
				var url = Setup.url + '/' + data[x].script;
				
				if(loaded.indexOf(url) == -1){
					$.getScript(url);
					loaded.push(url);
					if(Setup.debug)console.log('[respond.debug] load plugin script='+url);
				}
			}
			
		}
	}
		
});

function initialize(){};

