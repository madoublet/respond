(function() {
    
    angular.module('respond.factories')
    
    .factory('Currency', function($http, Setup){
	
		var currency = {};
		
		// retrieve currencies
		currency.list = function(callback){
		
			// post to API
			$http.get('data/currencies.json', {cache:true})
				.success(callback);
		}
		
		return currency;
		
	})

	
})();