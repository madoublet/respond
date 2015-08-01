(function() {
    
    angular.module('respond.controllers')
    
    // roles controller
	.controller('RolesCtrl', function($scope, $rootScope, Setup, Role, PageType) {
		
		$rootScope.template = 'roles';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.temp = null;
		$scope.isDefault = true;
		
		// handle checkbox clicking
		$('body').on('click', '.chk-view-all', function(){
			$('.chk-view').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-edit-all', function(){
			$('.chk-edit').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-publish-all', function(){
			$('.chk-publish').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-remove-all', function(){
			$('.chk-remove').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-create-all', function(){
			$('.chk-create').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-view', function(){
			$('.chk-view-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-edit', function(){
			$('.chk-edit-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-publish', function(){
			$('.chk-publish-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-remove', function(){
			$('.chk-remove-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-create', function(){
			$('.chk-create-all').removeAttr('checked');
		});
	
		// list roles
		Role.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Role.list');
			if(Setup.debug)console.log(data);
			
			$scope.roles = data;
			$scope.loading = false;
		});
		
		// list all page types
		PageType.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] PageType.list');
			if(Setup.debug)console.log(data);
			
			$scope.pageTypes = data;
		});
		
		// sets up the checkboxes in the dialog
		$scope.setupCheckboxes = function(view, edit, publish, remove, create){
		
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
		
			// check view boxes
			if(view == 'All'){
				$('#addEditDialog').find('.chk-view-all').attr('checked', 'checked');
			}
			else{
				var list = view.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-view-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check edit boxes
			if(edit == 'All'){
				$('#addEditDialog').find('.chk-edit-all').attr('checked', 'checked');
			}
			else{
				var list = edit.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-edit-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check publish boxes
			if(publish == 'All'){
				$('.chk-publish-all').attr('checked', 'checked');
			}
			else{
				var list = publish.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-publish-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check remove boxes
			if(remove == 'All'){
				$('#addEditDialog').find('.chk-remove-all').attr('checked', 'checked');
			}
			else{
				var list = remove.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-remove-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check create boxes
			if(create == 'All'){
				$('#addEditDialog').find('.chk-create-all').attr('checked', 'checked');
			}
			else{
				var list = create.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-create-'+list[x]).attr('checked', 'checked');
				}
			}
		}
		
		// shows the default values
		$scope.showDefault = function(role){
			
			// set default
			$scope.isDefault = true;
			
			// setup the checkboxes
			if(role == 'Admin'){
				$scope.setupCheckboxes('All', 'All', 'All', 'All', 'All');
			}
			else if(role == 'Contributor'){
				$scope.setupCheckboxes('All', 'All', '', '', '');
			}
			else if(role == 'Member'){
				$scope.setupCheckboxes('All', '', '', '', '');
			}
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.edit').show();
			$('#addEditDialog').find('.add').hide();
			
		}
		
		// shows the role dialog for editing
		$scope.showEditRole = function(role){
		
			// set default
			$scope.isDefault = false;
		
			// set temporary model
			$scope.temp = role;
		
			// setup the checkboxes
			$scope.setupCheckboxes(role.CanView, role.CanEdit, role.CanPublish, role.CanRemove, role.CanCreate)
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.edit').show();
			$('#addEditDialog').find('.add').hide();
		}
		
		// gets value
		$scope.getPermissions = function(type){
			
			var canDo = '';
			
			// get permissions 
			if($('.chk-'+type+'-all').prop('checked')){
				canDo = 'All';
			}
			else{
				var checks = $('.chk-' + type);
				
				for(x=0; x<checks.length; x++){
					if($(checks[x]).prop('checked')){
						canDo += $(checks[x]).val() + ',';
					}
				}		
			}
			
			// replace trailing comma and trim
			canDo = canDo.replace(/(^,)|(,$)/g, "");
			canDo = $.trim(canDo);
			
			return canDo;
		}
		
		// edits the role
		$scope.editRole = function(role){
		
			// set permissions
			role.CanView = $scope.getPermissions('view');
			role.CanEdit = $scope.getPermissions('edit');
			role.CanPublish = $scope.getPermissions('publish');
			role.CanRemove = $scope.getPermissions('remove');
			role.CanCreate = $scope.getPermissions('create');
		
			message.showMessage('progress');
		
			Role.edit(role, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the dialog to add a role
		$scope.showAddRole = function(){
		
			// set default
			$scope.isDefault = false;
		
			// set temporary model
			$scope.temp = {
				Name: '', 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''};
			
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').show();
			$('#addEditDialog').find('.edit').hide();
		}
		
		// adds the role
		$scope.addRole = function(role){
		
			// set permissions
			role.CanView = $scope.getPermissions('view');
			role.CanEdit = $scope.getPermissions('edit');
			role.CanPublish = $scope.getPermissions('publish');
			role.CanRemove = $scope.getPermissions('remove');
			role.CanCreate = $scope.getPermissions('create');
		
			message.showMessage('progress');
		
			Role.add(role, function(){
				message.showMessage('success');
			});
			
			$('#addEditDialog').modal('hide');
		}
		
		// shows the remove role dialog
		$scope.showRemoveRole = function(role){
		
			// set temporary model
			$scope.temp = role;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the role
		$scope.removeRole = function(role){
		
			Role.remove(role);
		
			$('#removeDialog').modal('hide');
		}
	
	})
	
})();