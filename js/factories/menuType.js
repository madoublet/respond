(function() {
    
    angular.module('respond.factories')
    
    .factory('MenuType', function($http, Setup){
	
		// init
		var menuType = {};
		menuType.data = [];
		
		// add a menutype
		menuType.add = function(toBeAdded){
			
			// set menutype
			var params = {
				friendlyId: toBeAdded.FriendlyId,
				name: toBeAdded.Name};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menutype/add', $.param(params))
				.then(function(res){
					
					// push data to factory
					menuType.data.push(res.data);
					
				});
		}
		
		// removes a menutype
		menuType.remove = function(toBeRemoved, callback){
		
			// set params
			var params = {
				menuTypeId: toBeRemoved.MenuTypeId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menutype/remove', $.param(params))
				.then(function(res){
					
					var i = menuType.getIndexById(toBeRemoved.MenuTypeId);
					if(i !== -1)menuType.data.splice(i, 1);
					
					return;
				})
				.then(callback);
		}
		
		// retrieve allowed menutypes
		menuType.list = function(callback){
		
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/menutype/list')
				.then(function(res){
				
					// set data for factory
					menuType.data = res.data;
					return menuType.data;
					
				})
				.then(callback);
		}
		
		// get the index by id
		menuType.getIndexById = function(id){
		
			var data = menuType.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].MenuTypeId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return menuType;
		
	})
	
})();