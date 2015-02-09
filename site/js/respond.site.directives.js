angular.module('respond.site.directives', [])

// menu
.directive('respondMenu', function($rootScope, Menu){
	
	return{
		
		restrict: 'E',
		scope: {
			type: '@'
		},
		replace: true,
		templateUrl: function(element, attr){
			if(attr.standalone){
				return 'templates/respond/menu-standalone.html';
			}
			else{
				return 'templates/respond/menu.html';
			}
		},
		link: function(scope, element, attr){
			
			scope.standalone = false;
			
			if(attr.standalone){
				scope.standalone = attr.standalone;
			}
			
			scope.currentPageId = $rootScope.page.PageId;
			
			Menu.list(scope.type, function(data){
			
				console.log('[respond.debug] Menu.list');
				console.log(data);
				
				scope.menuItems = data;
			});
			
		}
		
	}
	
})

// search
.directive('respondSearch', function($rootScope, $i18next, Translation){
	
	return{
		
		restrict: 'E',
		scope: {
			type: '@'
		},
		replace: true,
		templateUrl: 'templates/respond/search.html',
		link: function(scope, element, attr){
			
			scope.showClose = false;
			
			if(attr.showClose){
				scope.showClose = attr.showClose;
			}
		
			scope.currentPageId = $rootScope.page.PageId;
			scope.term = '';
			scope.showResults = false;
			scope.searching = false;
			scope.noResults = false;
			
			
			$('.dropdown-menu input, .dropdown-menu label').click(function(e) {
		        e.stopPropagation();
		    });
		    
		    // close the search
		    scope.close = function(){
			    $('body').removeClass('show-search');
		    }
			
			// searches the translation files for the term, returns pages that have them
			scope.search = function(){
			
				scope.searching = true;
				
				// open up the dialog
				$(element).addClass('open');
				
				var locale = $i18next.options.lng;
				
				// clear out results
				scope.results = [];
				
				// search translations for the string
				Translation.search(scope.term, locale, function(data){
					
					scope.searching = false;
					scope.results = data;
					
				});
				
				return false;
				
			}
		}
		
	}
	
})

// map
.directive('respondMap', function(Menu){
	
	return{
		
		restrict: 'E',
		scope: {
			zoom: '@',
			address: '@',
			id: '@',		
		},
		templateUrl: 'templates/respond/map.html',
		link: function(scope, element, attr){

			new respond.Map({
				el: $(element),
				id: scope.id,
				address: scope.address,
				zoom: scope.zoom
			});
			
		}
		
	}
	
})

// add point to map
.directive('respondAddPoint', function(Menu){
	
	return{
		
		restrict: 'A',
		link: function(scope, element, attr){
		
			var name = attr.name;
			var location = attr.location;
			var description = attr.description;
			var url = attr.url;	// conver URL to href
			var latLong = attr.latLong;
			var mapId = attr.mapId;
			var latitude = null;
			var longitude = null;
			
			// get latitude and longitude
			if(latLong != null){

				var point = latLong.replace('POINT(', '').replace(')', '');
				var arr = point.split(' ');

				// set latitude and longitude
				latitude = arr[0];
				longitude = arr[1];
			}
			
	
			if(latitude != null && longitude != null){
			
				// create content for map
				var content = '<div class="map-marker-content content">' +
									'<h4><a href="' + url + '">' + name + '</a></h4>' +
									'<h5>' + location + '</h5>' +
									'<p>' + description + '</p>' +
									'</div>';
				
				// add point
				respond.Map.CreatePoint(mapId, 'auto', latitude, longitude, content);
				
			}
				
			
		}
		
	}
	
})

// calendar
.directive('respondCalendar', function(Menu){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@',		
		},
		templateUrl: 'templates/respond/calendar.html',
		link: function(scope, element, attr){

			new respond.Calendar({
				el: $(element).find('.respond-calendar').get(0),
				weeks: 2
			});
			
		}
		
	}
	
})

// map
.directive('respondAddEvent', function(Menu){
	
	return{
		
		restrict: 'A',
		link: function(scope, element, attr){
		
			var name = attr.name;
			var location = attr.location;
			var description = attr.description;
			var url = attr.url;	// conver URL to href
			var beginDate = attr.beginDate;
			var endDate = attr.endDate;
			var calendarId = attr.calendarId;
		
			if(beginDate != null && endDate != null){
			
				// create begin and end from moment
				var m_begin = moment(beginDate, "YYYY-MM-DD HH:mm:ss");
				var m_end = moment(endDate, "YYYY-MM-DD HH:mm:ss");
			
				// create time display
				var time = m_begin.format('h:mm a') + ' - ' + m_end.format('h:mm a');
			
				// create content for event
				var content = '<div class="event content">' +
										'<h4><a href="' + url + '">' + name + '</a></h4>' +
										'<h5>' + time + '</h5>' +
										'<p>' + description + '</p>' +
										'</div>';
				
				// add even to the calendar
				respond.Calendar.AddEvent(calendarId, beginDate, endDate, content);
			}
				
		}
		
	}
	
})

