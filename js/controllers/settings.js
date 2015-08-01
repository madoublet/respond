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