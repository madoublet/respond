(function() {
    
    angular.module('respond.controllers')
    
    // signup controller
	.controller('SignupCtrl', function($scope, $window, $stateParams, $state, $rootScope, $i18next, Setup, Site) {
	
		$rootScope.template = 'signup';
		
		// setup
		$scope.setup = Setup;
		$scope.showOptions = false;
		
		// the default is stripe
		var payWith = 'stripe';
		
		// for multiple payment options
		if($scope.setup.stripePubKey != '' && $scope.setup.paypalEmail != ''){
			$scope.showOptions = true;
		}
		
		// if stripe is blank, set the default to paypal
		if($scope.setup.stripePubKey == ''){
			payWith = 'paypal';	
		}
		
		var plan = $scope.setup.plans[0].id;
		
		// temporary model
		$scope.temp = {
			'email': '',
			'plan': plan,
			'payWith': payWith,
			'domain': ''
		}
		
		$scope.error = '';
		
		// set publishable key
		Stripe.setPublishableKey($scope.setup.stripePubKey);
	
		function stripeResponseHandler(status, response){
	      
	        var form = $('#subscribe-form');
	        
	        if (response.error) { // errors
	            message.showMessage('error');
	           
				$scope.$apply(function(){
					$scope.error = response.error.message;
				});
	            
	        } 
	        else {
	        
	        	var token = response.id;
	        	
	        	// subscribe a site with Stripe
				Site.subscribeWithStripe(token, $scope.temp.plan, $scope.temp.domain,
					function(data){		// success
					
						// update the site
						Site.retrieve(function(data){
						
							message.showMessage('success');
						
							// set site in $rootScope, session
							$rootScope.site = data;
							$window.sessionStorage.site = JSON.stringify(data);
							
							// go to start URL
							$state.go('app.thankyou');
								
						});
						
						
					},
					function(){		// failure
						message.showMessage('error');
					});
	           
	        }
	        
	    }
	
		// pay with Stripe
		$scope.payWithStripe = function(){
			$scope.stripeError = '';
			
			var plan = $scope.temp.plan;
			
			var form = $('#subscribe-form');
	        
	        message.showMessage('progress');
	        
	        Stripe.createToken(form, stripeResponseHandler);
		}
		
		// subscribe with Paypal (https://www.paypal.com/cgi-bin/webscr?cmd=_pdn_subscr_techview_outside)
		// variables: https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/#id08A6HI00JQU
		$scope.payWithPaypal = function(){
			
			var id = $scope.temp.plan;
			var current = -1;
			
			// get plan by id
			for(x=0; x < $scope.setup.plans.length; x++){
				
				if($scope.setup.plans[x].id == id){
					current = x;
				}
		
			}
			
			// make sure that x was found
			if(x == -1){
				 message.showMessage('error');
				 if(Setup.debug)console.log('[Respond.error] could not find plan');
				 return;
			}
			
			var plan = $scope.setup.plans[current];
		
			// get variables from setup
			var useSandbox = $scope.setup.paypalUseSandbox;
			var email = $scope.setup.paypalEmail;
			var currency = $scope.setup.paypalCurrency;
			var returnUrl = $scope.setup.url + '/app/thankyou';
			var api = $scope.setup.api;
			
			// live url
			var url = 'https://www.paypal.com/cgi-bin/webscr';
	
			// set to sandbox if specified
			if(useSandbox){
				url = 'https://www.sandbox.paypal.com/cgi-bin/webscr'
			}
		
			// set data for transaction
			var data = {
				'item_name':		plan.desc + ' (' + $scope.temp.domain + ')',
				'email':			email,
				'cmd':				'_xclick-subscriptions',
				'currency_code': 	currency,
				'business':			email,
				'no_shipping':		'1',
				'charset':			'utf-8',
				'a3':				plan.price,
				'p3':				'1',
				't3':				plan.interval,
				'src':				'1',
				'sra':				'1',
				'return':			returnUrl + '?thank-you',
				'cancel_return':	returnUrl + '?cancel',
				'notify_url':		api + '/transaction/paypal/subscribe',
				'custom':			$rootScope.site.SiteId
			};
		
			// set logo
			if($scope.setup.paypalLogo != ''){
				data['image_url'] = $scope.setup.paypalLogo;
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
		
	})
	
})();