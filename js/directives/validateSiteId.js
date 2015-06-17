(function() {
    
    angular.module('respond.directives')
    
    .directive('respondValidateSiteId', function(Site) {
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
		       
					var name = $el.val();
					var friendlyId = scope.friendlyId;
					
					if(name == ''){
						$validating.hide();
						$invalid.show();
						return;
					}
					
					// validate id
					Site.validateFriendlyId(friendlyId, 
						function(data){ // success
							$validating.hide();
							$valid.show();
						},
						function(data){ // failure
							$validating.hide();
							$invalid.show();
						});
						        	
		        	
	        	}); 	
	          
	        }
	    };
	})

	
})();