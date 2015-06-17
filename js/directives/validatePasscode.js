(function() {
    
    angular.module('respond.directives')
    
    .directive('respondValidatePasscode', function(App) {
	    return {
	        // attribute
	        restrict: 'A',
	       
	        link: function(scope, element, attrs) {
	        
	        	element.bind('blur', function(){
	        	
	        		$el = $(this);
	        		
	        		$validating = $el.parent().find('.respond-validating');
	        		$valid = $el.parent().find('.respond-valid');
	        		$invalid = $el.parent().find('.respond-invalid');
	        		
		        	$validating.show();
		        	$valid.hide();
		        	$invalid.hide();
		       
					var passcode = $el.val();
					
					// validate the passcode
					App.validatePasscode(passcode, 
						function(){ // valid 
							$validating.hide();
							$valid.show();
						},
						function(){ // in-valid
							$validating.hide();
							$invalid.show();
							return;
						});
		        	
	        	}); 	
	          
	        }
	    };
	})
	
})();