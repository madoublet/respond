(function() {
    
    angular.module('respond.controllers')
    
    // configure controller
	.controller('ConfigureCtrl', function($scope, $state, $rootScope, $sce, Setup, Theme, Site, Image, File) {
		
		$rootScope.template = 'configure';
		
		// setup
		$scope.setup = Setup;
		
		$scope.themeId = Site.Theme;
	    $scope.domain = Site.Domain;
	    $scope.friendlyId = null;
	    $scope.configs = [];
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		$scope.control = null;
	    
	    // retrieve site
		Site.retrieve(function(data){
			$scope.site = data;
			
			$scope.themeId = data.Theme;
			$scope.domain = data.Domain;
			$scope.friendlyId = data.FriendlyId;
			
			var stamp = moment().format('X');
				
			var url = $scope.setup.sites + '/' + $scope.friendlyId + '?t='+stamp;
			
			$scope.currentSite = $sce.trustAsResourceUrl(url);
		});
		
		// retrieve configurations
		Theme.listConfigurations(function(data){	
			$scope.configs = data;
		});
		
		// apply themes
		$scope.apply = function(){
			
			message.showMessage('progress');
			
			var str = angular.toJson($scope.configs);
			
			Theme.applyConfigurations(str, function(){	
				message.showMessage('success');
			
				function refresh(){
					var stamp = moment().format('X');
						
					var url = $scope.setup.sites + '/' + $scope.friendlyId + '?t='+stamp;
					
					$scope.currentSite = $sce.trustAsResourceUrl(url);
				}
				
				setTimeout(refresh(), 5);
			
			});
			
		}
		
		// refresh theme
		$scope.refresh = function(){
			var stamp = moment().format('X');
					
			var url = $scope.domain + '?t='+stamp;
			
			$scope.currentSite = $sce.trustAsResourceUrl(url);
		}
		
		// navigate to change theme
		$scope.changeTheme = function(){
			$state.go('app.theme');
		}
		
		// shows the images dialog
		$scope.showAddImage = function(control){
			$scope.control = control;
			$('#imagesDialog').modal('show');
		}
		
		// list new images
		$scope.updateImages = function(){
			Image.list(function(data){
				// debugging
				if(Setup.debug)console.log('[respond.debug] Image.list');
				if(Setup.debug)console.log(data);
				
				$scope.images = data;
			});
		}
		
		// get file size
		File.retrieveSize(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
			if(Setup.debug)console.log(data);
			
			$scope.totalSize = parseFloat(data);
		});
		
		// update the images for the dialog
		$scope.updateImages();
		
		// updates the icon bg
		$scope.updateIconBg = function(){
			
			message.showMessage('progress');
		
			Site.updateIconBg($scope.site.IconBg, function(){
				message.showMessage('success');
			});
		}
		
		// add image
		$scope.addImage = function(image){
		
			// setup url for images
			var url = $scope.site.ImagesUrl + 'files/' + image.filename;
			
			// set selected
			$scope.control.selected = url;
			
			// hide modal
			$('#imagesDialog').modal('hide');
		}
	    
	})
	
})();