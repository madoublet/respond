(function() {
    
    angular.module('respond.controllers')
    
    // login controller
	.controller('InstallCtrl', function($scope, $rootScope, Setup, App) {
	
		$rootScope.template = 'login';
		
		// setup
		$scope.setup = Setup;
		$scope.appurl = 'http://app.myrespond.com';
		$scope.dbname = 'respondtest';
		$scope.dbuser = '';
		$scope.dbpass = '';
		
		// default
		$('#install-form').removeClass('hidden');
		$('#install-confirmation').addClass('hidden');
			
		// installs a site
		$scope.install = function(){
			
			message.showMessage('progress');
			
			// create the site
			App.install($scope.appurl, $scope.dbname, $scope.dbuser, $scope.dbpass,
				function(){  // success
				
					$('#install-form').addClass('hidden');
					$('#install-confirmation').removeClass('hidden');
				
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		}
		
	})
	
})();