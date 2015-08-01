(function() {
    
    angular.module('respond.directives')
    
    .directive('respondSpectrum', function(Setup) {
	    return {
	        // attribute
	        restrict: 'A',
	        scope: { 
				current: '=' 
			},
	        link: function(scope, element, attrs) {
	        
		            scope.$watch(function() {return element.attr('color'); }, function(newValue){
		            	if(newValue != '' && newValue != null && newValue != undefined){
			            	$(element).spectrum('set', newValue);
			            }
		            });
		        
		        	var defaultColor = attrs.color;
		        	
		        	if(defaultColor == '' || defaultColor == null || defaultColor == undefined){
			        	defaultColor = '#FFFFFF';
		        	}
		        	
		        	var action = 'default';
		        	
		        	// set action
		        	if(attrs.action != '' && attrs.action != undefined){
			        	action = attrs.action;
		        	}
		        	
	        	 	$(element).spectrum({
		        	 	color: defaultColor,
		        	 	showInput: true,
						showInitial: true,
						showPalette: true,
						showAlpha: true,
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
		        	 		
		        	 	},
	        	 		change: function(color) {
						    
						    // restore selection
						    if(utilities.selection != null){
						    	utilities.restoreSelection(utilities.selection);
							}
						    
						    // get hex
						    var colorString = color.toHexString();
						    
						    var alpha = color.getAlpha();
						    
						    // use rgba for alpha channels
						    if(alpha < 1){
							 	var colorString = color.toRgbString();   
						    }
						    
						    // set textcolor for element
						    if(action == 'editor.element.textcolor'){				    
							    // get page scope
							    var pageScope = angular.element($("section.main")).scope();
				
								pageScope.$apply(function(){
									 if(pageScope.block !== undefined){
										 pageScope.node.textcolor = colorString;
									 }
								});
							}
							else if(action == 'editor.element.textshadowcolor'){				    
							    // get page scope
							    var pageScope = angular.element($("section.main")).scope();
				
								pageScope.$apply(function(){
									 if(pageScope.block !== undefined){
										 pageScope.node.textshadowcolor = colorString;
									 }
								});							
							}
							else if(action == 'editor.block.backgroundcolor'){				    
							    // get page scope
							    var pageScope = angular.element($("section.main")).scope();
				
								pageScope.$apply(function(){
									 if(pageScope.block !== undefined){
										 pageScope.block.backgroundColor = colorString;
									 }
								});							
							}
							else if(action == 'configure.current'){
								// apply
								scope.$apply(
								    function(){
									    
									    if(scope.current !== undefined){
									    	scope.current.selected = colorString;
									    }
								    }
								)
							}
							else if(action == 'target'){
								$(attrs.target).val(colorString);
							}
							else{
						    
							    // execute forecolor (always hex)
							    document.execCommand('foreColor', false, color.toHexString());
							    
						    }
						}
	        	 	});          
	        }
	    };
	})
		
})();