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
(function() {
    
    angular.module('respond.directives')
    
    .directive('qrcode', ['$window', function($window) {

	    var canvas2D = !!$window.CanvasRenderingContext2D,
	        levels = {
	          'L': 'Low',
	          'M': 'Medium',
	          'Q': 'Quartile',
	          'H': 'High'
	        },
	        draw = function(context, qr, modules, tile) {
	          for (var row = 0; row < modules; row++) {
	            for (var col = 0; col < modules; col++) {
	              var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
	                  h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
	
	              context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
	              context.fillRect(Math.round(col * tile),
	                               Math.round(row * tile), w, h);
	            }
	          }
	        };
	
	    return {
	      restrict: 'E',
	      template: '<canvas class="qrcode"></canvas>',
	      link: function(scope, element, attrs) {
	        var domElement = element[0],
	            $canvas = element.find('canvas'),
	            canvas = $canvas[0],
	            context = canvas2D ? canvas.getContext('2d') : null,
	            download = 'download' in attrs,
	            href = attrs.href,
	            link = download || href ? document.createElement('a') : '',
	            trim = /^\s+|\s+$/g,
	            error,
	            version,
	            errorCorrectionLevel,
	            data,
	            size,
	            modules,
	            tile,
	            qr,
	            $img,
	            setVersion = function(value) {
	              version = Math.max(1, Math.min(parseInt(value, 10), 10)) || 4;
	            },
	            setErrorCorrectionLevel = function(value) {
	              errorCorrectionLevel = value in levels ? value : 'M';
	            },
	            setData = function(value) {
	              if (!value) {
	                return;
	              }
	
	              data = value.replace(trim, '');
	              qr = qrcode(version, errorCorrectionLevel);
	              qr.addData(data);
	
	              try {
	                qr.make();
	              } catch(e) {
	                error = e.message;
	                return;
	              }
	
	              error = false;
	              modules = qr.getModuleCount();
	            },
	            setSize = function(value) {
	              size = parseInt(value, 10) || modules * 2;
	              tile = size / modules;
	              canvas.width = canvas.height = size;
	            },
	            render = function() {
	              if (!qr) {
	                return;
	              }
	
	              if (error) {
	                if (link) {
	                  link.removeAttribute('download');
	                  link.title = '';
	                  link.href = '#_';
	                }
	                if (!canvas2D) {
	                  domElement.innerHTML = '<img src width="' + size + '"' +
	                                         'height="' + size + '"' +
	                                         'class="qrcode">';
	                }
	                scope.$emit('qrcode:error', error);
	                return;
	              }
	
	              if (download) {
	                domElement.download = 'qrcode.png';
	                domElement.title = 'Download QR code';
	              }
	
	              if (canvas2D) {
	                draw(context, qr, modules, tile);
	
	                if (download) {
	                  domElement.href = canvas.toDataURL('image/png');
	                  return;
	                }
	              } else {
	                domElement.innerHTML = qr.createImgTag(tile, 0);
	                $img = element.find('img');
	                $img.addClass('qrcode');
	
	                if (download) {
	                  domElement.href = $img[0].src;
	                  return;
	                }
	              }
	
	              if (href) {
	                domElement.href = href;
	              }
	            };
	
	        if (link) {
	          link.className = 'qrcode-link';
	          $canvas.wrap(link);
	          domElement = link;
	        }
	
	        setVersion(attrs.version);
	        setErrorCorrectionLevel(attrs.errorCorrectionLevel);
	        setSize(attrs.size);
	
	        attrs.$observe('version', function(value) {
	          if (!value) {
	            return;
	          }
	
	          setVersion(value);
	          setData(data);
	          setSize(size);
	          render();
	        });
	
	        attrs.$observe('errorCorrectionLevel', function(value) {
	          if (!value) {
	            return;
	          }
	
	          setErrorCorrectionLevel(value);
	          setData(data);
	          setSize(size);
	          render();
	        });
	
	        attrs.$observe('data', function(value) {
	          if (!value) {
	            return;
	          }
	
	          setData(value);
	          setSize(size);
	          render();
	        });
	
	        attrs.$observe('size', function(value) {
	          if (!value) {
	            return;
	          }
	
	          setSize(value);
	          render();
	        });
	
	        attrs.$observe('href', function(value) {
	          if (!value) {
	            return;
	          }
	
	          href = value;
	          render();
	        });
	      }
	    };
	  }])
		
})();
(function() {
    
    angular.module('respond.directives')
    
    .directive('restrict', function($parse) {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	        link: function(scope, iElement, iAttrs, controller) {
	            scope.$watch(iAttrs.ngModel, function(value) {
	                if (!value) {
	                    return;
	                }
	                $parse(iAttrs.ngModel).assign(scope, value.replace(new RegExp(iAttrs.restrict, 'g'), ''));
	            });
	        }
	    }
	})
		
})();
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
(function() {
    
    angular.module('respond.directives')
    
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
	
})();
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