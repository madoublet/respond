// page controller
.controller('PageCtrl', function($scope, $location, $rootScope, $attrs) {

	// set user
	$scope.user = $rootScope.user;
	$rootScope.timeStamp = '';
	
	// get timestamp (if set)
	var t = respond.utilities.getQueryStringByName('t');
	
	// set page variables
	var pages = {{pages}};
	
	// get pageid
	var pageid = $attrs.page;
	
	// get current page
	var page = pages[pageid];
	
	// append a timestamp for previews
	if(t != '' && t != undefined){
		page.FullStylesheetUrl = page.FullStylesheetUrl + '?t='+t;
		$rootScope.timeStamp = '?t='+t;
	}
	
	// set site variables
	var site = {{site}};
	
	// redirect if user is not logged in
	if(page.IsSecure == true && $scope.user == null){
		
		console.log('[respond.message] page requires login, user not logged in');
			
		$state.go('login');
		
	}
	else if(page.IsSecure == true && $scope.user != null){	// check if the user is allowed to view the site
		
		var isAllowed = false;
		
		// users with All can view the page
		if($rootScope.user.CanView == 'All'){
			console.log('[respond.message] valid permissions');
			isAllowed = true;
		}
		else if($rootScope.user.CanView.indexOf(page.PageTypeId) != -1){
			console.log('[respond.message] valid permissions');
			isAllowed = true;
		}
		
		if(isAllowed == false){
			console.log('[respond.message] invalid permissions');
			$state.go('login');
		}
		else{
			console.log('[respond.message] valid permissions');
		}
		
	}
	
	// set page to $scope and $rootScope
	$scope.page = page
	$rootScope.page = page;
	
	// set site to scope and $rootscope
	$scope.site = site;
	$rootScope.site = $scope.site;
	
	// set fullLogoUrl
	$scope.fullLogoUrl = $scope.site.ImagesUrl + $scope.site.LogoUrl;
	
	// set cart to scope
	$scope.cart = $rootScope.cart;
		
	// toggle settings
	$scope.toggleSettings = function(){
		$('body').removeClass('show-cart');
		$('body').removeClass('show-search');
	
		$('body').toggleClass('show-settings');
	}
	
	// toggle cart
	$scope.toggleCart = function(){
		$('body').removeClass('show-settings');
		$('body').removeClass('show-search');
	
		$('body').toggleClass('show-cart');
	}
	
	// toggle search
	$scope.toggleSearch = function(){
		$('body').removeClass('show-settings');
		$('body').removeClass('show-cart');
	
		$('body').toggleClass('show-search');
	}

})