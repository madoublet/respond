(function() {
    
    angular.module('respond.factories')
    
    .factory('Editor', function($http, Setup){
	
		var editor = {};
		
		// retrieve editor menu
		editor.list = function(callback){
		
			// post to API
			$http.get('data/editor.json', {cache:true})
				.success(callback);
		}
		
		return editor;
		
	})

	
})();