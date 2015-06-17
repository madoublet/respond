(function() {
    
    angular.module('respond.controllers')
    
    // users controller
	.controller('UsersCtrl', function($scope, $rootScope, Setup, User, Role, Language, Image, File) {
		
		$rootScope.template = 'users';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.temp = null;
		$scope.userLimit = $rootScope.site.UserLimit;
		$scope.canAdd = false;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		
		// list users
		User.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] User.list');
			if(Setup.debug)console.log(data);
			
			$scope.users = data;
			$scope.loading = false;
			
			if($scope.users.length < $scope.userLimit){
				$scope.canAdd = true;
			}
		});
		
		// get languages
		Language.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Language.list');
			if(Setup.debug)console.log(data);
			
			$scope.languages = data;
		});
		
		// get roles
		Role.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Role.list');
			if(Setup.debug)console.log(data);
			
			// push admin, contributor and member
			data.push({
				RoleId: 'Admin',
				Name: i18n.t('Admin'), 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''});
				
			data.push({
				RoleId: 'Contributor',
				Name: i18n.t('Contributor'), 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''});
				
			data.push({
				RoleId: 'Member',
				Name: i18n.t('Member'), 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''});
			
			$scope.roles = data;
		});
		
		// shows the user dialog for editing
		$scope.showEditUser = function(user){
		
			// set temporary model
			$scope.temp = user;
			
			$scope.temp.Password = 'temppassword';
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.edit').show();
			$('#addEditDialog').find('.add').hide();
		}
		
		// edits the user
		$scope.editUser = function(user){
		
			message.showMessage('progress');
		
			User.edit(user, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the dialog to add a user
		$scope.showAddUser = function(){
		
			// set temporary model
			$scope.temp = {
				firstName: '', 
				lastName: '', 
				role: 'Admin', 
				language: 'en', 
				isActive: '1', 
				email: '', 
				password: ''};
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').show();
			$('#addEditDialog').find('.edit').hide();
		}
		
		// adds the user
		$scope.addUser = function(user){
		
			message.showMessage('progress');
		
			User.add(user, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the remove user dialog
		$scope.showRemoveUser = function(user){
		
			// set temporary model
			$scope.temp = user;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the user
		$scope.removeUser = function(user){
		
			message.showMessage('progress');
		
			User.remove(user, function(){
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// shows the images dialog
		$scope.showAddImage = function(user){
			$scope.temp = user;
			
			$('#imagesDialog').modal('show');
		}
		
		// list new images
		$scope.updateImages = function(){
			Image.list(function(data){
				// debugging
				if(Setup.debug)console.log('[respond.debug] Image.list');
				if(Setup.debug)console.log(data);
				
				$scope.images = data;
			});
			
			// get file size
			File.retrieveSize(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
				if(Setup.debug)console.log(data);
				
				$scope.totalSize = parseFloat(data);
			});
		}
		
		// update the images for the dialog
		$scope.updateImages();
		
		// add image
		$scope.addImage = function(image){
		
			message.showMessage('progress');
		
			User.addImage($scope.temp.UserId, image, function(){
				message.showMessage('success');
			});
		
			$('#imagesDialog').modal('hide');
		}
	
	
	})

	
})();