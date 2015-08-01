(function() {
    
    angular.module('respond.controllers')
    
    // create controller
	.controller('MenuCtrl', function($scope, $rootScope, $state, $window, $i18next, Setup, Site, User) {

		// get user from session
		$scope.user = $rootScope.user;
		$scope.site = $rootScope.site;
		$scope.sites = Setup.sites;
		$scope.setup = Setup;
		
		// logs a user out of the site
		$scope.logout = function(){
			$window.sessionStorage.removeItem('user');
			
			// set language back
			$i18next.options.lng =  Setup.language;
			moment.lang(Setup.language);
			
			// go to login
			$state.go('login', {'id': $scope.site.FriendlyId});
			
		}
		
		// publishes a site
		$scope.republish = function(){
			
			message.showMessage('progress');
			
			Site.publish(
				function(){  // success
					
					// set version
					$rootScope.site.Version = Setup.version;
					$scope.site.Version = Setup.version;
					
					// show success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
			
		}
		
		// deploys the site
		$scope.deploy = function(){
			
			message.showMessage('progress');
			
			Site.deploy(
				function(){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
			
		}
		
	})
	
})();