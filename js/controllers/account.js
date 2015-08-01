(function() {
    
    angular.module('respond.controllers')
    
    // account controller
	.controller('AccountCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, Site) {
	
		$rootScope.template = 'signup';
		
		// setup
		$scope.setup = Setup;
		
		// site
		$scope.site = $rootScope.site;
		
	})
	
})();