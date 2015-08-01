(function() {
    
    angular.module('respond.factories')
    
    .factory('User', function($http, $window, $cacheFactory, Setup){
	
		var user = {};
		user.data = [];
		
		// login API call
		user.login = function(email, password, friendlyId, successCallback, failureCallback){
		
			// remove all cache on login
			var $cache = $cacheFactory.get('$http');
			$cache.removeAll();
		
			// set params
			var params = {
				email: email,
				password: password,
				friendlyId: friendlyId
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/login', $.param(params))
				.success(successCallback)
				.error(failureCallback);
				
		}
		
		// forgot API call
		user.forgot = function(email, friendlyId, successCallback, failureCallback){
		
			// set params
			var params = {
				email: email,
				friendlyId: friendlyId
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/forgot', $.param(params))
				.success(successCallback)
				.error(failureCallback);
				
		}
		
		// reset API call
		user.reset = function(token, password, friendlyId, successCallback, failureCallback){
		
			// set params
			var params = {
				token: token,
				password: password,
				friendlyId: friendlyId
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/reset', $.param(params))
				.success(successCallback)
				.error(failureCallback);
				
		}
		
		// add a user
		user.add = function(toBeAdded, callback){
			
			// set params
			var params = {
				firstName: toBeAdded.FirstName, 
				lastName: toBeAdded.LastName, 
				role: toBeAdded.Role, 
				language: toBeAdded.Language, 
				isActive: toBeAdded.IsActive, 
				email: toBeAdded.Email, 
				password: toBeAdded.Password};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/add', $.param(params))
				.then(function(res){
					
					// push data to factory
					user.data.push(res.data);
					
					return res.data;
					
				})
				.then(callback);
		}
		
		// edits a user
		user.edit = function(toBeEdited, callback){
		
			// set params
			var params = {
				userId: toBeEdited.UserId,
				firstName: toBeEdited.FirstName, 
				lastName: toBeEdited.LastName, 
				role: toBeEdited.Role, 
				language: toBeEdited.Language, 
				isActive: toBeEdited.IsActive, 
				email: toBeEdited.Email, 
				password: toBeEdited.Password};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/edit', $.param(params))
				.success(callback);
		}
		
		// edits a user's profile
		user.editProfile = function(toBeEdited, callback){
		
			// set params
			var params = {
				userId: toBeEdited.UserId,
				firstName: toBeEdited.FirstName, 
				lastName: toBeEdited.LastName, 
				language: toBeEdited.Language, 
				email: toBeEdited.Email, 
				password: toBeEdited.Password};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/edit', $.param(params))
				.success(callback);
		}
		
		// removes a user
		user.remove = function(toBeRemoved, callback){
		
			// set params
			var params = {
				userId: toBeRemoved.UserId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/remove', $.param(params))
				.then(function(res){
					
					var i = user.getIndexById(toBeRemoved.UserId);
					if(i !== -1)user.data.splice(i, 1);
					
				})
				.then(callback);
		}
		
		// retrieve a list of users for a site
		user.list = function(callback){
		
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/user/list/')
				.then(function(res){
				
					// set data for factory
					user.data = res.data;
					return user.data;
					
				})
				.then(callback);
		}
		
		// adds a profile image for the user
		user.addImage = function(userId, image, callback){
			
			// set params
			var params = {
				userId: userId, 
				photoUrl:image.filename
				};
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/user/photo/', $.param(params))
				.then(function(res){
					// set data
					var i = user.getIndexById(userId);
					user.data[i].HasPhoto = true;
					user.data[i].FullPhotoUrl = res.data;
				})
				.then(callback);
			
		}
		
		// get the index by id
		user.getIndexById = function(id){
		
			var data = user.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].UserId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return user;
		
	})
	
})();