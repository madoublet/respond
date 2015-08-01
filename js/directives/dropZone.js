(function() {
    
    angular.module('respond.directives')
    
    .directive('dropZone', function(File, Setup) {
	  	return function(scope, element, attrs) {
	 
		  	Dropzone.autoDiscover = false;
	 
		  	$(element).dropzone({ 
	            url: Setup.api + '/file/post',
	            headers: { 'X-Auth': 'Bearer ' + window.sessionStorage.token},
	            clickable: true,
	            sending: function(file, xhr, formData){
	            
					if(attrs.filename != '' && attrs.filename != null){
					  	formData.append('overwrite', attrs.filename);
					}
					
					if(attrs.folder != '' && attrs.folder != null && attrs.folder != undefined){
						formData.append('folder', attrs.folder);
					}
					
					$(element).find('.dz-message').hide();
					
					return true;
		            
	            },
	            success: function(file, response){
	            
	            	// clear cache
					File.invalidateCache();
	            
	                var image = response;
	          
	                if(attrs.target == 'editor'){
	                
	                	scope.image = response;
	
		                // call method to update list
		                scope.$apply(attrs.callback);
		                
		                // call method to add image
		                scope.$apply('addImage(image)');
	                }
	                else if(attrs.target == 'branding'){
	                
		                // call method to update list
		                scope.$apply(attrs.callback);
		                
		                scope.image = response;
		                
		                // call method to add image
		                scope.$apply('addImage(image)');
	                }
	                else if(attrs.target == 'profile'){
	                
		                // call method to update list
		                scope.$apply(attrs.callback);
		                
		                scope.image = response;
		                
		                // call method to add image
		                scope.$apply('addImage(image)');
	                }
	                else{
		                // call method to update list
		                scope.$apply(attrs.callback);
	                }
	            }
	            
	        });
		  	
			
		}
	})
	
})();