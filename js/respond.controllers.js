(function() {
    
    angular.module('respond.controllers')
    
    // account controller
	.controller('AccountCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, Site) {
	
		$rootScope.template = 'signup';
		
		// setup
		$scope.setup = Setup;
		
		// site
		$scope.site = $rootScope.site;
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // admin controller
	.controller('AdminCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, Site) {
	
		$rootScope.template = 'admin';
		
		// setup
		$scope.setup = Setup;
		
		// site
		$scope.site = $rootScope.site;
		
		// list sites
		Site.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Site.listAll');
			if(Setup.debug)console.log(data);
			
			$scope.sites = data;
		});
		
		// shows the site dialog for editing
		$scope.showEditSite = function(site){
		
			// set temporary model
			$scope.temp = site;
			
			$('#siteDialog').modal('show');
		}
		
		// edits the site
		$scope.updateSite = function(site){
		
			message.showMessage('progress');
		
			Site.editAdmin(site, function(){
				message.showMessage('success');
			});
		
			$('#siteDialog').modal('hide');
		}
		
		// shows the remove site dialog
		$scope.showRemoveSite = function(site){
		
			// set temporary model
			$scope.temp = site;
		
			$('#removeSiteDialog').modal('show');
		}
		
		// removes the site
		$scope.removeSite = function(site){
		
			message.showMessage('progress');
		
			Site.remove(site, function(){
				message.showMessage('success');
				$('#removeSiteDialog').modal('hide');
			}, function(){
				message.showMessage('error');
				$('#removeSiteDialog').modal('hide');
			});
		
			
		}
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // branding controller
	.controller('BrandingCtrl', function($scope, $window, $rootScope, Setup, Site, Image, File) {
		
		$rootScope.template = 'branding';
		
		// setup
		$scope.setup = Setup;
		$scope.type = null;
		$scope.site = null;
		$scope.logoUrl = null;
		$scope.altLogoUrl = null;
		$scope.payPalLogoUrl = null;
		$scope.iconUrl = null;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		
		$scope.site = $rootScope.site;
			
		// update image urls
		if($scope.site.LogoUrl != null){
	    	$scope.logoUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.LogoUrl;
	    }
	    
	    if($scope.site.PayPalLogoUrl != null){
			$scope.payPalLogoUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.PayPalLogoUrl;
		}
		
		if($scope.site.AltLogoUrl != null){
			$scope.altLogoUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.AltLogoUrl;
		}
		
		if($scope.site.IconUrl != null){
			$scope.iconUrl = $scope.site.ImagesUrl + 'files/' + $scope.site.IconUrl;
		}
		
		// shows the images dialog
		$scope.showAddImage = function(type){
			$scope.type = type;
		
			$('#imagesDialog').modal('show');
		}
		
		// list new images
		$scope.updateImages = function(){
			Image.list(function(data){
				// debugging
				if(Setup.debug)console.log('[respond.debug] Image.list');
				if(Setup.debug)console.log(data);
				
				$scope.images = data;
			});
		}
		
		// get file size
		File.retrieveSize(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
			if(Setup.debug)console.log(data);
			
			$scope.totalSize = parseFloat(data);
		});
		
		// update the images for the dialog
		$scope.updateImages();
		
		// updates the icon bg
		$scope.updateIconBg = function(){
			
			message.showMessage('progress');
		
			Site.updateIconBg($scope.site.IconBg, function(){
				message.showMessage('success');
			});
		}
		
		// add image
		$scope.addImage = function(image){
		
			message.showMessage('progress');
		
			Site.addImage($scope.type, image, function(){
				message.showMessage('success');
				
				// update image
				if($scope.type == 'logo'){
					$scope.logoUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				else if($scope.type == 'paypal'){
					$scope.payPalLogoUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				else if($scope.type == 'alt'){
					$scope.altLogoUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				else if($scope.type == 'icon'){
					$scope.iconUrl = $scope.site.ImagesUrl + 'files/' + image.filename;
				}
				
				// update site in session
				Site.retrieve(function(data){
					// set site to $rootScope
					$rootScope.site = data;
					$window.sessionStorage.site = JSON.stringify(data);					
				});
				
			});
		
			$('#imagesDialog').modal('hide');
		}
	
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // configure controller
	.controller('ConfigureCtrl', function($scope, $state, $rootScope, $sce, Setup, Theme, Site, Image, File) {
		
		$rootScope.template = 'configure';
		
		// setup
		$scope.setup = Setup;
		
		$scope.themeId = Site.Theme;
	    $scope.domain = Site.Domain;
	    $scope.friendlyId = null;
	    $scope.configs = [];
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		$scope.control = null;
	    
	    // retrieve site
		Site.retrieve(function(data){
			$scope.site = data;
			
			$scope.themeId = data.Theme;
			$scope.domain = data.Domain;
			$scope.friendlyId = data.FriendlyId;
			
			var stamp = moment().format('X');
				
			var url = $scope.setup.sites + '/' + $scope.friendlyId + '?t='+stamp;
			
			$scope.currentSite = $sce.trustAsResourceUrl(url);
		});
		
		// retrieve configurations
		Theme.listConfigurations(function(data){	
			$scope.configs = data;
		});
		
		// apply themes
		$scope.apply = function(){
			
			message.showMessage('progress');
			
			var str = angular.toJson($scope.configs);
			
			Theme.applyConfigurations(str, function(){	
				message.showMessage('success');
			
				function refresh(){
					var stamp = moment().format('X');
						
					var url = $scope.setup.sites + '/' + $scope.friendlyId + '?t='+stamp;
					
					$scope.currentSite = $sce.trustAsResourceUrl(url);
				}
				
				setTimeout(refresh(), 5);
			
			});
			
		}
		
		// refresh theme
		$scope.refresh = function(){
			var stamp = moment().format('X');
					
			var url = $scope.domain + '?t='+stamp;
			
			$scope.currentSite = $sce.trustAsResourceUrl(url);
		}
		
		// navigate to change theme
		$scope.changeTheme = function(){
			$state.go('app.theme');
		}
		
		// shows the images dialog
		$scope.showAddImage = function(control){
			$scope.control = control;
			$('#imagesDialog').modal('show');
		}
		
		// list new images
		$scope.updateImages = function(){
			Image.list(function(data){
				// debugging
				if(Setup.debug)console.log('[respond.debug] Image.list');
				if(Setup.debug)console.log(data);
				
				$scope.images = data;
			});
		}
		
		// get file size
		File.retrieveSize(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
			if(Setup.debug)console.log(data);
			
			$scope.totalSize = parseFloat(data);
		});
		
		// update the images for the dialog
		$scope.updateImages();
		
		// updates the icon bg
		$scope.updateIconBg = function(){
			
			message.showMessage('progress');
		
			Site.updateIconBg($scope.site.IconBg, function(){
				message.showMessage('success');
			});
		}
		
		// add image
		$scope.addImage = function(image){
		
			// setup url for images
			var url = $scope.site.ImagesUrl + 'files/' + image.filename;
			
			// set selected
			$scope.control.selected = url;
			
			// hide modal
			$('#imagesDialog').modal('hide');
		}
	    
	})
	
})();
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
(function() {
    
    angular.module('respond.controllers')
    
    // create controller
	.controller('CreateCtrl', function($scope, $rootScope, $state, Setup, Theme, Language, Site) {
	
		$rootScope.template = 'login';
		
		// setup
		$scope.setup = Setup;
		$scope.step = 1;
		
		// setup carousel
		$('#select-theme').carousel({
			interval: false,
			wrap: true
		});
		
		// set system message
		$scope.showSystemMessage = false;
		
		if(Setup.systemMessage != ''){
			$scope.showSystemMessage = true;
		}
		
		$scope.loginUrl = function(){
			
			return utilities.replaceAll(Setup.login, '{{friendlyId}}', $scope.friendlyId);
			
		}
		
		// determine timezone
		var tz = jstz.determine();
	    $scope.name = '';
	    $scope.friendlyId = '';
	    $scope.email = '';
	    $scope.password = '';
	    $scope.timeZone = tz.name();
	    $scope.siteLanguage = Setup.language;
	    $scope.userLanguage = Setup.language;
	    $scope.themeId = Setup.themeId;
	    $scope.passcode = '';
	    $scope.firstName = '';
	    $scope.lastName = '';
	    
	    if($scope.setup.defaultNameOnCreate){
		    $scope.firstName = i18n.t('New');
			$scope.lastName = i18n.t('User');
	    }
	    
	    
	    $(document).on('click', '#toggle-advanced', function(){
			$('.advanced').show();
		});
		
		// set step
		$scope.setStep = function(step){
			$scope.step = step;
		}
		
		// set next
		$scope.next = function(){
			$('#select-theme').carousel('next');
			$scope.step = 2;
		}
		
		$scope.previous = function(){
			$('#select-theme').carousel('prev');
			$scope.step = 2;
		}
	    
	    // sets a theme
	    $scope.setThemeId = function(id){
	    	$scope.themeId = id;
	    }
	    
	    // get themes
		Theme.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Theme.list');
			if(Setup.debug)console.log(data);
			
			$scope.themes = data;
		});
	    
	    // get languages
		Language.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Language.list');
			if(Setup.debug)console.log(data);
			
			$scope.languages = data;
		});
		
		// create a site
		$scope.create = function(){
			
			var id = $('#select-theme .active').attr('data-id');
			
			$scope.themeId = id;
			
			message.showMessage('progress');
			
			// create the site
			Site.create($scope.friendlyId, $scope.name, $scope.email, $scope.password, $scope.passcode, $scope.timeZone, 
				$scope.siteLanguage, $scope.userLanguage, $scope.themeId, $scope.firstName, $scope.lastName,
				function(){  // success
					message.showMessage('success');
			
					// go to info
					$state.go('info', {'id': $scope.friendlyId});
				},
				function(){  // failure
					message.showMessage('error');
				});
		}
		
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // files controller
	.controller('FilesCtrl', function($scope, $rootScope, Setup, File) {
		
		$rootScope.template = 'files';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.temp = null;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		$scope.folder = 'files';
		
		// set current folder
		$scope.setFolder = function(folder){
			$scope.folder = folder;
			
			
			// update files
			$scope.updateFiles();
			
		}
		
		$scope.updateFiles = function(){
		
			if(Setup.debug)console.log('[respond.test] updateFiles(), folder = ' + $scope.folder);
		
			if($scope.folder == 'files'){
			
				// list files
				File.list(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] File.list');
					if(Setup.debug)console.log(data);
					
					$scope.files = data;
					$scope.loading = false;
				});
			}
			else{
			
				// update downloads
				File.listDownloads(function(data){
				
					// debugging
					if(Setup.debug)console.log('[respond.debug] Download.list');
					if(Setup.debug)console.log(data);
					
					$scope.files = data;
					$scope.loading = false;
				});
				
			}
	
			// get file size
			File.retrieveSize(function(data){
			
				// debugging
				if(Setup.debug)console.log('[respond.debug] File.retrieveSize');
				if(Setup.debug)console.log(data);
				
				$scope.totalSize = parseFloat(data);
			});
		}
		
		$scope.updateFiles();
		
		// sets file to be edit
		$scope.edit = function(file, $event){
			$scope.temp = file;
			
			var el = $event.target;
			
			$('.listItem').removeClass('editing');
			$(el).parents('.listItem').addClass('editing');
			
		}
		
		// cancels editing an item
		$scope.cancelEdit = function(file){
			$scope.temp = null;
			$('.listItem').removeClass('editing');
		}
	
		// shows the remove dialog
		$scope.showRemove = function(file){
			$scope.temp = file;
			
			$('#removeDialog').modal('show');
		}
		
		// removes a file
		$scope.remove = function(){
			
			message.showMessage('progress');
			
			File.remove($scope.temp, $scope.folder, function(){
				message.showMessage('success');
				
				$scope.updateFiles();
			});
			
			$('#removeDialog').modal('hide');
		}
	
	})

	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // login controller
	.controller('ForgotCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
		
		$rootScope.template = 'login';
	
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$window.sessionStorage.loginId = $stateParams.id;
		
		// forgot
		$scope.forgot = function(user){
		
			message.showMessage('progress');
			
			// login user
			User.forgot(user.email, $scope.friendlyId,
				function(data){		// success
					message.showMessage('success');
					$scope.user.email = '';	
				},
				function(){		// failure
					message.showMessage('error');
				});
			
		};
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // info controller
	.controller('InfoCtrl', function($scope, $window, $state, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
		
		$rootScope.template = 'login';
	
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$window.sessionStorage.loginId = $stateParams.id;
		$scope.loginLink = utilities.replaceAll(Setup.login, '{{friendlyId}}', $scope.friendlyId);
		$scope.siteLink = utilities.replaceAll(Setup.site, '{{friendlyId}}', $scope.friendlyId);
		
		// set system message
		$scope.showSystemMessage = false;
		
		if(Setup.systemMessage != ''){
			$scope.showSystemMessage = true;
		}
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // login controller
	.controller('InstallCtrl', function($scope, $rootScope, Setup, App) {
	
		$rootScope.template = 'login';
		
		// setup
		$scope.setup = Setup;
		$scope.appurl = 'http://app.myrespond.com';
		$scope.dbname = 'respondtest';
		$scope.dbuser = '';
		$scope.dbpass = '';
		
		// default
		$('#install-form').removeClass('hidden');
		$('#install-confirmation').addClass('hidden');
			
		// installs a site
		$scope.install = function(){
			
			message.showMessage('progress');
			
			// create the site
			App.install($scope.appurl, $scope.dbname, $scope.dbuser, $scope.dbpass,
				function(){  // success
				
					$('#install-form').addClass('hidden');
					$('#install-confirmation').removeClass('hidden');
				
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		}
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // layouts controller
	.controller('LayoutsCtrl', function($scope, $rootScope, Setup, Layout) {
	
		$rootScope.template = 'layouts';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.content = '';
		
		// set code mirror options
		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
			mode: 'text/html',
	    };
		
		// set name
		$scope.setName = function(name){
			$scope.name = name;
			
			// retrieve content for layout
			Layout.retrieve(name, function(data){
				$scope.content = data;
			});
		}
		
		// list files
		Layout.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Layout.list');
			if(Setup.debug)console.log(data);
			
			$scope.files = data;
			
			// retrieve content for first layout
			if(data.length > 0){
				
				$scope.setName(data[0]);
			}
		});
		
		// shows the add file dialog
		$scope.showAddFile = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#addDialog').modal('show');
		}
		
		// adds a file
		$scope.addFile = function(file){
		
			message.showMessage('progress');
		
			Layout.add(file, function(){
				message.showMessage('success');
			});
		
			$('#addDialog').modal('hide');
		}
		
		// shows the remove file dialog
		$scope.showRemoveFile = function(file){
		
			// set temporary model
			$scope.temp = file;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the file
		$scope.removeFile = function(file){
		
			message.showMessage('progress');
		
			Layout.remove(file, function(){
				$scope.file = '';  // #todo
				
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// publishes a layout
		$scope.publish = function(){
			
			message.showMessage('progress');
			
			Layout.publish($scope.name, $scope.content, function(){
				message.showMessage('success');
			});
			
		}
		
	})

	
})();
(function() {
	
	angular.module('respond.controllers')
    
    // login controller
	.controller('LoginCtrl', function($scope, $window, $state, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
		
		$rootScope.template = 'login';
	
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$window.sessionStorage.loginId = $stateParams.id;
		
		// set system message
		$scope.showSystemMessage = false;
		
		if(Setup.systemMessage != ''){
			$scope.showSystemMessage = true;
		}
		
		// login
		$scope.login = function(user){
		
			message.showMessage('progress');
			
			// login user
			User.login(user.email, user.password, $scope.friendlyId,
				function(data){		// success
				
					// make sure the user has admin permissions
					if(data.user.CanEdit != '' || data.user.CanPublish != ''  || data.user.CanRemove != ''  || data.user.CanCreate != ''){
					
						// save token
						$window.sessionStorage.token = data.token;
						
						// set language to the users language
						$i18next.options.lng =  data.user.Language;
						moment.lang(data.user.Language);
						
						// set user in $rootScope, session
						$rootScope.user = data.user;
						$window.sessionStorage.user = JSON.stringify(data.user);
						
						var start = data.start;
						
						// set firstLogin
						$rootScope.firstLogin = data.firstLogin;
						$rootScope.introTourShown = false;
						$rootScope.expiredTourShown = false;
						$rootScope.editorTourShown = false;
						
						// retrieve site
						Site.retrieve(function(data){
						
							message.showMessage('success');
						
							// set site in $rootScope, session
							$rootScope.site = data;
							$window.sessionStorage.site = JSON.stringify(data);
							
							// set start
							$state.go(start);
								
						});
						
						// pre-cache editor 
						Editor.list(function(data){
		
							// debugging
							if(Setup.debug)console.log('[respond.debug] Editor.list');
							if(Setup.debug)console.log(data);
							
							for (index = 0; index < data.length; ++index) {
								data[index].title = i18n.t(data[index].title);
							}
							$rootScope.editorItems = data;
							$window.sessionStorage.editorItems = JSON.stringify(data);
							
							// set cache to true so it won't reload scripts
							$.ajaxSetup({
							    cache: true
							});
							
							// holds loaded scripts
							var loaded = [];
							
							// load scripts for all plugins
							for(x=0; x<data.length; x++){
			
								if(data[x].script != undefined){
									var url = Setup.url + '/' + data[x].script;
									
									if(loaded.indexOf(url) == -1){
										$.getScript(url);
										loaded.push(url);
										if(Setup.debug)console.log('[respond.debug] load plugin script='+url);
									}
								}
								
							}
							
						});
						
						
					}
					else{
						if(Setup.debug)console.log('[respond.error] user does not have admin privileges');
						message.showMessage('error');
					}
					
				},
				function(){		// failure
					message.showMessage('error');
				});
			
		};
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // create controller
	.controller('MenuCtrl', function($scope, $rootScope, $state, $window, $i18next, Setup, Site, User) {

		// get user from session
		$scope.user = $rootScope.user;
		$scope.site = $rootScope.site;
		$scope.sites = Setup.sites;
		$scope.setup = Setup;
		
		// logs a user out of the site
		$scope.logout = function(){
			$window.sessionStorage.removeItem('user');
			
			// set language back
			$i18next.options.lng =  Setup.language;
			moment.lang(Setup.language);
			
			// go to login
			$state.go('login', {'id': $scope.site.FriendlyId});
			
		}
		
		// publishes a site
		$scope.republish = function(){
			
			message.showMessage('progress');
			
			Site.publish(
				function(){  // success
					
					// set version
					$rootScope.site.Version = Setup.version;
					$scope.site.Version = Setup.version;
					
					// show success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
			
		}
		
		// deploys the site
		$scope.deploy = function(){
			
			message.showMessage('progress');
			
			Site.deploy(
				function(){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
			
		}
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
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
(function() {
    
    angular.module('respond.controllers')
    
	// pages controller
	.controller('PagesCtrl', function($scope, $rootScope, $state, $i18next, Setup, PageType, Page, Stylesheet, Layout, User, Translation) {
	
		// retrieve user
		$scope.user = $rootScope.user;
		$scope.site = $rootScope.site;
		$rootScope.template = 'pages';
		$scope.canEditTypes = false;
		$scope.canRemovePage = false;
		
		// setup
		$scope.predicate = 'LastModifiedDate';
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.pageTypeId = -1;
		
		$scope.current = null;
		$scope.temp = null;
		
		// sets the predicate
		$scope.setPredicate = function(predicate){
			$scope.predicate = predicate;
		}
		
		if($scope.user.Role == 'Admin'){
			$scope.canEditTypes = true;
		}
		
		$scope.signUp = function(){
			$state.go('app.signup');
		}
		
		// sets the pageTypeId
		$scope.setPageType = function(pageType){
			$scope.current = pageType;
			$scope.pageTypeId = pageType.PageTypeId;
			$rootScope.currentPageType = pageType;
			
			// set canremove for pagetype
			if($scope.user.CanRemove == 'All' || $scope.user.CanRemove.indexOf($scope.pageTypeId) != -1){
				$scope.canRemovePage = true;
			}
			
			// show the expired tour
			if($scope.site.Status == 'Trial'){
				if($scope.isTrialOver() == true && $rootScope.expiredTourShown == false){
					tour.expired();
					$rootScope.expiredTourShown = true;
				}
			}
			
		}
		
		// shows the page type dialog for editing
		$scope.showEditPageType = function(){
		
			// set temporary model
			$scope.temp = $scope.current;
		
			$('#pageTypeDialog').modal('show');
	    	
	    	$('#pageTypeDialog').find('.edit').show();
			$('#pageTypeDialog').find('.add').hide();
		}
		
		// edits the page type
		$scope.editPageType = function(pageType){
		
			PageType.edit(pageType);
		
			$('#pageTypeDialog').modal('hide');
		}
		
		// shows the page type dialog for adding
		$scope.showAddPageType = function(){
		
			// set temporary model
			$scope.temp = {
				'FriendlyId': '',
				'Layout': '',
				'Stylesheet': '',
				'IsSecure': 0,
				'PageTypeId': ''
			};
		
			$('#pageTypeDialog').modal('show');
	    	
	    	$('#pageTypeDialog').find('.add').show();
			$('#pageTypeDialog').find('.edit').hide();
		}
		
		// adds the page type
		$scope.addPageType = function(pageType){
		
			message.showMessage('progress');
			
			// add pagetype
			PageType.add(pageType,
				function(data){  // success
					message.showMessage('success');
					$('#pageTypeDialog').modal('hide');
					
					// update pages list if duplicated
					if(pageType.PageTypeId != ''){
						$scope.listPages();
					}
					
				},
				function(){  // failure
					message.showMessage('error');
					$('#pageTypeDialog').modal('hide');
				});
			
		}
		
		// shows the remove page type dialog
		$scope.showRemovePageType = function(pageType){
		
			// set temporary model
			$scope.temp = pageType;
		
			$('#removePageTypeDialog').modal('show');
		}
		
		// removes the page type
		$scope.removePageType = function(pageType){
		
			PageType.remove(pageType);
		
			$('#removePageTypeDialog').modal('hide');
			
			$scope.setPageType($scope.pageTypes[0]);
		}
		
		// shows the edit tags dialog
		$scope.showEditTags = function(page){
		
			// set temporary model
			$scope.temp = page;
		
			$('#editTagsDialog').modal('show');
		}
		
		// edit tags
		$scope.editTags = function(page){
		
			message.showMessage('progress');
		
			Page.editTags(page,
				function(){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		
			$('#editTagsDialog').modal('hide');
		}
	
		// shows the add page dialog
		$scope.showAddPage = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#pageDialog').modal('show');
		}
		
		// adds a page
		$scope.addPage = function(page){
		
			message.showMessage('progress');
		
			Page.add($scope.pageTypeId, page,
				function(data){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		
			$('#pageDialog').modal('hide');
		}
		
		// shows the remove page dialog
		$scope.showRemovePage = function(page){
		
			// set temporary model
			$scope.temp = page;
		
			$('#removePageDialog').modal('show');
		}
	
		// removes a page
		$scope.removePage = function(page){
		
			message.showMessage('progress');
		
			// remove translation for page
			Translation.retrieveDefault(function(){
			
				// clear translations for the page
				Translation.clear(page.PageId);
				
				// save translation
				Translation.save(function(){
					
				});
				
			});
		
			// remove page
			Page.remove(page,
				function(data){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		
			$('#removePageDialog').modal('hide');
		}
		
		// toggles the state of a page
		$scope.togglePublished = function(page){
		
			message.showMessage('progress');
		
			Page.togglePublished(page,
				function(data){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		
			$('#removePageDialog').modal('hide');
		}
		
		// publishes a page
		$scope.togglePublished = function(page){
		
			message.showMessage('progress');
		
			Page.togglePublished(page,
				function(data){  // success
					message.showMessage('success');
				},
				function(){  // failure
					message.showMessage('error');
				});
		
			$('#pageDialog').modal('hide');
		}
		
		// list allowed page types
		PageType.listAllowed(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] PageType.listAllowed');
			if(Setup.debug)console.log(data);
			
			$scope.pageTypes = data;
			
			// set current page type to the last one
			if($rootScope.currentPageType != null){
				$scope.setPageType($rootScope.currentPageType);
			}
			else if($scope.pageTypes.length > 0){
				$scope.setPageType($scope.pageTypes[0]);
			}
			
		});
		
		// list pages
		$scope.listPages = function(){
		
			Page.invalidateCache();
		
			// list pages
			Page.listAllowed(function(data){
				
				// debugging
				if(Setup.debug)console.log('[respond.debug] Page.listAllowed');
				if(Setup.debug)console.log(data);
				
				$scope.pages = data;
				$scope.loading = false;
				
			});
			
		}
		
		// list pages by default
		$scope.listPages();
		
		// setup tour
		setTimeout(function(){
				$scope.setupTour();
			}, 1);
		
		// list stylesheets
		Stylesheet.list(function(data){
			
			// debugging
			if(Setup.debug)console.log('[respond.debug] Stylesheet.list');
			if(Setup.debug)console.log(data);
			
			$scope.stylesheets = data;
		});
		
		// list layouts
		Layout.list(function(data){
			
			// debugging
			if(Setup.debug)console.log('[respond.debug] Layout.list');
			if(Setup.debug)console.log(data);
			
			$scope.layouts = data;
		});
		
		// show the intro tour automatically upon initial login
		$scope.setupTour = function(){
			
			// show the intro tour
			if($rootScope.firstLogin == true && $rootScope.introTourShown == false){
				tour.intro();
				$rootScope.introTourShown = true;
			}
		}
		
		// shows the intro tour on demand
		$scope.showIntro = function(){
			tour.intro();
		}
		
		// determines if the trial is over
		$scope.isTrialOver = function(){
			
			var length = $scope.setup.trialLength;
			var now = moment.utc();
	
	    	var st = moment.utc($scope.site.Created, 'YYYY-MM-DD HH:mm:ss');
			
			var difference = length - now.diff(st, 'days');
			
			// expired when the difference is less then 0
			if(difference < 0){
				return true;
			}
			else{
				return false;
			}
			
		}
		
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // profile controller
	.controller('ProfileCtrl', function($scope, $rootScope, Setup, User, Language) {
	
		$rootScope.template = 'profile';
		
		// setup
		$scope.user = $rootScope.user;
		$scope.user.Password = 'temppassword';
		
		// get languages
		Language.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Language.list');
			if(Setup.debug)console.log(data);
			
			$scope.languages = data;
		});
	
		
		// save profile
		$scope.save = function(){
			message.showMessage('progress');
		
			User.editProfile($scope.user, function(){
				message.showMessage('success');
			});
		}
	
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // reset controller
	.controller('ResetCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
	
		$rootScope.template = 'login';
		
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$scope.token = $stateParams.token;
		$window.sessionStorage.loginId = $stateParams.id;
		
		// reset
		$scope.reset = function(user){
		
			message.showMessage('progress');
			
			// login user
			User.reset($scope.token, user.password, $scope.friendlyId,
				function(data){		// success
					message.showMessage('success');
					$scope.user.password = '';		
				},
				function(){		// failure
					message.showMessage('error');
				});
			
		};
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // roles controller
	.controller('RolesCtrl', function($scope, $rootScope, Setup, Role, PageType) {
		
		$rootScope.template = 'roles';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.temp = null;
		$scope.isDefault = true;
		
		// handle checkbox clicking
		$('body').on('click', '.chk-view-all', function(){
			$('.chk-view').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-edit-all', function(){
			$('.chk-edit').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-publish-all', function(){
			$('.chk-publish').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-remove-all', function(){
			$('.chk-remove').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-create-all', function(){
			$('.chk-create').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-view', function(){
			$('.chk-view-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-edit', function(){
			$('.chk-edit-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-publish', function(){
			$('.chk-publish-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-remove', function(){
			$('.chk-remove-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-create', function(){
			$('.chk-create-all').removeAttr('checked');
		});
	
		// list roles
		Role.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Role.list');
			if(Setup.debug)console.log(data);
			
			$scope.roles = data;
			$scope.loading = false;
		});
		
		// list all page types
		PageType.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] PageType.list');
			if(Setup.debug)console.log(data);
			
			$scope.pageTypes = data;
		});
		
		// sets up the checkboxes in the dialog
		$scope.setupCheckboxes = function(view, edit, publish, remove, create){
		
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
		
			// check view boxes
			if(view == 'All'){
				$('#addEditDialog').find('.chk-view-all').attr('checked', 'checked');
			}
			else{
				var list = view.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-view-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check edit boxes
			if(edit == 'All'){
				$('#addEditDialog').find('.chk-edit-all').attr('checked', 'checked');
			}
			else{
				var list = edit.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-edit-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check publish boxes
			if(publish == 'All'){
				$('.chk-publish-all').attr('checked', 'checked');
			}
			else{
				var list = publish.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-publish-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check remove boxes
			if(remove == 'All'){
				$('#addEditDialog').find('.chk-remove-all').attr('checked', 'checked');
			}
			else{
				var list = remove.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-remove-'+list[x]).attr('checked', 'checked');
				}
			}
			
			// check create boxes
			if(create == 'All'){
				$('#addEditDialog').find('.chk-create-all').attr('checked', 'checked');
			}
			else{
				var list = create.split(',');
				
				for(x=0; x<list.length; x++){
					$('#addEditDialog').find('.chk-create-'+list[x]).attr('checked', 'checked');
				}
			}
		}
		
		// shows the default values
		$scope.showDefault = function(role){
			
			// set default
			$scope.isDefault = true;
			
			// setup the checkboxes
			if(role == 'Admin'){
				$scope.setupCheckboxes('All', 'All', 'All', 'All', 'All');
			}
			else if(role == 'Contributor'){
				$scope.setupCheckboxes('All', 'All', '', '', '');
			}
			else if(role == 'Member'){
				$scope.setupCheckboxes('All', '', '', '', '');
			}
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.edit').show();
			$('#addEditDialog').find('.add').hide();
			
		}
		
		// shows the role dialog for editing
		$scope.showEditRole = function(role){
		
			// set default
			$scope.isDefault = false;
		
			// set temporary model
			$scope.temp = role;
		
			// setup the checkboxes
			$scope.setupCheckboxes(role.CanView, role.CanEdit, role.CanPublish, role.CanRemove, role.CanCreate)
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.edit').show();
			$('#addEditDialog').find('.add').hide();
		}
		
		// gets value
		$scope.getPermissions = function(type){
			
			var canDo = '';
			
			// get permissions 
			if($('.chk-'+type+'-all').prop('checked')){
				canDo = 'All';
			}
			else{
				var checks = $('.chk-' + type);
				
				for(x=0; x<checks.length; x++){
					if($(checks[x]).prop('checked')){
						canDo += $(checks[x]).val() + ',';
					}
				}		
			}
			
			// replace trailing comma and trim
			canDo = canDo.replace(/(^,)|(,$)/g, "");
			canDo = $.trim(canDo);
			
			return canDo;
		}
		
		// edits the role
		$scope.editRole = function(role){
		
			// set permissions
			role.CanView = $scope.getPermissions('view');
			role.CanEdit = $scope.getPermissions('edit');
			role.CanPublish = $scope.getPermissions('publish');
			role.CanRemove = $scope.getPermissions('remove');
			role.CanCreate = $scope.getPermissions('create');
		
			message.showMessage('progress');
		
			Role.edit(role, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the dialog to add a role
		$scope.showAddRole = function(){
		
			// set default
			$scope.isDefault = false;
		
			// set temporary model
			$scope.temp = {
				Name: '', 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''};
			
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').show();
			$('#addEditDialog').find('.edit').hide();
		}
		
		// adds the role
		$scope.addRole = function(role){
		
			// set permissions
			role.CanView = $scope.getPermissions('view');
			role.CanEdit = $scope.getPermissions('edit');
			role.CanPublish = $scope.getPermissions('publish');
			role.CanRemove = $scope.getPermissions('remove');
			role.CanCreate = $scope.getPermissions('create');
		
			message.showMessage('progress');
		
			Role.add(role, function(){
				message.showMessage('success');
			});
			
			$('#addEditDialog').modal('hide');
		}
		
		// shows the remove role dialog
		$scope.showRemoveRole = function(role){
		
			// set temporary model
			$scope.temp = role;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the role
		$scope.removeRole = function(role){
		
			Role.remove(role);
		
			$('#removeDialog').modal('hide');
		}
	
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // scripts controller
	.controller('ScriptsCtrl', function($scope, $rootScope, Setup, Script) {
	
		$rootScope.template = 'scripts';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.content = '';
		
		// set code mirror options
		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
			mode: 'text/javascript',
	    };
		
		// set name
		$scope.setName = function(name){
			$scope.name = name;
			
			// retrieve content for layout
			Script.retrieve(name, function(data){
				$scope.content = data;
			});
		}
		
		// list files
		Script.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Script.list');
			if(Setup.debug)console.log(data);
			
			$scope.files = data;
			
			// retrieve content for first layout
			if(data.length > 0){
				
				$scope.setName(data[0]);
			}
		});
		
		// shows the add file dialog
		$scope.showAddFile = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#addDialog').modal('show');
		}
		
		// adds a file
		$scope.addFile = function(file){
		
			message.showMessage('progress');
		
			Script.add(file, function(){
				message.showMessage('success');
			});
		
			$('#addDialog').modal('hide');
		}
		
		// shows the remove file dialog
		$scope.showRemoveFile = function(file){
		
			// set temporary model
			$scope.temp = file;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the file
		$scope.removeFile = function(file){
		
			message.showMessage('progress');
		
			Script.remove(file, function(){
				$scope.file = '';  // #todo
				
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// publishes a script
		$scope.publish = function(){
			
			message.showMessage('progress');
			
			Script.publish($scope.name, $scope.content, function(){
				message.showMessage('success');
			});
			
		}
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // settings controller
	.controller('SettingsCtrl', function($scope, $window, $rootScope, Setup, Site, Currency) {
		
		$rootScope.template = 'settings';
		
		// setup
		$scope.setup = Setup;
		
		// set the from value to the previous to value
	    $(document).on('focus', '.to', function(){ 
	        
	        var from = $(this).parent().parent().find('.from');
			$(this).removeClass('error');
	        
	        if(from){
	        
	        	var to = $(this).parent().parent().prev().find('.to');
	      
	        	if(to){
					$(from).text($(to).val());
				}
				else{
					$(from).text(0);
				}
	        }
		    
	    });
	    
	    $(document).on('blur', '.to', function(){
	    
	    	var to = Number($(this).val().replace(/[^0-9\.]+/g, ''));
	    	
			$(this).val(to);
			
			var prev = $(this).parent().parent().prev().find('.to');
			
			if(prev){
				prev = Number($(prev).val().replace(/[^0-9\.]+/g, ''));
				
				if(to < prev){
					$(this).addClass('error');
					$(this).val('');
				}
			}
	    
	    });
		
		// retrieve site
		Site.retrieve(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Site.retrieve');
			if(Setup.debug)console.log(data);
			
			$scope.site = data;
			$scope.site.SMTPPassword = 'temppassword';
			
			var calc = $scope.site.ShippingCalculation;
			var tiers = $scope.site.ShippingTiers;
			
			// set calculation
			if(calc == 'amount' || calc == 'weight'){
		                
	            var tiers = JSON.parse(tiers);
	            var tos = $('.shipping-'+calc).find('.to');
		        var froms = $('.shipping-'+calc).find('.from');
		        var rates = $('.shipping-'+calc).find('.rate');
	            
	            // set tiers
	            for(x=0; x<tiers.length; x++){
	                var tier = tiers[x];
	                $(froms[x]).text(tier.from); 
	                $(tos[x]).val(tier.to);
	                $(rates[x]).val(tier.rate); 
	  
	            }
	            
	        }
			
		});
		
		// save settings
		$scope.save = function(){
			
			// set tiers
			var calc = $scope.site.ShippingCalculation;
			var shippingTiers = '';
			
	        if(calc == 'amount' || calc == 'weight'){
		        
		        var tos = $('.shipping-'+calc).find('.to');
		        var froms = $('.shipping-'+calc).find('.from');
		        var rates = $('.shipping-'+calc).find('.rate');
		        
		        var tiers = []; // create array
		        
		        for(x=0; x<tos.length; x++){
			        
			        var from = Number($(froms[x]).text().replace(/[^0-9\.]+/g,""));
			        var to = Number($(tos[x]).val().replace(/[^0-9\.]+/g,""));
			        var rate = Number($(rates[x]).val().replace(/[^0-9\.]+/g,""));
			        
			        if(jQuery.trim($(tos[x]).val()) != '' && to != 0){
				        var tier = {
					        'from': from,
					        'to': to,
					        'rate': rate
				        }
				        
				        tiers.push(tier);
			        }
			        
		        }
		        
		        // set JSON for tiers
		        shippingTiers = JSON.stringify(tiers);
		        
		        // update model
		        $scope.site.ShippingTiers = shippingTiers;
	        }
	        
	        
	        message.showMessage('progress');
	        
	        Site.save($scope.site, function(){
		        message.showMessage('success');
	        },
	        function(){
		     	message.showMessage('error');   
	        });
			
			
		};
		
		// retrieve currencies
		Currency.list(function(data){
			$scope.currencies = data;
		});
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // styles controller
	.controller('StylesCtrl', function($scope, $rootScope, Setup, Stylesheet) {
	
		$rootScope.template = 'styles';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.content = '';
		
		$scope.showError = false;
		
		// set code mirror options
		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
			mode: 'text/css',
	    };
		
		// set name
		$scope.setName = function(name){
			
			$scope.name = name;
			
			// retrieve content for layout
			Stylesheet.retrieve(name, function(data){
				$scope.content = data;
			});
		}
		
		// list files
		Stylesheet.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Stylesheet.list');
			if(Setup.debug)console.log(data);
			
			$scope.files = data;
			
			// retrieve content for first layout
			if(data.length > 0){
				$scope.setName(data[0]);
			}
		});
		
		// shows the add file dialog
		$scope.showAddFile = function(){
		
			// set temporary model
			$scope.temp = null;
		
			$('#addDialog').modal('show');
		}
		
		// adds a file
		$scope.addFile = function(file){
		
			message.showMessage('progress');
		
			Stylesheet.add(file, function(){
				message.showMessage('success');
			});
		
			$('#addDialog').modal('hide');
		}
		
		// shows the remove file dialog
		$scope.showRemoveFile = function(file){
			
			// set temporary model
			$scope.temp = file;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the file
		$scope.removeFile = function(file){
		
			message.showMessage('progress');
		
			Stylesheet.remove(file, function(){
				$scope.file = '';  // #todo
				
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// publishes a layout
		$scope.publish = function(){
			
			message.showMessage('progress');
			
			Stylesheet.publish($scope.name, $scope.content, function(){
				message.showMessage('success');
				$scope.showError = false;
			}, function(){
				$scope.showError = true;
			});
			
		}
		
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // thankyou controller
	.controller('ThankyouCtrl', function($scope, $window, $stateParams, $rootScope, $i18next, Setup) {
	
		$rootScope.template = 'thankyou';
		
		// setup
		$scope.setup = Setup;
	})
	
})();
(function() {
    
    angular.module('respond.controllers')
    
    // theme controller
	.controller('ThemeCtrl', function($scope, $rootScope, Setup, Theme, Site) {
		
		$rootScope.template = 'theme';
		
		// setup
		$scope.setup = Setup;
		
	    $scope.themeId = Site.Theme;
	    
	    // back
		$scope.back = function(){
			window.history.back();
		}
	    
	    // setup carousel
		$('#update-theme').carousel({
			interval: false,
			wrap: true
		});
		
		// set next
		$scope.next = function(){
			$('#update-theme').carousel('next');
		}
		
		$scope.previous = function(){
			$('#update-theme').carousel('prev');
		}
	   
	    // sets a theme
	    $scope.setThemeId = function(id){
	    	$scope.themeId = id;
	    }
	    
	    // get themes
		Theme.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Theme.list');
			if(Setup.debug)console.log(data);
			
			$scope.themes = data;
		});
		
		// retrieve site
		Site.retrieve(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Site.retrieve');
			if(Setup.debug)console.log(data);
			
			$scope.site = data;
			
			$scope.themeId = data.Theme;
		});
		
		// shows the dialog to apply a new theme
		$scope.showApply = function(theme){
		
			// set temporary model
			$scope.temp = theme;
			$scope.replaceContent = true;
		
			$('#applyDialog').modal('show');
	    	
		}
		
		// applies a new theme
		$scope.applyTheme = function(theme){
			
			message.showMessage('progress');
		
			// apply the theme
			Theme.apply(theme.name, $scope.replaceContent,
				function(){
					 message.showMessage('success');
					 
					 $scope.themeId = theme.name;
				});
		
			// hide the modal
			$('#applyDialog').modal('hide');
		}
		
		// shows the dialog to reset the current theme
		$scope.showReset = function(theme){
		
			// set temporary model
			$scope.temp = theme;
		
			$('#resetDialog').modal('show');
	    	
		}
		
		// resets current theme
		$scope.resetTheme = function(theme){
		
			message.showMessage('progress');
		
			// reset the theme
			Theme.reset(theme.name, 
				function(){
					 message.showMessage('success');
				});
		
			$('#resetDialog').modal('hide');
		}
		
	})

	
})();
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
(function() {
    
    angular.module('respond.controllers')
    
    // users controller
	.controller('UsersCtrl', function($scope, $rootScope, Setup, User, Role, Language, Image, File) {
		
		$rootScope.template = 'users';
		
		// setup
		$scope.setup = Setup;
		$scope.loading = true;
		$scope.temp = null;
		$scope.userLimit = $rootScope.site.UserLimit;
		$scope.canAdd = false;
		$scope.totalSize = 0;
		$scope.fileLimit = $rootScope.site.FileLimit;
		
		// list users
		User.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] User.list');
			if(Setup.debug)console.log(data);
			
			$scope.users = data;
			$scope.loading = false;
			
			if($scope.users.length < $scope.userLimit){
				$scope.canAdd = true;
			}
		});
		
		// get languages
		Language.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Language.list');
			if(Setup.debug)console.log(data);
			
			$scope.languages = data;
		});
		
		// get roles
		Role.list(function(data){
		
			// debugging
			if(Setup.debug)console.log('[respond.debug] Role.list');
			if(Setup.debug)console.log(data);
			
			// push admin, contributor and member
			data.push({
				RoleId: 'Admin',
				Name: i18n.t('Admin'), 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''});
				
			data.push({
				RoleId: 'Contributor',
				Name: i18n.t('Contributor'), 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''});
				
			data.push({
				RoleId: 'Member',
				Name: i18n.t('Member'), 
				CanView: '', 
				CanEdit: '', 
				CanPublish: '', 
				CanRemove: '', 
				CanCreate: ''});
			
			$scope.roles = data;
		});
		
		// shows the user dialog for editing
		$scope.showEditUser = function(user){
		
			// set temporary model
			$scope.temp = user;
			
			$scope.temp.Password = 'temppassword';
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.edit').show();
			$('#addEditDialog').find('.add').hide();
		}
		
		// edits the user
		$scope.editUser = function(user){
		
			message.showMessage('progress');
		
			User.edit(user, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the dialog to add a user
		$scope.showAddUser = function(){
		
			// set temporary model
			$scope.temp = {
				firstName: '', 
				lastName: '', 
				role: 'Admin', 
				language: 'en', 
				isActive: '1', 
				email: '', 
				password: ''};
		
			$('#addEditDialog').modal('show');
	    	
	    	$('#addEditDialog').find('.add').show();
			$('#addEditDialog').find('.edit').hide();
		}
		
		// adds the user
		$scope.addUser = function(user){
		
			message.showMessage('progress');
		
			User.add(user, function(){
				message.showMessage('success');
			});
		
			$('#addEditDialog').modal('hide');
		}
		
		// shows the remove user dialog
		$scope.showRemoveUser = function(user){
		
			// set temporary model
			$scope.temp = user;
		
			$('#removeDialog').modal('show');
		}
		
		// removes the user
		$scope.removeUser = function(user){
		
			message.showMessage('progress');
		
			User.remove(user, function(){
				message.showMessage('success');
			});
		
			$('#removeDialog').modal('hide');
		}
		
		// shows the images dialog
		$scope.showAddImage = function(user){
			$scope.temp = user;
			
			$('#imagesDialog').modal('show');
		}
		
		// list new images
		$scope.updateImages = function(){
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
		
		// update the images for the dialog
		$scope.updateImages();
		
		// add image
		$scope.addImage = function(image){
		
			message.showMessage('progress');
		
			User.addImage($scope.temp.UserId, image, function(){
				message.showMessage('success');
			});
		
			$('#imagesDialog').modal('hide');
		}
	
	
	})

	
})();