(function() {
    
    angular.module('respond.controllers')
    
    // create controller
	.controller('CreateCtrl', function($scope, $rootScope, $state, Setup, Theme, Language, Site) {
	
		$rootScope.template = 'login';
		
		// setup
		$scope.setup = Setup;
		$scope.step = 1;
		
		// setup carousel
		$('#select-theme').carousel({
			interval: false,
			wrap: true
		});
		
		// set system message
		$scope.showSystemMessage = false;
		
		if(Setup.systemMessage != ''){
			$scope.showSystemMessage = true;
		}
		
		$scope.loginUrl = function(){
			
			return utilities.replaceAll(Setup.login, '{{friendlyId}}', $scope.friendlyId);
			
		}
		
		// determine timezone
		var tz = jstz.determine();
	    $scope.name = '';
	    $scope.friendlyId = '';
	    $scope.email = '';
	    $scope.password = '';
	    $scope.timeZone = tz.name();
	    $scope.siteLanguage = Setup.language;
	    $scope.userLanguage = Setup.language;
	    $scope.themeId = Setup.themeId;
	    $scope.passcode = '';
	    $scope.firstName = '';
	    $scope.lastName = '';
	    
	    if($scope.setup.defaultNameOnCreate){
		    $scope.firstName = i18n.t('New');
			$scope.lastName = i18n.t('User');
	    }
	    
	    
	    $(document).on('click', '#toggle-advanced', function(){
			$('.advanced').show();
		});
		
		// set step
		$scope.setStep = function(step){
			$scope.step = step;
		}
		
		// set next
		$scope.next = function(){
			$('#select-theme').carousel('next');
			$scope.step = 2;
		}
		
		$scope.previous = function(){
			$('#select-theme').carousel('prev');
			$scope.step = 2;
		}
	    
	    // sets a theme
	    $scope.setThemeId = function(id){
	    	$scope.themeId = id;
	    }
	    
	    // get themes
		Theme.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Theme.list');
			if(Setup.debug)console.log(data);
			
			$scope.themes = data;
		});
	    
	    // get languages
		Language.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Language.list');
			if(Setup.debug)console.log(data);
			
			$scope.languages = data;
		});
		
		// create a site
		$scope.create = function(){
			
			var id = $('#select-theme .active').attr('data-id');
			
			$scope.themeId = id;
			
			message.showMessage('progress');
			
			// create the site
			Site.create($scope.friendlyId, $scope.name, $scope.email, $scope.password, $scope.passcode, $scope.timeZone, 
				$scope.siteLanguage, $scope.userLanguage, $scope.themeId, $scope.firstName, $scope.lastName,
				function(){  // success
					message.showMessage('success');
			
					// go to info
					$state.go('info', {'id': $scope.friendlyId});
				},
				function(){  // failure
					message.showMessage('error');
				});
		}
		
		
	})
	
})();