// content
.directive('respondContent', function(Menu){
	
	return{
		
		restrict: 'E',
		scope: {
			url: '@'
		},
		templateUrl: 'templates/respond/content.html',
		link: function(scope, element, attr){
		
			// set pageId in scope
			scope.page = scope.$parent.page;
			scope.site = scope.$parent.site;
			
			var replaced = scope.url.replace('/', '.');
			
			// show preview
			if(document.URL.indexOf('?preview') != -1 && (scope.pageUrl == scope.url)){
				scope.templateUrl = 'templates/preview/' + replaced + '.html';	
			}
			else{
				scope.templateUrl = 'templates/page/' + replaced + '.html';
			}
			
			
		}
		
	}
	
})

// list
.directive('respondList', function($rootScope, Page){
	
	return{
		
		restrict: 'E',
		scope: {
			url: '@',
			id: '@'
		},
		templateUrl: function(element, attr){
			return 'templates/respond/' + attr.display + '.html';
		},
		link: function(scope, element, attr){
		
			scope.site = $rootScope.site;
		
			// set a nice default
			scope.type = 'list-default';
			
			if(attr.type != undefined){
				scope.type = attr.type;
			}
			
			// set a nice defult
			scope.pagesize = 10;
			
			if(attr.pagesize != undefined){
				scope.pagesize = attr.pagesize;
			}
			
			scope.current = 0; // current page
			scope.count = 0; // count of all items in the list
			scope.pageCount = 1;  // count of pages
			
			// hide pager by default
			scope.showPager = false;
			
			// set a nice defult
			scope.orderby = 'Name';
			
			if(attr.orderby != undefined){
				scope.orderby = attr.orderby;
			}
			
			// set a nice default
			var tag = '';
			
			if(attr.tag != undefined){
				tag = attr.tag;
			}
			
			scope.tag = tag;
			
			scope.pageResults = false;
			
			if(attr.pageresults != undefined){
				scope.pageResults = attr.pageresults;
			}
			
			// update the list
			var list = function(){
		
				// list page
				Page.list(scope.type, scope.pagesize, scope.current, scope.orderby, 
					function(data){  // success
						
						// set list
						scope.pages = data;
						
						// show pager
						if(scope.current < (scope.pageCount-1)){
							scope.showPager = true;
						}
						else{
							scope.showPager = false;
						}
						
						
					},
					function(){ // failure
						
						
					});
				
			}
			
			// get page count
			Page.count(scope.type, function(data){  // success
				
				scope.count = data.count;
				scope.pageCount = Math.ceil(scope.count / scope.pagesize);
				
				// list pages
				list();
					
				},
				function(){ // failure
					
					
				});
		
			// page list
			scope.next = function(){
				
				scope.current++;
				
				list();
				
			}
			
			// page previous
			scope.previous = function(){
				
				scope.current--;
				
				list();
				
			}
			
		}
		
	}
	
})

// form
.directive('respondForm', function($rootScope, Form){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@',
			cssClass: '@',
			type: '@',
			action: '@',
			success: '@',
			error: '@',
			submit: '@'
		},
		transclude: true,
		templateUrl: 'templates/respond/form.html',
		link: function(scope, element, attr){
		
			// setup temporary model
			scope.temp = {
				firstName: ''
			};
		
			// set loading
			scope.showLoading = false;
			scope.showSuccess = false;
			scope.showError = false;		
			
			// handles the form submission
			scope.submitForm = function(temp){
			
				// get reference to fields
				var el = $(element).find('.respond-form-fields');
				
				// get fields scope
				var fscope = angular.element($(el)).scope();
				
				// holds the params from the form
				var params = {};
				
				for(key in fscope.temp){
				
					// everything besides checkboxes should be strings
					if(typeof(fscope.temp[key]) === 'string'){
						params[key] = fscope.temp[key];
					}
					else{ // special handling for checkbox`	
						var str = '';
						var obj = fscope.temp[key]
						
						// build comma separated list of values
						for(skey in obj){
						
							// the false value of the checkbox is blank ('')
							if(obj[skey] != ''){
								str += obj[skey] + ',';
							}
						
						}
						
						// set to key, remove trailing comma
						params[key] = str.replace(/,\s*$/, '');;
					}
				
				}
				
				// submit form
				Form.submit($rootScope.page.PageId, params, 
					function(data){  // success
						scope.showLoading = false;
						scope.showSuccess = true;
						scope.showError = false;
						
					},
					function(){ // failure
						scope.showLoading = false;
						scope.showSuccess = false;
						scope.showError = true;
					});
				
			}
			
		}
		
	}
	
})

