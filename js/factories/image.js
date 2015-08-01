(function() {
    
    angular.module('respond.factories')
    
    .factory('Image', function($http, $cacheFactory, Setup){
	
		var image = {};
		image.data = [];
		image.updates = [];
		
		// invalidate cache
		image.invalidateCache = function(){
			
			var $cache = $cacheFactory.get('$http');
			$cache.remove(Setup.api + '/image/list/all');
			
		}
		
		// retrieve images
		image.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/image/list/all', {cache:true})
				.then(function(res){
					// set data for factory
					image.data = res.data;
					return image.data;
				})
				.then(callback);
		}
		
		return image;
		
	})
	
})();