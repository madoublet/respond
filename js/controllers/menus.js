(function() {
    
    angular.module('respond.controllers')
    
    // menus controller
	.controller('MenusCtrl', function($scope, $rootScope, Setup, MenuType, MenuItem, Page) {
	
		$rootScope.template = 'menus';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.friendlyId = 'primary';
		
		// set friendlyId
		$scope.setFriendlyId = function(friendlyId){
			$scope.friendlyId = friendlyId;
			$scope.current = null;
		}
		
		// set menutype
		$scope.setMenuType = function(menuType){
			$scope.friendlyId = menuType.FriendlyId;
			$scope.current = menuType;
		}
		
		// creates a friendlyId
		$scope.createFriendlyId = function(temp){
			var keyed = temp.Name.toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
			temp.FriendlyId = keyed.substring(0,25);
		}
		
		// list menutypes
		MenuType.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] MenuType.list');
			if(Setup.debug)console.log(data);
			
			$scope.menuTypes = data;
		});
		
		// list menuitems
		MenuItem.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] MenuItem.list');
			if(Setup.debug)console.log(data);
			
			$scope.menuItems = data;
			$scope.loading = false;
			
			// setup reorder
			$('div.list').sortable({handle:'span.hook', placeholder: 'placeholder', opacity:'0.6', stop:function(){
	            
	            // get order
	            var items = $('#menuItemsList .listItem');
	        
		        var priorities = {};
		        
		        // set order in the model
		        for(var x=0; x<items.length; x++){
		            var id = $(items[x]).data('id');
					MenuItem.setPriority(id, x);
		            priorities[id] = x;
		        }
		        
		        // update order
		        message.showMessage('progress');
		        
		        MenuItem.savePriorities(priorities, function(){
			    	message.showMessage('success'); 	   
		        });
	            
	        }});
		});
		
		// list pages
		Page.list(function(data){
			
			// debugging
			if(Setup.debug)console.log('[respond.debug] Page.list');
			if(Setup.debug)console.log(data);
			
			$scope.pages = data;
		});
		
		// shows the menutype dialog for adding
		$scope.showAddMenuType = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#menuTypeDialog').modal('show');
	    	
	    	$('#menuTypeDialog').find('.add').show();
			$('#menuTypeDialog').find('.edit').hide();
		}
		
		// adds the menu type
		$scope.addMenuType = function(menuType){
		
			MenuType.add(menuType);
		
			$('#menuTypeDialog').modal('hide');
		}
		
		// shows the remove menu type dialog
		$scope.showRemoveMenuType = function(menuType){
		
			// set temporary model
			$scope.temp = menuType;
		
			$('#removeMenuTypeDialog').modal('show');
		}
		
		// removes the menu type
		$scope.removeMenuType = function(menuType){
		
			message.showMessage('progress');
		
			MenuType.remove(menuType, function(){
				$scope.friendlyId = 'primary';
				message.showMessage('success');
			});
		
			$('#removeMenuTypeDialog').modal('hide');
		}
		
		// shows the menu item dialog
		$scope.showAddMenuItem = function(){
		
			// set temporary model
			$scope.temp = {
				Name: '',
				Url: '',
				CssClass: ''
			};
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').show();
			$('#addEditDialog').find('.edit').hide();
		}
		
		// add the menu item
		$scope.addMenuItem = function(menuItem){
		
			menuItem.Priority = $('#menuItemsList').find('.listItem').length;
			menuItem.Type = $scope.friendlyId;
		
			MenuItem.add(menuItem);
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the menu item dialog
		$scope.showEditMenuItem = function(menuItem){
		
			// set temporary model
			$scope.temp = menuItem;
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').hide();
			$('#addEditDialog').find('.edit').show();
		}
		
		// edits the menu item
		$scope.editMenuItem = function(menuItem){
		
			message.showMessage('progress');
		
			MenuItem.edit(menuItem, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the remove item dialog
		$scope.showRemoveMenuItem = function(menuItem){
		
			// set temporary model
			$scope.temp = menuItem;
		
			$('#removeMenuItemDialog').modal('show');
		}
	
		// removes a menuItem
		$scope.removeMenuItem = function(menuItem){
		
			message.showMessage('progress');
		
			MenuItem.remove(menuItem, function(){
				message.showMessage('success');
			});
		
			$('#removeMenuItemDialog').modal('hide');
		}
		
		// toggle isNested
		$scope.toggleNested = function(menuItem){
			
			message.showMessage('progress');
		
			MenuItem.toggleNested(menuItem, function(){
				message.showMessage('success');
			});
			
		}
		
		// set url from page URL dropdown
		$scope.setUrl = function(page){
		
			$scope.temp.Name = page.Name
			$scope.temp.Url = page.Url;
			$scope.temp.PageId = page.PageId;
			
			return false;
		}
		
		// publishes the menus
		$scope.publish = function(){
		
			message.showMessage('progress');
		
			MenuItem.publish(function(){
				message.showMessage('success');
			});
		}
		
	})
	
})();