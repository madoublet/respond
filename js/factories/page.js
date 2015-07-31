(function() {
    
    angular.module('respond.factories')
    
    .factory('Page', function($http, $cacheFactory, Setup){
	
		var page = {};
		page.data = [];
		
		// invalidate cache
		page.invalidateCache = function(){
			
			var $cache = $cacheFactory.get('$http');
			$cache.remove(Setup.api + '/page/list/allowed');
			$cache.remove(Setup.api + '/page/list/all');
			
		}
		
		// retrieve allowed pages
		page.listAllowed = function(callback){
		
			// post to API
			$http.get(Setup.api + '/page/list/allowed', {cache:true})
				.then(function(res){
					// set data for factory
					page.data = res.data;
					return page.data;
				})
				.then(callback);
		}
		
		// retrieve all pages
		page.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/page/list/all', {cache:true})
				.then(function(res){
					// set data for factory
					page.data = res.data;
					return page.data;
				})
				.then(callback);
		}
		
		// retrieve page
		page.retrieve = function(pageId, callback){
		
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/page/retrieve/', $.param(params))
				.success(callback);
				
		}
		
		// retrieve page
		page.retrieveExtended = function(pageId, offset, callback){
		
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/page/retrieve/', $.param(params))
				.then(function(res){
				
					var result = res.data;
					
					// get dates and locations
					result.LocalBeginDate = utilities.convertToLocalDate(result.BeginDate, offset);
					result.LocalBeginTime = utilities.convertToLocalTime(result.BeginDate, offset);
					result.LocalEndDate = utilities.convertToLocalDate(result.EndDate, offset);
					result.LocalEndTime = utilities.convertToLocalTime(result.EndDate, offset);
					
					// parse latitude and longitude
					result.Latitude = utilities.parseLatitude(result.LatLong);
					result.Longitude = utilities.parseLongitude(result.LatLong);
					
					return result;
				})
				.then(callback);
				
		}
		
		// retrieve content for a page
		page.retrieveContent = function(pageId, callback){
		
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/page/retrieve/content/', $.param(params))
				.success(callback);
		}
		
		// save content
		page.saveContent = function(pageId, content, image, status, callback){
			
			// set params
			var params = {pageId: pageId, content: content, status: status, image:image};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/page/content/save', $.param(params))
				.success(callback);
				
			// invalidate cache
			page.invalidateCache();
		}
		
		// retrieve content
		page.retrieveContent = function(pageId, callback){
			
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/page/content/retrieve', $.param(params))
				.success(callback);
			
		}
		
		// reverts a draft
		page.revertDraft = function(pageId, callback){
			
			// set params
			var params = {pageId: pageId};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/page/content/revert', $.param(params))
				.success(callback);
			
		}
		
		// save settings
		page.saveSettings = function(pageId, name, friendlyId, description, keywords, callout, layout, stylesheet, includeOnly,
										beginDate, endDate, location, latitude, longitude, callback){
			
			// set params
			var params = {pageId: pageId, name: name, friendlyId: friendlyId, description: description, keywords: keywords, 
					   		callout: callout,  layout: layout, stylesheet: stylesheet, includeOnly: includeOnly,
					   		beginDate: beginDate, endDate: endDate,
					   		location: location, latitude: latitude, longitude: longitude};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			message.showMessage('progress');
	
			// post to API
			$http.post(Setup.api + '/page/save', $.param(params))
				.then(function(res){
					message.showMessage('success');
					return res.data;
				})
				.then(callback);
			
		}
		
		// edits tags
		page.editTags = function(toBeEdited, successCallback, failureCallback){
		
			// set params
			var params = {
				pageId: toBeEdited.PageId, 
				tags: toBeEdited.Tags};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/page/edit/tags', $.param(params))
				.success(successCallback)
				.error(failureCallback);
				
			// invalidate cache
			page.invalidateCache();
				
		}
		
		// add page
		page.add = function(pageTypeId, toBeAdded, successCallback, failureCallback){
		
			// set params
			var params = {
				pageTypeId: pageTypeId, 
				name: toBeAdded.Name, 
				friendlyId: toBeAdded.FriendlyId, 
				description: toBeAdded.Description};
				
			// set page type	
			if(toBeAdded.PageId != ''){
				params['pageId'] = toBeAdded.PageId;
			}
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/page/add', $.param(params))
				.then(function(res){
					page.data.push(res.data);
					
					return;
				}, failureCallback)
				.then(successCallback);
			
			// invalidate cache
			page.invalidateCache();
		}
		
		// remove page
		page.remove = function(toBeRemoved, successCallback, failureCallback){
			
			// set params
			var params = {
				pageId: toBeRemoved.PageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/page/remove', $.param(params))
				.then(function(res){
					var i = page.getIndexById(toBeRemoved.PageId);
					if(i !== -1)page.data.splice(i, 1);
					
					return;
				}, failureCallback)
				.then(successCallback);
			
			// invalidate cache
			page.invalidateCache();
		}
		
		// toggle published
		page.togglePublished = function(toBeEdited, successCallback, failureCallback){
			
			// set params
			var params = {
				pageId: toBeEdited.PageId};
							
			var url = Setup.api + '/page/publish'
			
			if(toBeEdited.IsActive == 1){
				url = Setup.api + '/page/unpublish'
			}
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(url, $.param(params))
				.then(function(res){
					
					if(toBeEdited.IsActive == 1){
						toBeEdited.IsActive = 0;
					}
					else{
						toBeEdited.IsActive = 1;
					}
					
					return;
				}, failureCallback)
				.then(successCallback);
			
			// invalidate cache
			page.invalidateCache();
			
		}
		
		// generates a preview for a page
		page.preview = function(pageId, content, callback){
		
			// set params
			var params = {pageId: pageId, content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/page/content/preview', $.param(params))
				.success(callback);
		}
		
		// get the index by id
		page.getIndexById = function(id){
		
			var data = page.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].PageId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return page;
		
	})

	
})();