(function() {
    
    angular.module('respond.factories')
    
    .factory('PageType', function($http, $cacheFactory, Setup){
	
		// init
		var pageType = {};
		pageType.data = [];
		
		// invalidate cache
		pageType.invalidateCache = function(){
			
			var $cache = $cacheFactory.get('$http');
			$cache.remove(Setup.api + '/pagetype/list/allowed');
			$cache.remove(Setup.api + '/pagetype/list/all');
			
		}
		
		// add a pagetype
		pageType.add = function(toBeAdded, successCallback, failureCallback){
			
			// get friendlyId
			var friendlyId = toBeAdded.FriendlyId;
			
			// remove leading / (if exists)
			if(friendlyId.charAt(0) == "/"){
				friendlyId = friendlyId.substr(1);
			}
			
			// remove trailing / (if exists)
			if(friendlyId.charAt(friendlyId.length - 1) == "/"){
				friendlyId = friendlyId.substr(0, friendlyId.length - 1);
			}
			
			// set params
			var params = {
				friendlyId: friendlyId,
				layout: toBeAdded.Layout, 
				stylesheet: toBeAdded.Stylesheet, 
				isSecure: toBeAdded.IsSecure};
			
			// set page type	
			if(toBeAdded.PageTypeId != ''){
				params['pageTypeId'] = toBeAdded.PageTypeId;
			}
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/pagetype/add', $.param(params))
				.then(function(res){
				
					// push data to factory
					pageType.data.push(res.data);
					
					return;
				}, failureCallback)
				.then(successCallback);
	
				
			// invalidate cache
			pageType.invalidateCache();
		}
		
		// edit a pagetype
		pageType.edit = function(toBeEdited){
		
			// set params
			var params = {
				pageTypeId: toBeEdited.PageTypeId, 
				typeS: toBeEdited.TypeS, 
				typeP: toBeEdited.TypeP, 
				layout: toBeEdited.Layout, 
				stylesheet: toBeEdited.Stylesheet, 
				isSecure: toBeEdited.IsSecure};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/pagetype/edit', $.param(params))
				.then(function(res){});
			
			// invalidate cache
			pageType.invalidateCache();
		}
		
		// removes a pagetype
		pageType.remove = function(toBeRemoved){
		
			// set params
			var params = {
				pageTypeId: toBeRemoved.PageTypeId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/pagetype/remove', $.param(params))
				.then(function(res){
					
					var i = pageType.getIndexById(toBeRemoved.PageTypeId);
					if(i !== -1)pageType.data.splice(i, 1);
					
				});
				
			// invalidate cache
			pageType.invalidateCache();
		}
		
		// retrieve allowed pagetypes
		pageType.listAllowed = function(callback){
	
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/pagetype/list/allowed', {cache:true})
				.then(function(res){
					// set data for factory
					pageType.data = res.data;
					return pageType.data;
				})
				.then(callback);
		}
		
		// retrieve allowed pagetypes
		pageType.list = function(callback){
		
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/pagetype/list/all', {cache:true})
				.then(function(res){
				
					// set data for factory
					pageType.data = res.data;
					return pageType.data;
					
				})
				.then(callback);
		}
		
		// get the index by id
		pageType.getIndexById = function(id){
		
			var data = pageType.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].PageTypeId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return pageType;
		
	})

	
})();