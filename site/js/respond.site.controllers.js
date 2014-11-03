angular.module('respond.site.controllers', [])

// app controller
.controller('PageCtrl', function($scope, $state, $location, $rootScope, pageMeta, siteMeta, Site) {

	// set user
	$scope.user = $rootScope.user;
	
	// redirect if user is not logged in
	if(pageMeta.IsSecure == true && $scope.user == null){
		
		console.log('[respond.message] page requires login, user not logged in');
			
		$state.go('login');
		
	}
	else if(pageMeta.IsSecure == true && $scope.user != null){	// check if the user is allowed to view the site
		
		var isAllowed = false;
		
		// users with All can view the page
		if($rootScope.user.CanView == 'All'){
			console.log('[respond.message] valid permissions');
			isAllowed = true;
		}
		else if($rootScope.user.CanView.indexOf(pageMeta.PageTypeId) != -1){
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
	
	// set page variables from route meta
	var page = {
		PageId: pageMeta.PageId,
		Url: pageMeta.Url,
		FriendlyId: pageMeta.FriendlyId,
		Name: pageMeta.Name,
		Description: pageMeta.Description,
		Keywords: pageMeta.Keywords,
		Callout: pageMeta.Callout,
		BeginDate: pageMeta.BeginDate,
		EndDate: pageMeta.EndDate,
		Location: pageMeta.Location,
		LatLong: pageMeta.LatLong,
		Layout: pageMeta.Layout,
		Stylesheet: pageMeta.Stylesheet,
		FullStylesheetUrl: pageMeta.FullStylesheetUrl,
		Image: pageMeta.Image,
		LastModifiedDate: pageMeta.LastModifiedDate,
		FirstName: pageMeta.FirstName,
		LastName: pageMeta.LastName,
		PhotoUrl: pageMeta.PhotoUrl
	}
	
	// set page to $scope and $rootScope
	$scope.page = page
	$rootScope.page = page;
	
	// set site to scope and $rootscope
	$scope.site = siteMeta.data;
	$rootScope.site = $scope.site;
	
	// set fullLogoUrl
	$scope.fullLogoUrl = $scope.site.ImagesURL + $scope.site.LogoUrl;
	
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

});