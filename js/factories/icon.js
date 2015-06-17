(function() {
    
    angular.module('respond.factories')
    
    .factory('Icon', function($http, Setup){
	
		var icon = {};
		
		// retrieve icons
		icon.list = function(callback){
		
			// post to API
			$http.get('data/icons.json', {cache:true})
				.success(callback);
		}
		
		return icon;
		
	})
	
})();