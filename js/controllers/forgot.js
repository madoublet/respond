(function() {
    
    angular.module('respond.controllers')
    
    // login controller
	.controller('ForgotCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
		
		$rootScope.template = 'login';
	
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$window.sessionStorage.loginId = $stateParams.id;
		
		// forgot
		$scope.forgot = function(user){
		
			message.showMessage('progress');
			
			// login user
			User.forgot(user.email, $scope.friendlyId,
				function(data){		// success
					message.showMessage('success');
					$scope.user.email = '';	
				},
				function(){		// failure
					message.showMessage('error');
				});
			
		};
		
	})
	
})();