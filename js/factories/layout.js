(function() {
    
    angular.module('respond.factories')
    
    .factory('Layout', function($http, Setup){
		
		var layout = {};
		layout.data = [];
		
		// retrieve layouts
		layout.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/layout/list')
				.then(function(res){
				
					// set data for factory
					layout.data = res.data;
					return layout.data;
					
				})
				.then(callback);
		}
		
		// retrieves content for a layout
		layout.retrieve = function(name, callback){
		
			// set params
			var params = {name: name};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/layout/retrieve', $.param(params))
				.success(callback);
		}
		
		// add a layout
		layout.add = function(toBeAdded, callback){
			
			// set params
			var params = {
				name: toBeAdded};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/layout/add', $.param(params))
				.then(function(res){
					
					// push data to factory
					layout.data.push(toBeAdded);
					
				})
				.then(callback);
		}
		
		// publishes a layout
		layout.publish = function(name, content, callback){
			
			// set params
			var params = {
				name: name,
				content: content};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/layout/publish', $.param(params))
				.success(callback);
		}
		
		// removes a menuitem
		layout.remove = function(toBeRemoved, callback){
		
			// set params
			var params = {
				name: toBeRemoved
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/layout/remove', $.param(params))
				.then(function(res){
					
					var i = layout.getIndexById(toBeRemoved);
					if(i !== -1)layout.data.splice(i, 1);
					
					return;
				})
				.then(callback);
		}
		
		// get the index by id
		layout.getIndexById = function(id){
		
			var data = layout.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x] == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return layout;
		
	})

	
})();