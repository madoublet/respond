// respond app
// respond.controllers 	-> js/respond.controllers.js
// respond.factories 	-> js/respond.factories.js
// respond.directives	-> js/respond.directives.js
angular.module('respond.site', ['ui.router', 'respond.site.controllers', 'respond.site.factories', 'respond.site.directives', 'jm.i18next'])

// disable header during development
.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $i18nextProvider, $httpProvider) {

	// config $il8nextProvider
	$i18nextProvider.options = {
        lng: '{{language}}',
        useCookie: false,
        useLocalStorage: false,
        fallbackLng: 'en',
        resGetPath: 'locales/__lng__/__ns__.json'
    };

	// set authInterceptor
	$httpProvider.interceptors.push('authInterceptor');
	
	// set html5 mode
	{{html5mode}}

	$stateProvider

  	// #begin states
  	{{states}};
  	// #end states
    
  	// if none of the above states are matched, use this as the fallback
  	$urlRouterProvider.otherwise('index');
  	
})

.run(function($rootScope, $i18next, $window, Site) {
	
	// get cart from sessionStorage
	if(sessionStorage['respond-cart'] != null){
		var str = sessionStorage['respond-cart'];

		$rootScope.cart = eval(str);
	}
	else{
		$rootScope.cart = [];
	}
	
	// init user
	$rootScope.user = null;
	
	// set user from session storage
	if($window.sessionStorage.user != null){
	
		var str = $window.sessionStorage.user;
		$rootScope.user = JSON.parse(str);
		
	}

});

