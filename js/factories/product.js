(function() {
    
    angular.module('respond.factories')
    
    .factory('Product', function($http, Setup){
	
		var product = {};
			
		// retrieve version
		product.retrieve = function(productId, callback){
		
			// set params
			var params = {
					productId: productId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/product/retrieve', $.param(params))
				.success(callback);
		}
		
		// adds a product
		product.add = function(product, pageId, callback){
			
			// set params
			var params = {productId: product.productId, 
							sku: product.sku, 
							pageId: pageId, 
							name: product.name,
							price: product.price,
							shipping: product.shipping,
							weight: product.weight,
							download: product.download};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/product/add', $.param(params))
				.success(callback);
			
		}
		
		// removes products for a given page
		product.clear = function(pageId, callback){
			
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/product/clear', $.param(params))
				.success(callback);
			
		}	
		
		return product;	
	})

})();