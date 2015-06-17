(function() {
    
    angular.module('respond.controllers')
    
    // branding controller
	.controller('BrandingCtrl', function($scope, $window, $rootScope, Setup, Site, Image, File) {
		
		$rootScope.template = 'branding';
		
		// setup
		$scope.setup = Setup;
		$scope.type = null;
		$scope.site = null;
		$scope.logoUrl = null;
		$scope.altLogoUrl = null;
		$scope.payPalLogoUrl = null;
		$scope.iconUrl = null;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		
		$scope.site = $rootScope.site;
			
		// update image urls
		if($scope.site.LogoUrl != null){
	    	$scope.logoUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.LogoUrl;
	    }
	    
	    if($scope.site.PayPalLogoUrl != null){
			$scope.payPalLogoUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.PayPalLogoUrl;
		}
		
		if($scope.site.AltLogoUrl != null){
			$scope.altLogoUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.AltLogoUrl;
		}
		
		if($scope.site.IconUrl != null){
			$scope.iconUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.IconUrl;
		}
		
		// shows the images dialog
		$scope.showAddImage = function(type){
			$scope.type = type;
		
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
		
			message.showMessage('progress');
		
			Site.addImage($scope.type, image, function(){
				message.showMessage('success');
				
				// update image
				if($scope.type == 'logo'){
					$scope.logoUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				else if($scope.type == 'paypal'){
					$scope.payPalLogoUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				else if($scope.type == 'alt'){
					$scope.altLogoUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				else if($scope.type == 'icon'){
					$scope.iconUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				
				// update site in session
				Site.retrieve(function(data){
					// set site to $rootScope
					$rootScope.site = data;
					$window.sessionStorage.site = JSON.stringify(data);					
				});
				
			});
		
			$('#imagesDialog').modal('hide');
		}
	
	})
	
})();