// slideshow
.directive('respondSlideshow', function($rootScope){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@',
			interval: '@',
			wrap: '@',
			indicators: '@',
			arrows: '@',
			transition: '@',
			pauseonhover: '@'
		},
		templateUrl: 'templates/respond/slideshow.html',
		transclude: true,
		replace: true,
		link: function(scope, element, attr){

			// setup slideshow
			var $el = $(element);
			
			var containers = $el.find('.carousel-inner>div');
			
			// contains a simple count of images
			scope.images = [];
			
			// set pause
			var pauseOn = '';
			
			if(scope.pauseonhover == 'true'){
				pauseOn = 'hover';
			}
			
			// build indicators
			for(x=0; x<containers.length; x++){
				
				// simple count of images
				scope.images.push(x);
				
				var image = $(containers[x]).find('img');
				var title = $(image).attr('title') || '';
				
				// append the title
				if(title != ''){
					$(containers[x]).append('<div class="carousel-caption"><p>' + title +'</p></div>');
				}
				
			}
		
			
			// add item and active classes to slideshow
			$el.find('.carousel-inner>div').addClass('item');
			$el.find('.carousel-inner>div:first-child').addClass('active');
	
			// create carousel
			$($el).carousel({
				interval: scope.interval,
				pause: pauseOn,
				wrap: scope.wrap
			});
	
			// add next/previous events
			scope.previous = function(){
				$($el).carousel('prev');
			}
			
			scope.next = function(){
				$($el).carousel('next');
			}
			
			scope.go = function(index){
				$($el).carousel(index);
			}
			
		
		}
		
	}
	
})

// login
.directive('respondLogin', function($rootScope, $window, User){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@',
			class: '@',
			success: '@',
			error: '@',
			button: '@'
		},
		transclude: true,
		templateUrl: 'templates/respond/login.html',
		link: function(scope, element, attr){
		 
			// setup user
			scope.toLogin = {
				Email: '',
				Password: ''
			}
			
			// set loading
			scope.showLoading = false;
			scope.showSuccess = false;
			scope.showError = false;
			
			// handle logged in user
			scope.loggedIn = false;
			scope.user = $rootScope.user;
			
			if(scope.user != null){
				scope.loggedIn = true;
			}
			
			// login user
			scope.login = function(toLogin){
				
				// set status
				scope.loading = true;
				scope.showSuccess = false;
				scope.showError = false;
				
				// login user
				User.login(toLogin.Email, toLogin.Password, $rootScope.site.SiteId,
					function(data){		// success
					
						// set user in session
						$window.sessionStorage.user = JSON.stringify(data.user);
						$rootScope.user = data.user;
					
						// set logged in user
						scope.user = data.user
						
						if(scope.user != null){
							scope.loggedIn = true;
						}
						
						// set status
						scope.showLoading = false;
						scope.showError = false;
						scope.showSuccess = true;
						
						
					},
					function(){		// failure
					
						// set status
						scope.showLoading = false;
						scope.showSuccess = false;
						scope.showError = true;
						
					});
				
			}
			
			// logout user
			scope.logout = function(){
				$rootScope.user = null;
				$window.sessionStorage.user = null;
				scope.loggedIn = false;
				
			}
			
		}
		
	}
	
})

// registration
.directive('respondRegistration', function($rootScope, User){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@',
			class: '@',
			success: '@',
			error: '@',
			required: '@',
			button: '@'
		},
		transclude: true,
		templateUrl: 'templates/respond/registration.html',
		link: function(scope, element, attr){
	
			// setup user
			scope.user = {
				FirstName: '',
				LastName: '',
				Email: '',
				Password: ''
			}
			
			// set loading
			scope.showLoading = false;
			scope.showSuccess = false;
			scope.showError = false;
			scope.showRequired = false;
			
			// register user
			scope.register = function(user){
				
				// set status
				scope.loading = true;
				scope.showSuccess = false;
				scope.showError = false;
				
				// login user
				User.add(user, $rootScope.site.SiteId,
					function(data){		// success
						
						// set status
						scope.showLoading = false;
						scope.showError = false;
						scope.showSuccess = true;
					},
					function(){		// failure
					
						// set status
						scope.showLoading = false;
						scope.showSuccess = false;
						scope.showError = true;
					});
				
			}
			
			
		}
		
	}
	
})

