(function() {
    
    angular.module('respond.controllers')
    
    // admin controller
	.controller('AdminCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, Site) {
	
		$rootScope.template = 'admin';
		
		// setup
		$scope.setup = Setup;
		
		// site
		$scope.site = $rootScope.site;
		
		// list sites
		Site.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Site.listAll');
			if(Setup.debug)console.log(data);
			
			$scope.sites = data;
		});
		
		// shows the site dialog for editing
		$scope.showEditSite = function(site){
		
			// set temporary model
			$scope.temp = site;
			
			$('#siteDialog').modal('show');
		}
		
		// edits the site
		$scope.updateSite = function(site){
		
			message.showMessage('progress');
		
			Site.editAdmin(site, function(){
				message.showMessage('success');
			});
		
			$('#siteDialog').modal('hide');
		}
		
		// shows the remove site dialog
		$scope.showRemoveSite = function(site){
		
			// set temporary model
			$scope.temp = site;
		
			$('#removeSiteDialog').modal('show');
		}
		
		// removes the site
		$scope.removeSite = function(site){
		
			message.showMessage('progress');
		
			Site.remove(site, function(){
				message.showMessage('success');
				$('#removeSiteDialog').modal('hide');
			}, function(){
				message.showMessage('error');
				$('#removeSiteDialog').modal('hide');
			});
		
			
		}
		
	})
	
})();