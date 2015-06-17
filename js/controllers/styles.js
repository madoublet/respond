(function() {
    
    angular.module('respond.controllers')
    
    // styles controller
	.controller('StylesCtrl', function($scope, $rootScope, Setup, Stylesheet) {
	
		$rootScope.template = 'styles';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.content = '';
		
		$scope.showError = false;
		
		// set code mirror options
		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
			mode: 'text/css',
	    };
		
		// set name
		$scope.setName = function(name){
			
			$scope.name = name;
			
			// retrieve content for layout
			Stylesheet.retrieve(name, function(data){
				$scope.content = data;
			});
		}
		
		// list files
		Stylesheet.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Stylesheet.list');
			if(Setup.debug)console.log(data);
			
			$scope.files = data;
			
			// retrieve content for first layout
			if(data.length > 0){
				$scope.setName(data[0]);
			}
		});
		
		// shows the add file dialog
		$scope.showAddFile = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#addDialog').modal('show');
		}
		
		// adds a file
		$scope.addFile = function(file){
		
			message.showMessage('progress');
		
			Stylesheet.add(file, function(){
				message.showMessage('success');
			});
		
			$('#addDialog').modal('hide');
		}
		
		// shows the remove file dialog
		$scope.showRemoveFile = function(file){
			
			// set temporary model
			$scope.temp = file;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the file
		$scope.removeFile = function(file){
		
			message.showMessage('progress');
		
			Stylesheet.remove(file, function(){
				$scope.file = '';  // #todo
				
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// publishes a layout
		$scope.publish = function(){
			
			message.showMessage('progress');
			
			Stylesheet.publish($scope.name, $scope.content, function(){
				message.showMessage('success');
				$scope.showError = false;
			}, function(){
				$scope.showError = true;
			});
			
		}
		
	})
	
})();