// welcome
.directive('respondWelcome', function(User, $rootScope, $window){
	
	return{
		
		restrict: 'E',
		scope: {},
		templateUrl: 'templates/respond/welcome.html',
		link: function(scope, element, attr){
	
			scope.loggedIn = false;
			scope.user = $rootScope.user;
			
			if(scope.user != null){
				scope.loggedIn = true;
			}
			
			// logs a user out
			scope.logout = function(){
				$rootScope.user = null;
				$window.sessionStorage.user = null;
				scope.loggedIn = false;
				scope.user = null;
			}
		}
		
	}
	
})

// welcome
.directive('respondSelectLanguage', function(User, Translation, $i18next){
	
	return{
		
		restrict: 'E',
		scope: {},
		templateUrl: 'templates/respond/select-language.html',
		link: function(scope, element, attr){
		
			scope.language = $i18next.options.lng;
			
			// list locales for the site
			Translation.listLocales(function(data){
				
				scope.locales = data;
				
				console.log('[respond.debug] Translation.listLocales');
				console.log(scope.locales);
				
			});
			
			// sets the language
			scope.setLanguage = function(locale){
				// set language to locale specified
				$i18next.options.lng = locale;
				
				scope.language = locale;
			}
		}
		
	}
	
})

// simple toggle
.directive('respondToggle', function($rootScope){
	
	return{
		
		restrict: 'A',
		scope: {},
		link: function(scope, element, attr){
	
			$(element).on('click', function(){
				
				$('body').toggleClass(attr.toggleClass); 
				
			});
			
		}
		
	}
	
})

// shelf
.directive('respondShelf', function($rootScope, User){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@'
		},
		transclude: true,
		templateUrl: 'templates/respond/shelf.html',
		link: function(scope, element, attr){
						
		}
		
	}
	
})

// shelf item
.directive('respondShelfItem', function($rootScope){
	
	return{
		
		restrict: 'E',
		scope: {
			productid: '@',
			sku: '@',
			name: '@',
			price: '@',
			shipping: '@',
			weight: '@'
		},
		transclude: true,
		replace: true,
		templateUrl: 'templates/respond/shelf-item.html',
		link: function(scope, element, attr){
			
			scope.currency = $rootScope.site.Currency;
			scope.mark = '';
			
			// handle mark
			if($rootScope.site.Currency == 'USD'){
				scope.mark = '$';
			}
			else{
				scope.mark = ' ';
			}
			
			// handle add to cart
			scope.addToCart = function(){
			
				// create item
				var item = {
					sku: scope.productid,
					name: scope.name,
					price: scope.price,
					shipping: scope.shipping,
					weight: scope.weight,
					quantity: 1
				};
				
				// has item
				var newItem = true;
				
				// walkthrough quantity
				for(x=0; x<$rootScope.cart.length; x++){
					
					// if it is a duplicate, increase the quantity
					if($rootScope.cart[x].sku == scope.sku){
						var quantity = $rootScope.cart[x].quantity;
						$rootScope.cart[x].quantity = quantity + 1;
						newItem = false;
					}
					
				}
				
				// push item to the cart
				if(newItem == true){
					$rootScope.cart.push(item);
				}
				
				// save cart to local storage
				var json = JSON.stringify($rootScope.cart);
				sessionStorage['respond-cart'] = json;
			}
						
		}
		
	}
	
})

// builds a receipt based on a transaction
.directive('respondReceipt', function($rootScope, $sce, Transaction){
	
	return{
		
		restrict: 'E',
		scope: {
			id: '@'
		},
		templateUrl: 'templates/respond/receipt.html',
		link: function(scope, element, attr){
					
			// update the list
			var list = function(){
		
				// list the receipt
				Transaction.receipt(scope.id, 
					function(data){  // success
						scope.receipt = $sce.trustAsHtml(data);
						
					});
				
			}
			
			// retrieve the receipt
			list();	
		}
		
	}
	
})

