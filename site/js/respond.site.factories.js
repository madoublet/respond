angular.module('respond.site.factories', [])

// site factory
.factory('Site', function($http){
	
	var site = {};
	
	// retrieve languages
	site.retrieve = function(callback){
	
		// post to API
		$http.get('data/site.json', {cache:true})
			.success(callback);
	}
	
	return site;
	
})

// adds authentication header to API requests, #ref: https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
	return {
		request:function (config) {
			config.headers = config.headers || {};
			if($window.sessionStorage.token){
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			
			return config || $q.when(config);
		},
	
		responseError:function(rejection){
			
			if(rejection.status === 401){
				// handle the case where the user is not authenticated
				//location.href = Setup.url;
				//alert('401');
				$location.path('login');
			}
			
			return $q.reject(rejection);
		}
	};
})

// setup factory
.factory('Menu', function($http){
	
	var menu = {};
	
	// retrieve languages
	menu.list = function(type, callback){
	
		// list menu by type
		$http.get('data/menu-' + type + '.json')
			.success(callback);
	}
	
	return menu;
	
})

// setup factory
.factory('Page', function($http, $rootScope){
	
	var page = {};
	
	// retrieve languages
	page.list = function(type, pagesize, current, orderby, successCallback, failureCallback){
		
		// set params
		var params = {
			siteId: $rootScope.site.SiteId,
			type: type,
			pagesize: pagesize,
			current: current,
			orderby: orderby
		}
		// set post to URL Encoded
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
		// post to API
		$http.post($rootScope.site.API + '/page/published/list', $.param(params))
			.success(successCallback)
			.error(failureCallback);
			
	}
	
	return page;
	
})

// user factory
.factory('User', function($http, $rootScope, $window){

	var user = {};
	
	// login API call
	user.login = function(email, password, siteId, successCallback, failureCallback){
	
		// set params
		var params = {
			email: email,
			password: password,
			siteId: siteId
		}
		
		console.log(params);
	
		// set post to URL Encoded
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
		// post to API
		$http.post($rootScope.site.API + '/user/login', $.param(params))
			.success(successCallback)
			.error(failureCallback);
					
	}
	
	// add a user
	user.add = function(toBeAdded, siteId, successCallback, failureCallback){
		
		// set params
		var params = {
			siteId: siteId,
			firstName: toBeAdded.FirstName, 
			lastName: toBeAdded.LastName, 
			email: toBeAdded.Email, 
			password: toBeAdded.Password};
		
		// set post to URL Encoded
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
		// post to API
		$http.post($rootScope.site.API + '/user/add/member', $.param(params))
			.success(successCallback)
			.error(failureCallback);
			
	}
	
	return user;
	
})

// setup factory
.factory('Form', function($http, $rootScope){
	
	var form = {};
	
	// submit form
	form.submit = function(pageId, params, successCallback, failureCallback){
	
		params['siteId'] = $rootScope.site.SiteId;
		params['pageId'] = pageId;
		
		// set post to URL Encoded
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
		// post to API
		$http.post($rootScope.site.API + '/form', $.param(params))
			.success(successCallback)
			.error(failureCallback);
			
	}
	
	return form;
	
})

// setup factory
.factory('Translation', function($http, $rootScope){
	
	var translation = {};
	translation.locales = [];
	
	// searches translations for a given term
	translation.search = function(term, locale, callback){
	
		// set params
		var params = {
				siteId: $rootScope.site.SiteId,
				locale: locale
			};
			
		console.log('search params');
		console.log(params);
			
		// set post to URL Encoded
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
		// post to API
		$http.post($rootScope.site.API + '/translation/retrieve', $.param(params))
			.then(function(res){
			
				// retrieve translations from the api
				var data = res.data;
				
				// holds pages to be returned
				var pages = [];
				
				// top level
				for(x in data){
				
					// pages are stored in objects
					if(typeof(data[x]) == 'object'){
					
						// this is what will be returned
						var page = {
							PageId: x,
							Name: data[x]['name'],
							Url: data[x]['url'],
							Description: data[x]['description']
						}
						
						// walk through data[x]
						for(y in data[x]){
						
							var text = data[x][y].toLowerCase();
						
							// searh for the term
							if(text.search(new RegExp(term.toLowerCase(), 'i')) != -1){
								
								// push found pages
								pages.push(page);
								
								break;
									
							}
			
						}
						
					}
				
					
				}
				
				return pages;
				
			})
			.then(callback);
	}
	
	// retrieve locales for site
	translation.listLocales = function(callback){
	
		// set params
		var params = {
			siteId: $rootScope.site.SiteId};
	
		// post to API
		$http.post($rootScope.site.API + '/translation/list/locales', $.param(params))
			.then(function(res){
			
				// set data for factory
				translation.locales = res.data;
				return res.data;
				
			})
			.then(callback);
	}
	
	return translation;
	
})

// setup factory
.factory('Transaction', function($http, $rootScope){
	
	var transaction = {};
	
	// retrieve languages
	transaction.receipt = function(processorTransactionId, callback){
		
		// set params
		var params = {
			processorTransactionId: processorTransactionId
		}
		// set post to URL Encoded
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
		// post to API
		$http.post($rootScope.site.API + '/transaction/receipt', $.param(params))
			.success(callback);
			
	}
	
	return transaction;
	
})
;