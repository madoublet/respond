(function() {
    
    angular.module('respond.factories')
    
    .factory('App', function($http, Setup){
	
		var app = {};
		app.data = [];
		
		// validate email for a site
		app.validatePasscode = function(passcode, successCallback, failureCallback){
		
			// set params
			var params = {
				passcode: passcode
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/app/validate/passcode', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// installs the application
		app.install = function(appurl, dbname, dbuser, dbpass, successCallback, failureCallback){
		
			// set params
			var params = {
				appurl: appurl,
				dbname: dbname,
				dbuser: dbuser,
				dbpass: dbpass
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/app/install', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		return app;
		
	})
	
})();