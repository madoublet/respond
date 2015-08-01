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