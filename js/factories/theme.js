(function() {
    
    angular.module('respond.factories')
    
    .factory('Theme', function($http, Setup){
	
		var theme = {};
		
		// retrieve themes
		theme.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/theme')
				.success(callback);
		}
		
		// retrieve pages for theme
		theme.listPages = function(callback){
		
			// post to API
			$http.get(Setup.api + '/theme/pages/list')
				.success(callback);
		}
		
		// retrieve configurations for theme
		theme.listConfigurations = function(callback){
		
			// post to API
			$http.get(Setup.api + '/theme/configurations/list')
				.success(callback);
		}
		
		// applies configurations to a theme
		theme.applyConfigurations = function(configurations, callback){
		
			// set params
			var params = {
				configurations: configurations
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/theme/configurations/apply', $.param(params))
				.success(callback);
		}
		
		// applies a theme
		theme.apply = function(theme, replaceContent, callback){
		
			// set params
			var params = {
				theme: theme,
				replaceContent: replaceContent
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/theme/apply', $.param(params))
				.success(callback);
		}
		
		// resets a theme
		theme.reset = function(theme, callback){
		
			// set params
			var params = {
				theme: theme
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/theme/reset', $.param(params))
				.success(callback);
		}
		
		return theme;
		
	})
	
})();