(function() {
    
    angular.module('respond.controllers')
    
    // info controller
	.controller('InfoCtrl', function($scope, $window, $state, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
		
		$rootScope.template = 'login';
	
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$window.sessionStorage.loginId = $stateParams.id;
		$scope.loginLink = utilities.replaceAll(Setup.login, '{{friendlyId}}', $scope.friendlyId);
		$scope.siteLink = utilities.replaceAll(Setup.site, '{{friendlyId}}', $scope.friendlyId);
		
		// set system message
		$scope.showSystemMessage = false;
		
		if(Setup.systemMessage != ''){
			$scope.showSystemMessage = true;
		}
		
	})
	
})();