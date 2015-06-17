(function() {
    
    angular.module('respond.controllers')
    
    // files controller
	.controller('FilesCtrl', function($scope, $rootScope, Setup, File) {
		
		$rootScope.template = 'files';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.temp = null;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		$scope.folder = 'files';
		
		// set current folder
		$scope.setFolder = function(folder){
			$scope.folder = folder;
			
			
			// update files
			$scope.updateFiles();
			
		}
		
		$scope.updateFiles = function(){
		
			if(Setup.debug)console.log('[respond.test] updateFiles(), folder = ' + $scope.folder);
		
			if($scope.folder == 'files'){
			
				// list files
				File.list(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] File.list');
					if(Setup.debug)console.log(data);
					
					$scope.files = data;
					$scope.loading = false;
				});
			}
			else{
			
				// update downloads
				File.listDownloads(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] Download.list');
					if(Setup.debug)console.log(data);
					
					$scope.files = data;
					$scope.loading = false;
				});
				
			}
	
			// get file size
			File.retrieveSize(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
				if(Setup.debug)console.log(data);
				
				$scope.totalSize = parseFloat(data);
			});
		}
		
		$scope.updateFiles();
		
		// sets file to be edit
		$scope.edit = function(file, $event){
			$scope.temp = file;
			
			var el = $event.target;
			
			$('.listItem').removeClass('editing');
			$(el).parents('.listItem').addClass('editing');
			
		}
		
		// cancels editing an item
		$scope.cancelEdit = function(file){
			$scope.temp = null;
			$('.listItem').removeClass('editing');
		}
	
		// shows the remove dialog
		$scope.showRemove = function(file){
			$scope.temp = file;
			
			$('#removeDialog').modal('show');
		}
		
		// removes a file
		$scope.remove = function(){
			
			message.showMessage('progress');
			
			File.remove($scope.temp, $scope.folder, function(){
				message.showMessage('success');
				
				$scope.updateFiles();
			});
			
			$('#removeDialog').modal('hide');
		}
	
	})

	
})();