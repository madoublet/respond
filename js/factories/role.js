(function() {
    
    angular.module('respond.factories')
    
    .factory('Role', function($http, Setup){
	
		var role = {};
		role.data = [];
		
		// add a role
		role.add = function(toBeAdded, callback){
			
			// set params
			var params = {
				name: toBeAdded.Name, 
				canView: toBeAdded.CanView, 
				canEdit: toBeAdded.CanEdit, 
				canPublish: toBeAdded.CanPublish, 
				canRemove: toBeAdded.CanRemove, 
				canCreate: toBeAdded.CanCreate};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/role/add', $.param(params))
				.then(function(res){
					// push data to factory
					role.data.push(res.data);
					
				})
				.then(callback);
		}
		
		// edits a role
		role.edit = function(toBeEdited, callback){
		
			// set params
			var params = {
				roleId: toBeEdited.RoleId,
				name: toBeEdited.Name, 
				canView: toBeEdited.CanView, 
				canEdit: toBeEdited.CanEdit, 
				canPublish: toBeEdited.CanPublish, 
				canRemove: toBeEdited.CanRemove, 
				canCreate: toBeEdited.CanCreate};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/role/edit', $.param(params))
				.success(callback);
		}
		
		// removes a role
		role.remove = function(toBeRemoved){
		
			// set params
			var params = {
				roleId: toBeRemoved.RoleId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/role/remove', $.param(params))
				.then(function(res){
					
					var i = role.getIndexById(toBeRemoved.RoleId);
					if(i !== -1)role.data.splice(i, 1);
					
				});
		}
		
		// retrieve a list of roles for a site
		role.list = function(callback){
		
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/role/list/')
				.then(function(res){
				
					// set data for factory
					role.data = res.data;
					return role.data;
					
				})
				.then(callback);
		}
	
		// get the index by id
		role.getIndexById = function(id){
		
			var data = role.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].RoleId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return role;
		
	})

	
})();