(function() {
    
    angular.module('respond.factories')
    
    .factory('App', function($http, Setup){
	
		var app = {};
		app.data = [];
		
		// validate email for a site
		app.validatePasscode = function(passcode, successCallback, failureCallback){
		
			// set params
			var params = {
				passcode: passcode
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/app/validate/passcode', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// installs the application
		app.install = function(appurl, dbname, dbuser, dbpass, successCallback, failureCallback){
		
			// set params
			var params = {
				appurl: appurl,
				dbname: dbname,
				dbuser: dbuser,
				dbpass: dbpass
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/app/install', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		return app;
		
	})
	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('authInterceptor', function ($rootScope, $q, $window, $location) {
		return {
			request:function (config) {
				config.headers = config.headers || {};
				if($window.sessionStorage.token){
					config.headers['X-Auth'] = 'Bearer ' + $window.sessionStorage.token;
				}
				
				return config || $q.when(config);
			},
		
			responseError:function(rejection){
				
				if(rejection.status === 401){
					
					// if a request is not authorized, set token to null and logout
					$window.sessionStorage.token = null;
					
					$location.path('login/' + $window.sessionStorage.loginId);
					
				}
				
				return $q.reject(rejection);
			}
		};
	})
	
})();
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
(function() {
    
    angular.module('respond.factories')
    
    .factory('Editor', function($http, Setup){
	
		var editor = {};
		
		// retrieve editor menu
		editor.list = function(callback){
		
			// post to API
			$http.get('data/editor.json', {cache:true})
				.success(callback);
		}
		
		return editor;
		
	})

	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('File', function($http, $cacheFactory, Setup){
	
		var file = {};
		file.data = [];
		
		// invalidate cache
		file.invalidateCache = function(){
			
			var $cache = $cacheFactory.get('$http');
			$cache.remove(Setup.api + '/file/list');
			$cache.remove(Setup.api + '/download/list');
			$cache.remove(Setup.api + '/file/retrieve/size');
			$cache.remove(Setup.api + '/image/list/all');
			
		}
		
		// retrieve downloads
		file.listDownloads = function(callback){
		
			// post to API
			$http.get(Setup.api + '/download/list', {cache:true})
				.then(function(res){
					// set data for factory
					file.data = res.data;
					return file.data;
				})
				.then(callback);
		}
		
		
		// retrieve files
		file.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/file/list', {cache:true})
				.then(function(res){
					// set data for factory
					file.data = res.data;
					return file.data;
				})
				.then(callback);
		}
		
		// retrieve size of files
		file.retrieveSize = function(callback){
		
			// post to API
			$http.get(Setup.api + '/file/retrieve/size', {cache:true})
				.then(function(res){
					// set data for factory
					file.data = res.data;
					return file.data;
				})
				.then(callback);
		}
		
		// remove file
		file.remove = function(toBeRemoved, folder, callback){
		
			// set params
			var params = {
					filename: toBeRemoved.filename,
					folder: folder
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/file/remove', $.param(params))
				.then(function(res){
					
					var i = file.getIndexByFilename(toBeRemoved.filename);
					if(i !== -1)file.data.splice(i, 1);
					
					return;
				})
				.then(callback);
			
			// invalidate the cache
			file.invalidateCache();
		}
		
		// get the index by id
		file.getIndexByFilename = function(filename){
		
			var data = file.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].filename == filename){
					return x;
				}
				
			}
			
			return -1;
		}
		
		
		return file;
		
	})
	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('Icon', function($http, Setup){
	
		var icon = {};
		
		// retrieve icons
		icon.list = function(callback){
		
			// post to API
			$http.get('data/icons.json', {cache:true})
				.success(callback);
		}
		
		return icon;
		
	})
	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('Image', function($http, $cacheFactory, Setup){
	
		var image = {};
		image.data = [];
		image.updates = [];
		
		// invalidate cache
		image.invalidateCache = function(){
			
			var $cache = $cacheFactory.get('$http');
			$cache.remove(Setup.api + '/image/list/all');
			
		}
		
		// retrieve images
		image.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/image/list/all', {cache:true})
				.then(function(res){
					// set data for factory
					image.data = res.data;
					return image.data;
				})
				.then(callback);
		}
		
		return image;
		
	})
	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('Language', function($http, Setup){
	
		var language = {};
		
		// retrieve languages
		language.list = function(callback){
		
			// post to API
			$http.get('data/languages.json', {cache:true})
				.success(callback);
		}
		
		return language;
		
	})
	
})();
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
(function() {
    
    angular.module('respond.factories')
    
    .factory('MenuItem', function($http, Setup){
	
		// init
		var menuItem = {};
		menuItem.data = [];
		
		// add a menuitem
		menuItem.add = function(toBeAdded){
			
			// set params
			var params = {
				name: toBeAdded.Name,
				cssClass: toBeAdded.CssClass,
				type: toBeAdded.Type,
				url: toBeAdded.Url,
				pageId: toBeAdded.PageId,
				priority: toBeAdded.Priority};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menuitem/add', $.param(params))
				.then(function(res){
					
					// push data to factory
					menuItem.data.push(res.data);
					
				});
		}
		
		// edits a menuitem
		menuItem.edit = function(toBeEdited, callback){
			
			// set params
			var params = {
				menuItemId: toBeEdited.MenuItemId,
				name: toBeEdited.Name,
				cssClass: toBeEdited.CssClass,
				url: toBeEdited.Url,
				pageId: toBeEdited.PageId};
			
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menuitem/edit', $.param(params))
				.success(callback);
		}
		
		// removes a menuitem
		menuItem.remove = function(toBeRemoved, callback){
		
			// set params
			var params = {
				menuItemId: toBeRemoved.MenuItemId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menuitem/remove', $.param(params))
				.then(function(res){
					
					var i = menuItem.getIndexById(toBeRemoved.MenuItemId);
					if(i !== -1)menuItem.data.splice(i, 1);
					
					return;
				})
				.then(callback);
		}
		
		// toggles whether a menuItem is nested
		menuItem.toggleNested = function(toBeEdited, callback){
		
			// toggle isNested
			if(toBeEdited.IsNested == 1){
				isNested = 0;
			}
			else{
				isNested = 1;
			}
		
			// set params
			var params = {
				menuItemId: toBeEdited.MenuItemId,
				isNested: isNested
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menuitem/toggle/nested', $.param(params))
				.then(function(res){
					
					toBeEdited.IsNested = isNested;
					
					return;
				})
				.then(callback);
		}
		
		// retrieve all menu items
		menuItem.list = function(callback){
		
			// get list from API
			$http.get(Setup.api + '/menuitem/list/all')
				.then(function(res){
				
					// set data for factory
					menuItem.data = res.data;
					return menuItem.data;
					
				})
				.then(callback);
		}
		
		// sets the order for a menu item
		menuItem.setPriority = function(menuItemId, priority){
			
			var i = menuItem.getIndexById(menuItemId);
			menuItem.data[i].Priority = priority;
			
		}
		
		// saves the priority for menu items
		menuItem.savePriorities = function(priorities, callback){
		
			// set params
			var params = {
				priorities: JSON.stringify(priorities)
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menuitem/save/priorities', $.param(params))
				.success(callback);
		}
		
		// publishes the menu items for the site
		menuItem.publish = function(callback){
		
			// set params
			var params = {};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/menuitem/publish', $.param(params))
				.success(callback);
		}
		
		// get the index by id
		menuItem.getIndexById = function(id){
		
			var data = menuItem.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].MenuItemId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return menuItem;
		
	})
	
})();
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
(function() {
    
    angular.module('respond.factories')
    
    .factory('Site', function($http, Setup){
	
		var site = {};
		site.data = [];
		
		// retrieve site
		site.retrieve = function(callback){
		
			// set params
			var params = {};
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/site/retrieve/', $.param(params))
				.success(callback);
				
		}
		
		// validate friendlyId for a site
		site.validateFriendlyId = function(friendlyId, successCallback, failureCallback){
		
			// set params
			var params = {
				friendlyId: friendlyId
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/validate/id', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// validate email for a site
		site.validateEmail = function(email, successCallback, failureCallback){
		
			// set params
			var params = {
				email: email
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/validate/email', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// create a site
		site.create = function(friendlyId, name, email, password, passcode, timeZone, language, userLanguage, theme, 
			firstName, lastName,
			successCallback, failureCallback){
		
			// set params
			var params = {
				friendlyId: friendlyId, 
				name: name, 
				email: email, 
				password: password, 
				passcode: passcode,
				timeZone: timeZone, 
				language: language, 
				userLanguage: userLanguage, 
				theme: theme,
				firstName: firstName,
				lastName: lastName
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/create', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// publish a site
		site.publish = function(successCallback, failureCallback){
			
			// API call
			$http.get(Setup.api + '/site/publish')
				.success(successCallback)
				.error(failureCallback);
		}
		
		// deploys a site
		site.deploy = function(successCallback, failureCallback){
			
			// API call
			$http.get(Setup.api + '/site/deploy')
				.success(successCallback)
				.error(failureCallback);
		}
		
		// edits administrative
		site.editAdmin = function(site, successCallback, failureCallback){
				
			// set params
			var params = { 
				siteId: site.SiteId,
				domain: site.Domain,
				bucket: site.Bucket, 
				status: site.Status,
				userLimit: site.UserLimit,
				fileLimit: site.FileLimit
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/edit/admin', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// saves settings for the site
		site.save = function(site, successCallback, failureCallback){
		
			// set params
			var params = { 
				name: site.Name, 
				domain: site.Domain,
				primaryEmail: site.PrimaryEmail, 
				timeZone: site.TimeZone,
				language: site.Language,
				direction: site.Direction,
				currency: site.Currency,
				showCart: site.ShowCart,
				showSettings: site.ShowSettings,
				showLanguages: site.ShowLanguages,
				showLogin: site.ShowLogin,
				showSearch: site.ShowSearch,
				urlMode: site.UrlMode,
				weightUnit: site.WeightUnit,
				shippingCalculation: site.ShippingCalculation,
				shippingRate: site.ShippingRate,
				shippingTiers: site.ShippingTiers,
				taxRate: site.TaxRate,
				payPalId: site.PayPalId,
				payPalUseSandbox: site.PayPalUseSandbox,
				welcomeEmail: site.WelcomeEmail,
				receiptEmail: site.ReceiptEmail,
				isSMTP: site.IsSMTP,
				SMTPHost: site.SMTPHost,
				SMTPAuth: site.SMTPAuth,
				SMTPUsername: site.SMTPUsername,
				SMTPPassword: site.SMTPPassword,
				SMTPSecure: site.SMTPSecure,
				formPublicId: site.FormPublicId,
				formPrivateId: site.FormPrivateId,
				embeddedCodeHead: site.EmbeddedCodeHead,
				embeddedCodeBottom: site.EmbeddedCodeBottom
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/save', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// adds images for the site
		site.addImage = function(type, image, callback){
			
			// set params
			var params = { 
				url: image.filename, 
				type: type
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/branding/image', $.param(params))
				.success(callback);
			
		}
		
		// adds images for the site
		site.updateIconBg = function(color, callback){
			
			// set params
			var params = { 
				color: color
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/branding/icon/background', $.param(params))
				.success(callback);
			
		}
		
		// subscribe with Stripe payment provider
		site.subscribeWithStripe = function(token, plan, domain, successCallback, failureCallback){
			
			// set params
			var params = { 
				token: token,
				plan: plan,
				domain: domain
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/subscribe/stripe', $.param(params))
				.success(successCallback)
				.error(failureCallback);
			
		}
	
		// retrieve a list of sites
		site.list = function(callback){
		
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/site/list/all')
				.then(function(res){
				
					// set data for factory
					site.data = res.data;
					return site.data;
					
				})
				.then(callback);
		}
		
		// removes a site
		site.remove = function(toBeRemoved, successCallback, failureCallback){
			
			// set params
			var params = {
				siteId: toBeRemoved.SiteId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/remove', $.param(params))
				.then(function(res){
					var i = site.getIndexById(toBeRemoved.SiteId);
					if(i !== -1)site.data.splice(i, 1);
					
					return;
				}, failureCallback)
				.then(successCallback);
			
			// invalidate cache
			site.invalidateCache();
		}
		
		// get the index by id
		site.getIndexById = function(id){
		
			var data = site.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].SiteId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return site;
		
	})
	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('Snippet', function($http, Setup){
	
		var snippet = {};
		
		// retrieve themes
		snippet.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/snippet')
				.success(callback);
		}
			
		// retrieves content for a snippet
		snippet.content = function(snippet, callback){
		
			// set params
			var params = {
				snippet: snippet
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/snippet/content', $.param(params))
				.success(callback);
		}
			
		return snippet;
		
	})


})();
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
(function() {
    
    angular.module('respond.factories')
    
    .factory('Theme', function($http, Setup){
	
		var theme = {};
		
		// retrieve themes
		theme.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/theme')
				.success(callback);
		}
		
		// retrieve pages for theme
		theme.listPages = function(callback){
		
			// post to API
			$http.get(Setup.api + '/theme/pages/list')
				.success(callback);
		}
		
		// retrieve configurations for theme
		theme.listConfigurations = function(callback){
		
			// post to API
			$http.get(Setup.api + '/theme/configurations/list')
				.success(callback);
		}
		
		// applies configurations to a theme
		theme.applyConfigurations = function(configurations, callback){
		
			// set params
			var params = {
				configurations: configurations
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/theme/configurations/apply', $.param(params))
				.success(callback);
		}
		
		// applies a theme
		theme.apply = function(theme, replaceContent, callback){
		
			// set params
			var params = {
				theme: theme,
				replaceContent: replaceContent
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/theme/apply', $.param(params))
				.success(callback);
		}
		
		// resets a theme
		theme.reset = function(theme, callback){
		
			// set params
			var params = {
				theme: theme
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/theme/reset', $.param(params))
				.success(callback);
		}
		
		return theme;
		
	})
	
})();
(function() {
    
    angular.module('respond.factories')
    
    .factory('Translation', function($http, Setup){
	
		var translation = {};
		translation.data = [];
		translation.locales = [];
		
		// retrieve locales for site
		translation.listLocales = function(callback){
		
			// set params
			var params = {};
		
			// post to API
			$http.post(Setup.api + '/translation/list/locales', $.param(params))
				.then(function(res){
				
					// set data for factory
					translation.locales = res.data;
					return translation.locales;
					
				})
				.then(callback);
		}
		
		// retrieve translation for language, site
		translation.retrieve = function(locale, callback){
		
			// set params
			var params = {
					locale: locale
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/retrieve', $.param(params))
				.then(function(res){
					// set data for factory
					translation.data = res.data;
					return translation.data;
				})
				.then(callback);
		}
		
		// retrieve default translation for site
		translation.retrieveDefault = function(callback){
		
			// post to API
			$http.post(Setup.api + '/translation/retrieve/default')
				.then(function(res){
					// set data for factory
					translation.data = res.data;
					return translation.data;
				})
				.then(callback);
		}
		
		// clears translations for a page
		translation.clear = function(pageId){
			
			// clear translations
			translation.data[pageId] = {};
			
		}
		
		// adds a translation
		translation.add = function(pageId, key, value){
			
			// create page namespace if null
			if(translation.data[pageId] == null){
				translation.data[pageId] = {};
			}
		
			// add translation 
			translation.data[pageId][key] = value;	
		}
		
		// adds a locale
		translation.addLocale = function(locale, callback){
		
			// set params
			var params = {locale: locale};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/add/locale', $.param(params))
				.then(function(res){
					
					// push locale to factory
					translation.locales.push(locale);
					
				})
				.then(callback);
		}
		
		// removes a locale
		translation.removeLocale = function(locale, callback){
		
			// set params
			var params = {locale: locale};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/remove/locale', $.param(params))
				.then(function(res){
					
					// push locale to factory
					var index = translation.locales.indexOf(locale);
					
					// remove from index
					if(index > -1){
					    translation.locales.splice(index, 1);
					}
					
				})
				.then(callback);
		}
		
		// saves a translation
		translation.save = function(callback){
			
			// stringify the translation object
			var content = JSON.stringify(translation.data, null, "\t");
			
			// set params
			var params = {content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/save', $.param(params))
				.success(callback);
			
		}
		
		// publishes a translation
		translation.publish = function(locale, content, callback){
			
			// set params
			var params = {locale: locale, content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/save', $.param(params))
				.success(callback);
			
		}	
		
		return translation;	
	})
	
})();
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
(function() {
    
    angular.module('respond.factories')
    
    .factory('Version', function($http, Setup){
		
		var version = {};
		version.data = [];
			
		// retrieve version
		version.retrieve = function(versionId, callback){
		
			// set params
			var params = {
					versionId: versionId
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/version/retrieve', $.param(params))
				.success(callback);
		}
		
		// saves a version
		version.save = function(pageId, content, callback){
			
			// set params
			var params = {pageId: pageId, content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/version/add', $.param(params))
				.success(callback);
			
		}
		
		// lists versions for a page
		version.list = function(pageId, callback){
			
			// set params
			var params = {pageId: pageId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/version/list', $.param(params))
				.then(function(res){
				
					// set data for factory
					version.data = res.data;
					return version.data;
					
				})
				.then(callback);
			
		}	
		
		return version;	
	})

	
})();