// cart
.directive('respondCart', function($rootScope, $i18next, Translation){
	
	return{
		
		restrict: 'E',
		scope: {
			type: '@'
		},
		replace: true,
		templateUrl: 'templates/respond/cart.html',
		link: function(scope, element, attr){
			
			// show close button
			scope.showClose = false;
			
			if(attr.showClose){
				scope.showClose = attr.showClose;
			}
		
			// close the search
		    scope.close = function(){
			    $('body').removeClass('show-cart');
		    }
		
			// get transaction variable passed from paypal
			var tx = respond.utilities.getQueryStringByName('tx');
			
			// set variable
			$rootScope.tx = tx;
		
			scope.currentPageId = $rootScope.page.PageId;
			scope.cart = $rootScope.cart;
			scope.currency = $rootScope.site.Currency;
			scope.mark = '';
			
			// handle mark
			if($rootScope.site.Currency == 'USD'){
				scope.mark = '$';
			}
			else{
				scope.mark = ' ';
			}
			
			// hide search when the body is clicked
			$('body').on('click', function(){
			
				// open up the dialog
				$(element).removeClass('open');
				
			});
			
			// calculates the subtotal for the cart
			scope.subTotal = function(){
			
				var st = 0;
			
				// subtotal the items in the cart
				for(x=0; x<$rootScope.cart.length; x++){
				
					st = st + ($rootScope.cart[x].price * $rootScope.cart[x].quantity);
				
				}
			
				return st;
			}
			
			// calculates the weight for the cart
			scope.totalWeight = function(){
			
				var w = 0;
			
				// subtotal the items in the cart
				for(x=0; x<$rootScope.cart.length; x++){
				
					if($rootScope.cart[x].weight != null && $rootScope.cart[x].weight != undefined){
						w = w + ($rootScope.cart[x].weight * $rootScope.cart[x].quantity);
					}
				
				}
			
				return w;
			}
			
			// calculates the tax for the cart
			scope.tax = function(){
				return scope.subTotal() * $rootScope.site.TaxRate;
			}
			
			// get the number of items that are shipped
			scope.countShipped = function(){
				
				var count = 0;
			
				// walk through cart
				for(x=0; x<$rootScope.cart.length; x++){
				
					//console.log($rootScope.cart[x].shipping);
				
					if($.trim($rootScope.cart[x].shipping) == 'shipped'){
						count = count + $rootScope.cart[x].quantity;
						
					}
				
				}
			
				return count;
				
			}
			
			// calculates shipping for the cart
			scope.shipping = function(){
			
				// set default stop
				var stop = 0;
				
				// get subtotal and weight
				var subTotal = scope.subTotal();
				var totalWeight = scope.totalWeight();
				var countShipped = scope.countShipped();
				
				//console.log('# SHIPPED = ' + countShipped);
				
				// get params
				var calculation = $rootScope.site.ShippingCalculation;	
				var rate = $rootScope.site.ShippingRate;
				var tiers = [];
				
				// get tiers
				if($rootScope.site.ShippingTiers != '' && $rootScope.site.ShippingTiers != null){
					tiers = JSON.parse(decodeURI($rootScope.site.ShippingTiers));
				}
			
				// free, flat-rate, etc
				if(calculation == 'free'){
				    return 0;
			    }
			    else if(calculation == 'flat-rate'){
			    	if(countShipped > 0){
						return rate;
					}
					else{
						return 0;
					}
			    }
			    else if(calculation == 'amount'){
				    stop = subtotal;
			    }
			    else if(calculation == 'weight'){
				    stop = totalWeight;
			    }
			    else{
				    return 0;
			    }
			    
			    // walk through tiers
			    for(x=0; x<tiers.length; x++){
				    var from = tiers[x].from;
				    var to = tiers[x].to;
			
				    // determine if rate falls between to and from
				    if(stop > from && stop <= to){
					    var rate = Number(tiers[x].rate);
			
					    // return rate
					    if(!isNaN(rate)){
						    return rate;
					    }
				    }
			
			    } 
			
				// default is 0
				return 0;
			}
			
			// remove item from cart
			scope.remove = function(item) { 
				var index = $rootScope.cart.indexOf(item);
				$rootScope.cart.splice(index, 1);     
			}
			
			// remove item from cart
			scope.change = function(item) { 
				if(item.quantity <= 0){
					var index = $rootScope.cart.indexOf(item);
					$rootScope.cart.splice(index, 1);   
				}  
			}
			
			// calculates the total
			scope.total = function(){
				
				var total = parseFloat(scope.subTotal()) + parseFloat(scope.tax()) + parseFloat(scope.shipping());
				
				return total;
			}
			
			// checkout
			scope.checkoutWithPayPal = function(){
				
				var email = $rootScope.site.PayPalId;
				var logo = $rootScope.site.ImagesURL + $rootScope.site.LogoUrl;
				var currency = $rootScope.site.Currency;
				var returnUrl = $rootScope.site.Domain;
				var api = $rootScope.site.API;
				var siteId = $rootScope.site.SiteId;
				var weightUnit = $rootScope.site.WeightUnit;
				var useSandbox = false;
				
				if(parseInt($rootScope.site.PayPalUseSandbox) == 1){
					useSandbox = true;
				}

				// data setup
				// #ref tutorial: https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/cart_upload/
				// #ref: form: https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/#id08A6HF00TZS
				// #ref: notify: https://developer.paypal.com/docs/classic/ipn/integration-guide/IPNIntro/
				var data = {
					'email':			email,
					'cmd':				'_cart',
					'upload':			'1',
					'currency_code': 	currency,
					'business':			email,
					'rm':				'0',
					'charset':			'utf-8',
					'return':			returnUrl + '/thank-you',
					'cancel_return':	returnUrl + '/cancel',
					'notify_url':		api + '/transaction/paypal',
					'custom':			siteId
				};
		
				var noshipping = 1;
		
				// set logo
				if(logo != ''){
					data['image_url'] = logo;
				}
		
				// add cart items
				for(x=0; x<$rootScope.cart.length; x++){
		
					var c = x+1;
		
					var item = $rootScope.cart[x];
		
					data['item_name_'+c] = item.name;
					data['quantity_'+c] = item.quantity;
					data['amount_'+c] = parseInt(item.price).toFixed(2);
					data['item_number_'+c] = item.sku;
		
					if($.trim(item.shipping.toUpperCase()) == 'SHIPPED'){
						noshipping = 2;
					}
		
				}
		
				data['no_shipping'] = noshipping; // 1 = do not prompt, 2 = prompt for address and require it
				data['weight_unit'] = weightUnit;
				data['handling_cart'] = parseFloat(scope.shipping()).toFixed(2);
				data['tax_cart'] = parseFloat(scope.tax()).toFixed(2);
		
				// live url
				var url = 'https://www.paypal.com/cgi-bin/webscr';
		
				// set to sandbox if specified
				if(useSandbox){
					url = 'https://www.sandbox.paypal.com/cgi-bin/webscr'
				}
		
				// create form with data values
				var form = $('<form id="paypal-form" action="' + url + '" method="POST"></form');
		
				for(x in data){
					form.append('<input type="hidden" name="'+x+'" value="'+data[x]+'" />');
				}
		
				// append form
				$('body').append(form);
		
				// submit form
				$('#paypal-form').submit();
				
			}
			
		}
		
	}
	
})

