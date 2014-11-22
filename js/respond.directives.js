angular.module('respond.directives', [])

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
				var friendlyId = $el.attr('data-id');
				
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

.directive('respondValidateSiteEmail', function(Site) {
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
	       
				var email = $el.val();
				
				if(email == ''){
					$validating.hide();
					$invalid.show();
					return;
				}
				
				// validate id
				Site.validateEmail(email, 
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

.directive('respondValidatePasscode', function(Setup) {
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
				
				if(passcode !== Setup.passcode){
					$validating.hide();
					$invalid.show();
					return;
				}
				else{
					$validating.hide();
					$valid.show();
				}
					        	
	        	
        	}); 	
          
        }
    };
})

.directive('dropZone', function(File, Setup) {
  	return function(scope, element, attrs) {
 
	  	Dropzone.autoDiscover = false;
 
	  	$(element).dropzone({ 
            url: Setup.api + '/file/post',
            headers: { 'Authorization': 'Bearer ' + window.sessionStorage.token},
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


.directive('respondSpectrum', function(Setup) {
    return {
        // attribute
        restrict: 'A',
		scope: { 
			current: '=' 
		},
        link: function(scope, element, attrs) {
	        
	        	var val = attrs.color;
	        	
        	 	$(element).spectrum({
	        	 	color: val,
	        	 	showInput: true,
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					preferredFormat: "hex",
					palette: [
					["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
					["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
					["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
					["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
					["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
					["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
					["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
					["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
					],
					localStorageKey: "colors.respond",
        	 		beforeShow: function(){
	        	 		utilities.selection = utilities.saveSelection();
	        	 		
	        	 		console.log('set selection');
        	 		},
        	 		change: function(color) {
					    
					    // restore selection
					    if(utilities.selection != null){
					    	utilities.restoreSelection(utilities.selection);
						}
					    
					    // get hex
					    var hex = color.toHexString();
					    
					    scope.$apply(
						    function(){
							    scope.current.selected = hex;
						    }
					    )

					    // execute forecolor
					    document.execCommand('foreColor', false, hex);
					}
        	 	});          
        }
    };
})

;
