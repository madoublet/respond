(function() {
    
    angular.module('respond.factories')
    
    .factory('Version', function($http, Setup){
		
		var version = {};
		version.data = [];
			
		// retrieve version
		version.retrieve = function(versionId, callback){
		
			// set params
			var params = {
					versionId: versionId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/version/retrieve', $.param(params))
				.success(callback);
		}
		
		// saves a version
		version.save = function(pageId, content, callback){
			
			// set params
			var params = {pageId: pageId, content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/version/add', $.param(params))
				.success(callback);
			
		}
		
		// lists versions for a page
		version.list = function(pageId, callback){
			
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/version/list', $.param(params))
				.then(function(res){
				
					// set data for factory
					version.data = res.data;
					return version.data;
					
				})
				.then(callback);
			
		}	
		
		return version;	
	})

	
})();