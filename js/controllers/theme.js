(function() {
    
    angular.module('respond.controllers')
    
    // theme controller
	.controller('ThemeCtrl', function($scope, $rootScope, Setup, Theme, Site) {
		
		$rootScope.template = 'theme';
		
		// setup
		$scope.setup = Setup;
		
	    $scope.themeId = Site.Theme;
	    
	    // back
		$scope.back = function(){
			window.history.back();
		}
	    
	    // setup carousel
		$('#update-theme').carousel({
			interval: false,
			wrap: true
		});
		
		// set next
		$scope.next = function(){
			$('#update-theme').carousel('next');
		}
		
		$scope.previous = function(){
			$('#update-theme').carousel('prev');
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
		
		// retrieve site
		Site.retrieve(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Site.retrieve');
			if(Setup.debug)console.log(data);
			
			$scope.site = data;
			
			$scope.themeId = data.Theme;
		});
		
		// shows the dialog to apply a new theme
		$scope.showApply = function(theme){
		
			// set temporary model
			$scope.temp = theme;
			$scope.replaceContent = true;
		
			$('#applyDialog').modal('show');
	    	
		}
		
		// applies a new theme
		$scope.applyTheme = function(theme){
			
			message.showMessage('progress');
		
			// apply the theme
			Theme.apply(theme.name, $scope.replaceContent,
				function(){
					 message.showMessage('success');
					 
					 $scope.themeId = theme.name;
				});
		
			// hide the modal
			$('#applyDialog').modal('hide');
		}
		
		// shows the dialog to reset the current theme
		$scope.showReset = function(theme){
		
			// set temporary model
			$scope.temp = theme;
		
			$('#resetDialog').modal('show');
	    	
		}
		
		// resets current theme
		$scope.resetTheme = function(theme){
		
			message.showMessage('progress');
		
			// reset the theme
			Theme.reset(theme.name, 
				function(){
					 message.showMessage('success');
				});
		
			$('#resetDialog').modal('hide');
		}
		
	})

	
})();