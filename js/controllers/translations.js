(function() {
    
    angular.module('respond.controllers')
    
    // translations controller
	.controller('TranslationsCtrl', function($scope, $rootScope, Setup, Translation) {
	
		$rootScope.template = 'translations';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.content = '';
		$scope.showError = false;
		
		// set code mirror options
		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
			mode: 'application/json',
	    };
		
		// set locale
		$scope.setLocale = function(locale){
			$scope.locale = locale;
			
			// retrieve content for layout
			Translation.retrieve(locale, function(data){
				$scope.content = JSON.stringify(data, null, '\t');
			});
		}
		
		// list locales
		$scope.listLocales = function(){
			// list available locales
			Translation.listLocales(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] Translation.list');
				if(Setup.debug)console.log(data);
				
				$scope.locales = data;
				
				// retrieve content for first layout
				if(data.length > 0){
					$scope.setLocale(data[0]);
				}
			});
		}
		
		// list locales by default
		$scope.listLocales();
		
		// shows the add file dialog
		$scope.showAddLocale = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#addDialog').modal('show');
		}
		
		// adds a locale
		$scope.addLocale = function(locale){
		
			message.showMessage('progress');
		
			Translation.addLocale(locale, function(){
				message.showMessage('success');
			});
		
			$('#addDialog').modal('hide');
		}
		
		// shows the remove locale dialog
		$scope.showRemoveLocale = function(locale){
		
			// set temporary model
			$scope.temp = locale;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the locale
		$scope.removeLocale = function(locale){
		
			message.showMessage('progress');
		
			Translation.removeLocale(locale, function(){
				$scope.listLocales();
				
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// publishes a layout
		$scope.publish = function(){
			
			message.showMessage('progress');
			
			var isvalid = false;
			
			// validate json
			try {
		        JSON.parse($scope.content);
		        
		        isvalid = true;
		    } catch (e) {
		        isvalid = false;
		    }
			
			// publish if valide
			if(isvalid){
				Translation.publish($scope.locale, $scope.content, function(){
					message.showMessage('success');
					$scope.showError = false;
				});
			}
			else{
				message.showMessage('error');
				$scope.showError = true;
			}
			
		}
		
	})

	
})();