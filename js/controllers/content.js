(function() {
    
    angular.module('respond.controllers')
    
    // content controller
	.controller('ContentCtrl', function($scope, $rootScope, $stateParams, $sce, $timeout, Setup, Site, Page, Version, PageType, Image, Icon, Theme, Layout, Stylesheet, Editor, Translation, File, Product, MenuType, Snippet) {
		
		$rootScope.template = 'content';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.content = '';
		$scope.sites = Setup.sites;
		$scope.node = {};
		$scope.element = {};
		$scope.parent = {};
		$scope.block = {};
		$scope.container = {};
		$scope.column1 = {};
		$scope.column2 = {};
		$scope.column3 = {};
		$scope.column4 = {};
		$scope.numColumns = 1;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		$scope.isModified = false;
		$scope.snippets = null;
		$scope.site = $rootScope.site;
		
		// watch for changes in the block collection
	    $scope.$watchCollection('block', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
		  			if(index.toLowerCase() == 'id'){
			  			$(respond.editor.currBlock).prop('id', attr);
			  			$(respond.editor.currBlock).find('.block-actions span').text('#' + attr);
		  			}
		  		
		  			$(respond.editor.currBlock).attr('data-' + index.toLowerCase(), attr);
			  		
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes in the container collection
	    $scope.$watchCollection('container', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
		  			$(respond.editor.currBlock).attr('data-container' + index.toLowerCase(), attr);
			  		
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes to the column
	    $scope.$watchCollection('column1', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
		  			$(respond.editor.currBlock).find('.col:nth-child(1)').attr('data-' + index.toLowerCase(), attr);
			  		
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes to the column
	    $scope.$watchCollection('column2', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
		  			$(respond.editor.currBlock).find('.col:nth-child(2)').attr('data-' + index.toLowerCase(), attr);
			  		
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes to the column
	    $scope.$watchCollection('column3', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
		  			$(respond.editor.currBlock).find('.col:nth-child(3)').attr('data-' + index.toLowerCase(), attr);
			  		
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes to the column
	    $scope.$watchCollection('column4', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
		  			$(respond.editor.currBlock).find('.col:nth-child(4)').attr('data-' + index.toLowerCase(), attr);
			  		
		  		}
		  		
	  		});
	    	
	    });
		
		// watch for changes in the node collection
	    $scope.$watchCollection('node', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
			  		// set new values
			  		if(index != 'sortableItem'){
			  		
			  			if(Setup.debug)console.log('$watch, set index=' + index +' to attr=' + attr);
			  		
			  			// set corresponding data attribute
			  			$(respond.editor.currNode).attr('data-' + index, attr);
			  			
			  			// set config-text convenience method
			  			$(respond.editor.currNode).find('[node-text="' + index + '"]').text(attr);
			  			
			  			// create eventName
			  			var eventName = respond.editor.currConfig.attr('data-action') + '.node.' + index + '.change';
			  			
			  			// trigger change
			  			$(respond.editor.el).trigger(eventName, {index: index, attr: attr});
			  		}
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes in the node collection
	    $scope.$watchCollection('element', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
			  		// set new values
			  		if(index != 'sortableItem'){
			  		
			  		
			  			// set corresponding data attribute
			  			$(respond.editor.currElement).attr('data-' + index, attr);
			  			
			  			// set config-text convenience method
			  			$(respond.editor.currElement).find('[element-text="' + index + '"]').text(attr);
			  			
			  			if(respond.editor.currConfig){
			  				// create eventName
			  				var eventName = respond.editor.currConfig.attr('data-action') + '.element.' + index + '.change';
			  			
			  				// trigger change
			  				$(respond.editor.el).trigger(eventName, {index: index, attr: attr});
			  			}
			  		}
		  		}
		  		
	  		});
	    	
	    });
	    
	    // watch for changes in the parent collection
	    $scope.$watchCollection('parent', function(newValues, oldValues){
	    	
	    	$.each(newValues, function(index, attr){	
		  		
		  		// check for changes
		  		if(newValues[index] != oldValues[index]){
		  		
			  		// set new values
			  		if(index != 'sortableItem'){
			  		
			  			// set corresponding data attribute
			  			$(respond.editor.currElement).parent().attr('data-' + index, attr);
			  			
			  			// set config-text convenience method
			  			$(respond.editor.currElement).parent().find('[parent-text="' + index + '"]').text(attr);
			  			
			  			if(respond.editor.currConfig){
			  				// create eventName
			  				var eventName = respond.editor.currConfig.attr('data-action') + '.parent.' + index + '.change';
			  			
			  				// trigger change
			  				$(respond.editor.el).trigger(eventName, {index: index, attr: attr});
			  			}
			  		}
		  		}
		  		
	  		});
	    	
	    });
	    
	    // set modified
	    $scope.setModified = function(){
		    
		    $timeout(function(){
		  		$scope.isModified = true;
			});
		    
	    }
	    
		// get pageId
		$scope.pageId = $stateParams.id;
		
		// shows the images dialog
		$scope.showAddImage = function(action){
			$scope.retrieveImages();
			$('#imagesDialog').attr('data-action', action);
			$('#imagesDialog').modal('show');
		}
		
		// save & publish
		$scope.saveAndPublish = function(){
		
			$scope.isModified = false;
			
			var editor = $('#respond-editor');
			
			// get the content and image from the editor
			var content = respond.editor.getContent(editor, Setup.api);
			var image = respond.editor.getPrimaryImage(editor);
			
			message.showMessage('progress');
			
			// save content for the page
			Page.saveContent($scope.pageId, content, image, 'publish', function(){
				message.showMessage('success');
				$scope.page.HasDraft = false;
			});
			
			// save a version of the content
			Version.save($scope.pageId, content, function(){});
			
			// save settings for the page
			$scope.saveSettings();
			
			// set prefix
			var prefix = $scope.page.Url + '-';
			
			var pageId = $scope.page.PageId;
			
			// save search index (todo)
			var translations = respond.editor.getTranslations(content);
			
			// get default translations for the site
			Translation.retrieveDefault(function(){
			
				// clear translations for the page
				Translation.clear(pageId);
				
				// add some meta data to the translations
				Translation.add(pageId, 'pageId', $scope.page.PageId);
				Translation.add(pageId, 'name', $scope.page.Name);
				Translation.add(pageId, 'url', $scope.page.Url);
				Translation.add(pageId, 'description', $scope.page.Description);
				Translation.add(pageId, 'includeOnly', $scope.page.IncludeOnly);
				
				// walkthrough translations
				for(var key in translations){
				
					// add translation to data
					Translation.add(pageId, key, translations[key]);
					
				}
				
				// save translation
				Translation.save(function(){
					
				});
				
			});
		}
		
		// saves a draft
		$scope.saveDraft = function(){
		
			$scope.isModified = false;
		
			var editor = $('#respond-editor');
			
			// get the content and image from the editor
			var content = respond.editor.getContent(editor, Setup.api);
			var image = respond.editor.getPrimaryImage(editor);
			
			message.showMessage('progress');
			
			Page.saveContent($scope.pageId, content, image, 'draft', function(data){
				message.showMessage('success');
				$scope.page.HasDraft = true;
			});
			
		}
		
		// reverts a draft
		$scope.revertDraft = function(){
		
			var editor = $('#respond-editor');
				
			message.showMessage('progress');
			
			// revert draft
			Page.revertDraft($scope.pageId, function(data){
				message.showMessage('success');
				$scope.page.HasDraft = false;
				
				// retrieve current content
				Page.retrieveContent($scope.pageId, function(data){
					
					// update editor
					$(respond.editor.el).html(data);
					
					// refresh editor
	    			respond.editor.refresh();
	    			
				});
				
				
			});
			
		}
		
		// set location
		$scope.setLocation = function(){
		
			var callback = function(latitude, longitude, fmtAddress){
			
				$scope.$apply(function(){
					$scope.page.Latitude = latitude;
					$scope.page.Longitude = longitude;
				});
				
			}
			
			var address = $scope.page.Location;
			
			utilities.geocode(address, callback);
			
		}
		
		// show settings
		$scope.showPageSettings = function(){
			// hide config
		  	$('.context-menu').find('.config').removeClass('active');
		  	$('.page-settings').addClass('active');
		  	respond.editor.currNode = null;
		  	respond.editor.currElement = null;
		  	$(respond.editor.el).find('.current-element').removeClass('current-element');
		  	$(respond.editor.el).find('.current-node').removeClass('current-node');
		}
		
		// save settings
		$scope.saveSettings = function(){
			
		
			var beginDate = $.trim(utilities.convertToDateString($scope.page.LocalBeginDate) 
								+ ' ' + 
								utilities.convertToTimeString($scope.page.LocalBeginTime));
								
			var endDate = $.trim(utilities.convertToDateString($scope.page.LocalEndDate) 
								+ ' ' + 
								utilities.convertToTimeString($scope.page.LocalEndTime));
			
			Page.saveSettings($scope.pageId, 
				$scope.page.Name, $scope.page.FriendlyId, $scope.page.Description, $scope.page.Keywords, $scope.page.Callout, 
				$scope.page.Layout, $scope.page.Stylesheet, $scope.page.IncludeOnly,
				beginDate, endDate, $scope.page.Location, $scope.page.Latitude, $scope.page.Longitude,
				function(data){});
			
		}
		
		// back
		$scope.back = function(){
			
			if($scope.isModified == true){
				$('#changeDialog').modal('show');
			}
			else{
				window.history.back();
			}
		}
		
		// continue
		$scope.continueBack = function(){
			$('#changeDialog').modal('hide');
		
			window.history.back();
		}
		
		$scope.site = $rootScope.site;
		
		$scope.separator = '/';
		
		if($scope.site.UrlMode == 'hash'){
			$scope.separator = '/#/';
		}
		else if($scope.site.UrlMode == 'hashbang'){
			$scope.separator = '/#!/';
		}
		
		$scope.page = null
		
		// retrieve page
		Page.retrieveExtended($scope.pageId, $scope.site.Offset, function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Page.retrieveExtended');
			if(Setup.debug)console.log(data);
			
			$scope.page = data;
			
		});
			
		
		// retrieve pages
		$scope.retrievePages = function(){
		
			// list pages
			Page.list(function(data){
				
				if($scope.pages == null){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] Page.list');
					if(Setup.debug)console.log(data);
					
					$scope.pages = data;
				}
				
			});
		
		}
		
		$scope.retrievePages();
		
		// retrieve pages for theme
		$scope.retrievePagesForTheme = function(){
		
			// list pages for theme
			Theme.listPages(function(data){
			
				if($scope.themePages == null){
			
					// debugging
					if(Setup.debug)console.log('[respond.debug] Theme.listPages');
					if(Setup.debug)console.log(data);
					
					$scope.themePages = data;
				}
				
			});
		
		}	
		
		// retrieve versions for a page
		$scope.retrieveVersions = function(){
		
			// list pages for theme
			Version.list($scope.pageId, function(data){
			
				if($scope.versions == null){
			
					// debugging
					if(Setup.debug)console.log('[respond.debug] Version.retrieveVersions');
					if(Setup.debug)console.log(data);
					
					$scope.versions = data;
				}
				
			});
		
		}	
		
		// retrieve pagetypes
		$scope.retrievePageTypes = function(){
		
			// list allowed page types
			PageType.list(function(data){
			
				if($scope.pageTypes == null){
			
					// debugging
					if(Setup.debug)console.log('[respond.debug] PageType.listAll');
					if(Setup.debug)console.log(data);
					
					$scope.pageTypes = data;
				}
				
			});
		
		}
		
		$scope.retrievePageTypes();
		
		// retrieve images
		$scope.retrieveImages = function(){
		
			if($scope.images == null){
		
				// list images
				Image.list(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] Image.list');
					if(Setup.debug)console.log(data);
					
					$scope.images = data;
				});
				
				// get file size
				File.retrieveSize(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
					if(Setup.debug)console.log(data);
					
					$scope.totalSize = parseFloat(data);
				});
			
			}
		
		}
		
		// retrieve snippets
		$scope.retrieveSnippets = function(){
		
			if($scope.snippets == null){
		
				// list images
				Snippet.list(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] Snippet.list');
					
					$scope.snippets = data;
				});
			
			}
		
		}
		
		// updates files
		$scope.updateFiles = function(){
			// list files
			File.list(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] File.list');
				if(Setup.debug)console.log(data);
				
				$scope.files = data;
				$scope.loading = false;
			});
			
			// get file size
			File.retrieveSize(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
				if(Setup.debug)console.log(data);
				
				$scope.totalSize = parseFloat(data);
			});
		}
		
		// updates downloads
		$scope.updateDownloads = function(){
		
			// list files
			File.listDownloads(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] File.listDownloads');
				if(Setup.debug)console.log(data);
				
				$scope.downloads = data;
				$scope.loading = false;
			});
			
		}
		
		$scope.updateDownloads();
		
		// list menutypes
		MenuType.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] MenuType.list');
			if(Setup.debug)console.log(data);
			
			$scope.menuTypes = data;
		});
		
		// retrieve pre-cached editor items
		$scope.editorItems = $rootScope.editorItems;
		
		// setup fs
		var fs = null;
			
		// for ltr
		if($('html[dir=rtl]').length > 0){
			fs = Flipsnap('.editor-actions div', {distance: -400, maxPoint:3});
		}
		else{
			fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
		}
		
	    $('.fs-next').on('click', function(){
	        fs.toNext(); 
	        
	        if(fs.hasPrev()){
	            $('.fs-prev').show();
	        }
	        else{
	            $('.fs-prev').hide();
	        }
	        
	        if(fs.hasNext()){
	            $('.fs-next').show();
	        }
	        else{
	            $('.fs-next').hide();
	        }
	    });
	    
	    $('.fs-prev').on('click', function(){
	        fs.toPrev(); 
	        
	        if(fs.hasPrev()){
	            $('.fs-prev').show();
	        }
	        else{
	            $('.fs-prev').hide();
	        }
	        
	        if(fs.hasNext()){
	            $('.fs-next').show();
	        }
	        else{
	            $('.fs-next').hide();
	        }
	    });
		 
	    
	    // setup editor
		var editor = respond.editor.setup({
		    			el: $('#respond-editor'),
		    			pageId: $stateParams.id,
		    			api: Setup.api,
		    			menu: $scope.editorItems,
		    			imagesUrl: $scope.site.ImagesUrl
					});
	
		setTimeout(function(){
			$scope.setupTour();
		}, 1);
	
	
		// list new images
		$scope.updateImages = function(){
			Image.list(function(data){
				// debugging
				if(Setup.debug)console.log('[respond.debug] Image.list');
				if(Setup.debug)console.log(data);
				
				$scope.images = data;
			});
		}
		
		// cancel
		$scope.cancelAddImage = function(){
			$('#editor-placeholder').remove();
			$('#imagesDialog').modal('hide');
		}
		
		// add image
		$scope.addImage = function(image){
		
			var plugin = $('#imagesDialog').attr('data-plugin');
			var action = $('#imagesDialog').attr('data-action');
			
			if(action == undefined){
				action = '';
			}
			
			// add or edit the image
			if(action == 'edit'){
				var fn = plugin + '.editImage';
				
				// execute method
				utilities.executeFunctionByName(fn, window, image);
			}
			else if(action == 'add'){
				var fn = plugin + '.addImage';
				
				// execute method
				utilities.executeFunctionByName(fn, window, image);
			}
			else if(action == 'block'){
				
				var src = image.fullUrl;
				
				// removes the domain from the img
		  		if(src != ''){
			  		var parts = src.split('files/');
			  		src = 'files/' + parts[1];
		  		}
			
				$scope.block.backgroundImage = src;
				
				$('#imagesDialog').modal('hide');
			}
			
			
		}
		
		// add external image
		$scope.addExternalImage = function(image){
			
			var url = $.trim($('#external-image').val());
			
			if(url != ''){
				
				var fileName = '';
				var ext = '';
				
				var arr = url.split('/');
				
				// get filename and extension
				if(arr.length > 0){
					var filename = arr[arr.length-1];
					
					var arr = filename.split('.');
					
					if(arr.length > 0){
						var ext = arr[arr.length-1];
					}
				}
				
				// create image
				var image = {
					fileName: fileName,
					fullUrl: url,
					thumbUrl: url,
					extension: ext,
					isImage: true,
					size: 0,
					width: -1,
					height: -1
				}
			
				var plugin = $('#imagesDialog').attr('data-plugin');
				var action= $('#imagesDialog').attr('data-action');
				
				// add or edit the image
				if(action != undefined && action == 'edit'){
					var fn = plugin + '.editImage';
				}
				else{
					var fn = plugin + '.addImage';
				}
				
				// set isExternal flag
				image['isExternal'] = true;
				
				// execute method
				utilities.executeFunctionByName(fn, window, image);
			}
		}
		
		// list icon
		Icon.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Image.list');
			if(Setup.debug)console.log(data);
			
			$scope.icons = data;
		});
		
		// list layouts
		Layout.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Layout.list');
			if(Setup.debug)console.log(data);
			
			$scope.layouts = data;
		});
		
		// list stylesheets
		Stylesheet.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Stylesheet.list');
			if(Setup.debug)console.log(data);
			
			$scope.stylesheets = data;
		});
		
		// generate preview
		$scope.generatePreview = function(){
		
			var editor = $('#respond-editor');
		
			// get the content and image from the editor
			var content = respond.editor.getContent(editor);
			
			var image = respond.editor.getPrimaryImage(editor);
			var previewUrl = 'sites/' + $scope.site.FriendlyId + '/#/' + $scope.page.Url + '?preview=true';
			
			Page.preview($scope.pageId, content, function(data){});
		}
		
		// add product
		$scope.addProduct = function(product){
		
			Product.add(product, $scope.pageId, function(data){});
		}
		
		// clear products
		$scope.clearProducts = function(){
		
			Product.clear($scope.pageId, function(data){});
		}				
	
		// show the editor tour automatically during initial user session
		$scope.setupTour = function(){
			
			// show the editor tour
			if($rootScope.firstLogin == true && $rootScope.editorTourShown == false){
				tour.editor();
				$rootScope.editorTourShown = true;
			}
		}
	
		// shows the editor tour on demand
		$scope.showIntro = function(){
			tour.editor();
		}
	
	})
	
	// menus controller
	.controller('MenusCtrl', function($scope, $rootScope, Setup, MenuType, MenuItem, Page) {
	
		$rootScope.template = 'menus';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.friendlyId = 'primary';
		
		// set friendlyId
		$scope.setFriendlyId = function(friendlyId){
			$scope.friendlyId = friendlyId;
			$scope.current = null;
		}
		
		// set menutype
		$scope.setMenuType = function(menuType){
			$scope.friendlyId = menuType.FriendlyId;
			$scope.current = menuType;
		}
		
		// creates a friendlyId
		$scope.createFriendlyId = function(temp){
			var keyed = temp.Name.toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
			temp.FriendlyId = keyed.substring(0,25);
		}
		
		// list menutypes
		MenuType.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] MenuType.list');
			if(Setup.debug)console.log(data);
			
			$scope.menuTypes = data;
		});
		
		// list menuitems
		MenuItem.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] MenuItem.list');
			if(Setup.debug)console.log(data);
			
			$scope.menuItems = data;
			$scope.loading = false;
			
			// setup reorder
			$('div.list').sortable({handle:'span.hook', placeholder: 'placeholder', opacity:'0.6', stop:function(){
	            
	            // get order
	            var items = $('#menuItemsList .listItem');
	        
		        var priorities = {};
		        
		        // set order in the model
		        for(var x=0; x<items.length; x++){
		            var id = $(items[x]).data('id');
					MenuItem.setPriority(id, x);
		            priorities[id] = x;
		        }
		        
		        // update order
		        message.showMessage('progress');
		        
		        MenuItem.savePriorities(priorities, function(){
			    	message.showMessage('success'); 	   
		        });
	            
	        }});
		});
		
		// list pages
		Page.list(function(data){
			
			// debugging
			if(Setup.debug)console.log('[respond.debug] Page.list');
			if(Setup.debug)console.log(data);
			
			$scope.pages = data;
		});
		
		// shows the menutype dialog for adding
		$scope.showAddMenuType = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#menuTypeDialog').modal('show');
	    	
	    	$('#menuTypeDialog').find('.add').show();
			$('#menuTypeDialog').find('.edit').hide();
		}
		
		// adds the menu type
		$scope.addMenuType = function(menuType){
		
			MenuType.add(menuType);
		
			$('#menuTypeDialog').modal('hide');
		}
		
		// shows the remove menu type dialog
		$scope.showRemoveMenuType = function(menuType){
		
			// set temporary model
			$scope.temp = menuType;
		
			$('#removeMenuTypeDialog').modal('show');
		}
		
		// removes the menu type
		$scope.removeMenuType = function(menuType){
		
			message.showMessage('progress');
		
			MenuType.remove(menuType, function(){
				$scope.friendlyId = 'primary';
				message.showMessage('success');
			});
		
			$('#removeMenuTypeDialog').modal('hide');
		}
		
		// shows the menu item dialog
		$scope.showAddMenuItem = function(){
		
			// set temporary model
			$scope.temp = {
				Name: '',
				Url: '',
				CssClass: ''
			};
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').show();
			$('#addEditDialog').find('.edit').hide();
		}
		
		// add the menu item
		$scope.addMenuItem = function(menuItem){
		
			menuItem.Priority = $('#menuItemsList').find('.listItem').length;
			menuItem.Type = $scope.friendlyId;
		
			MenuItem.add(menuItem);
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the menu item dialog
		$scope.showEditMenuItem = function(menuItem){
		
			// set temporary model
			$scope.temp = menuItem;
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').hide();
			$('#addEditDialog').find('.edit').show();
		}
		
		// edits the menu item
		$scope.editMenuItem = function(menuItem){
		
			message.showMessage('progress');
		
			MenuItem.edit(menuItem, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the remove item dialog
		$scope.showRemoveMenuItem = function(menuItem){
		
			// set temporary model
			$scope.temp = menuItem;
		
			$('#removeMenuItemDialog').modal('show');
		}
	
		// removes a menuItem
		$scope.removeMenuItem = function(menuItem){
		
			message.showMessage('progress');
		
			MenuItem.remove(menuItem, function(){
				message.showMessage('success');
			});
		
			$('#removeMenuItemDialog').modal('hide');
		}
		
		// toggle isNested
		$scope.toggleNested = function(menuItem){
			
			message.showMessage('progress');
		
			MenuItem.toggleNested(menuItem, function(){
				message.showMessage('success');
			});
			
		}
		
		// set url from page URL dropdown
		$scope.setUrl = function(page){
		
			$scope.temp.Name = page.Name
			$scope.temp.Url = page.Url;
			$scope.temp.PageId = page.PageId;
			
			return false;
		}
		
		// publishes the menus
		$scope.publish = function(){
		
			message.showMessage('progress');
		
			MenuItem.publish(function(){
				message.showMessage('success');
			});
		}
		
	})
})();