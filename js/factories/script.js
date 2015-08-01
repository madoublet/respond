(function() {
    
    angular.module('respond.factories')
    
    .factory('Script', function($http, Setup){
	
		var script = {};
		script.data = [];
		
		// retrieve layouts
		script.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/script/list')
				.then(function(res){
				
					// set data for factory
					script.data = res.data;
					return script.data;
					
				})
				.then(callback);
		}
		
		// retrieves content for a script
		script.retrieve = function(name, callback){
		
			// set params
			var params = {name: name};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/script/retrieve', $.param(params))
				.success(callback);
		}
		
		// add a script
		script.add = function(toBeAdded, callback){
			
			// set params
			var params = {
				name: toBeAdded};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/script/add', $.param(params))
				.then(function(res){
					
					// push data to factory
					script.data.push(toBeAdded);
					
				})
				.then(callback);
		}
		
		// publishes a script
		script.publish = function(name, content, callback){
			
			// set params
			var params = {
				name: name,
				content: content};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/script/publish', $.param(params))
				.success(callback);
		}
		
		// removes a menuitem
		script.remove = function(toBeRemoved, callback){
		
			// set params
			var params = {
				name: toBeRemoved
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/script/remove', $.param(params))
				.then(function(res){
					
					var i = script.getIndexById(toBeRemoved);
					if(i !== -1)script.data.splice(i, 1);
					
					return;
				})
				.then(callback);
		}
		
		// get the index by id
		script.getIndexById = function(id){
		
			var data = script.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x] == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return script;
		
	})


	
})();