(function() {
    
    angular.module('respond.directives')
    
    .directive('respondCreateId', function() {
	    return {
	        // attribute
	        restrict: 'A',
	       
	        link: function(scope, element, attrs) {
	        
	        	element.bind('keyup', function(){
	        	
	        		$el = $(this);
	        		
	        		var keyed = $el.val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
					keyed = keyed.substring(0,25);
					
		        	scope.$apply(function() {
		        	
			          	scope.friendlyId = keyed;
				        
				        if(scope.temp){
				       		scope.temp.FriendlyId = keyed;
				        }
			        });
			     	
	        	});  	
	          
	        }
	    };
	})
	
})();