// settings
.directive('respondSettings', function($rootScope){
	
	return{
		
		restrict: 'E',
		scope: {},
		templateUrl: 'templates/respond/settings.html',
		link: function(scope, element, attr){
			
			scope.showClose = false;
			
			if(attr.showClose){
				scope.showClose = attr.showClose;
			}
			
			// close the search
		    scope.close = function(){
			    $('body').removeClass('show-settings');
		    }
		
			scope.currentPageId = $rootScope.page.PageId;
			scope.site = $rootScope.site;
			
		}
		
	}
	
})

// video
.directive('respondVideo', function($rootScope, Form){
	
	return{
		
		restrict: 'E',
		transclude: true,
		templateUrl: 'templates/respond/video.html',
		link: function(scope, element, attr){}
		
			
		
	}
	
})

// tabset
.directive('respondShowtab', function($rootScope, Form){
	
	return{
		
		restrict: 'A',
		link: function(scope, element, attr){
					
			element.on('click', function(e) {
                e.preventDefault();
                $(element).tab('show');
            });
			
		}
		
			
		
	}
	
})

// creates a lightbox
.directive('respondLightbox', function(Menu){
	
	return{
		
		restrict: 'A',
		link: function(scope, element, attr){
			
			var href = $(element).attr('href');
			
			var ext = href.split('.').pop().toUpperCase();
			
			if(ext == 'JPG' || ext == 'PNG' || ext == 'GIF'){
				popupType = 'image';
			}
			else{
				popupType = 'iframe';
			}
			
			if(jQuery().magnificPopup){
				$(element).magnificPopup({ 
				  type: popupType
				});
			}
				
			
		}
		
	}
	
})

// published directives
// #published-directives

;