(function() {
    
    angular.module('respond.factories')
    
    .factory('Snippet', function($http, Setup){
	
		var snippet = {};
		
		// retrieve themes
		snippet.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/snippet')
				.success(callback);
		}
			
		// retrieves content for a snippet
		snippet.content = function(snippet, callback){
		
			// set params
			var params = {
				snippet: snippet
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/snippet/content', $.param(params))
				.success(callback);
		}
			
		return snippet;
		
	})


})();