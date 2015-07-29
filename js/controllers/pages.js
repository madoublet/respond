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