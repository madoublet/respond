(function() {
    
    angular.module('respond.factories')
    
    .factory('authInterceptor', function ($rootScope, $q, $window, $location) {
		return {
			request:function (config) {
				config.headers = config.headers || {};
				if($window.sessionStorage.token){
					config.headers['X-Auth'] = 'Bearer ' + $window.sessionStorage.token;
				}
				
				return config || $q.when(config);
			},
		
			responseError:function(rejection){
				
				if(rejection.status === 401){
					
					// if a request is not authorized, set token to null and logout
					$window.sessionStorage.token = null;
					
					$location.path('login/' + $window.sessionStorage.loginId);
					
				}
				
				return $q.reject(rejection);
			}
		};
	})
	
})();