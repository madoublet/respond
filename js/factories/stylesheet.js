(function() {
    
    angular.module('respond.factories')
    
    .factory('Stylesheet', function($http, Setup){
	
		var stylesheet = {};
		stylesheet.data = [];
		
		// retrieve layouts
		stylesheet.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/stylesheet/list')
				.then(function(res){
				
					// set data for factory
					stylesheet.data = res.data;
					return stylesheet.data;
					
				})
				.then(callback);
		}
		
		// retrieves content for a stylesheet
		stylesheet.retrieve = function(name, callback){
		
			// set params
			var params = {name: name};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/stylesheet/retrieve', $.param(params))
				.success(callback);
		}
		
		// add a stylesheet
		stylesheet.add = function(toBeAdded, callback){
			
			// set params
			var params = {
				name: toBeAdded};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/stylesheet/add', $.param(params))
				.then(function(res){
					
					// push data to factory
					stylesheet.data.push(toBeAdded);
					
				})
				.then(callback);
		}
		
		// publishes a stylesheet
		stylesheet.publish = function(name, content, successCallback, failureCallback){
			
			// set params
			var params = {
				name: name,
				content: content};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/stylesheet/publish', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// removes a stylesheet
		stylesheet.remove = function(toBeRemoved, callback){
		
			// set params
			var params = {
				name: toBeRemoved
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/stylesheet/remove', $.param(params))
				.then(function(res){
					
					var i = stylesheet.getIndexById(toBeRemoved);
					if(i !== -1)stylesheet.data.splice(i, 1);
					
					return;
				})
				.then(callback);
		}
		
		// get the index by id
		stylesheet.getIndexById = function(id){
		
			var data = stylesheet.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x] == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return stylesheet;
		
	})
	
})();