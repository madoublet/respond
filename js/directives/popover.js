(function() {
    
    angular.module('respond.directives')
    
    .directive('respondPopover', function() {
	    return {
	        // attribute
	        restrict: 'A',
	       
	        link: function(scope, element, attrs) {
	        
	        	$(element).popover('show'); 	
	          
	        }
	    };
	})
	
})();