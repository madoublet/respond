(function() {
    
    angular.module('respond.controllers')
    
    // reset controller
	.controller('ResetCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
	
		$rootScope.template = 'login';
		
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$scope.token = $stateParams.token;
		$window.sessionStorage.loginId = $stateParams.id;
		
		// reset
		$scope.reset = function(user){
		
			message.showMessage('progress');
			
			// login user
			User.reset($scope.token, user.password, $scope.friendlyId,
				function(data){		// success
					message.showMessage('success');
					$scope.user.password = '';		
				},
				function(){		// failure
					message.showMessage('error');
				});
			
		};
		
	})
	
})();