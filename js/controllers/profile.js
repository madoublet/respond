(function() {
    
    angular.module('respond.controllers')
    
    // profile controller
	.controller('ProfileCtrl', function($scope, $rootScope, Setup, User, Language) {
	
		$rootScope.template = 'profile';
		
		// setup
		$scope.user = $rootScope.user;
		$scope.user.Password = 'temppassword';
		
		// get languages
		Language.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Language.list');
			if(Setup.debug)console.log(data);
			
			$scope.languages = data;
		});
	
		
		// save profile
		$scope.save = function(){
			message.showMessage('progress');
		
			User.editProfile($scope.user, function(){
				message.showMessage('success');
			});
		}
	
		
	})
	
})();