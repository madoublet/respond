(function() {
    
    angular.module('respond.controllers')
    
    // thankyou controller
	.controller('ThankyouCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup) {
	
		$rootScope.template = 'thankyou';
		
		// setup
		$scope.setup = Setup;
	})
	
})();