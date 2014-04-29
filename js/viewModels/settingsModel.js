// models the settings page
var settingsModel = {
    
    site: ko.observable(''),
    siteMap: ko.observable(''),
    currencies: ko.observableArray([]),
    
    init:function(){ // initializes the model
        settingsModel.updateSite();
        settingsModel.updateCurrencies();
        
        $('.segmented-control li').on('click', function(){
	        
	        var segment = $(this).data('navigate');
	        $('form>div').addClass('hidden');
	        $('.section-'+segment).removeClass('hidden');
	        $(this).parent().find('li').removeClass('active');
	        $(this).addClass('active');
	        
        });
        
        $('.list-menu a').on('click', function(){
	        $('.list-menu').addClass('hidden');
        });
        
        // set the from value to the previous to value
        $('body').on('focus', '.to', function(){ 
	        
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
        
        $('body').on('blur', '.to', function(){
        
        	var to = Number($(this).val().replace(/[^0-9\.]+/g, ''));
        	
			$(this).val(to);
			
			var prev = $(this).parent().parent().prev().find('.to');
			
			if(prev){
				prev = Number($(prev).val().replace(/[^0-9\.]+/g, ''));
				
				console.log(prev);
				
				if(to < prev){
					$(this).addClass('error');
					$(this).val('');
				}
			}
        
        });
        
        $('body').on('blur', '.rate', function(){
        
        	var rate = Number($(this).val().replace(/[^0-9\.]+/g, ''));
        	
        	$(this).val(rate);
        
        });
        
        
        $('body').on('change', '#shippingCalculation', function(){
	        
	        var calc = $(this).val();
	        
	        $('.shipping-type').hide();
	        $('.'+calc).show();
	    
        });
        
        $('#language').hide();
        
        $('body').on('change', '#language-select', function(){
	        
	        var language = $(this).val();
	        
	        if(language == ''){
		       $('#language').removeClass('hidden');
	        }
	        else{
		       $('#language').addClass('hidden');
	        }
	        
	        $('#language').val(language);
	    
        });

		ko.applyBindings(settingsModel);  // apply bindings
	},
    
    updateSite:function(o){
    
        $.ajax({
    		url: 'api/site/current',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
                
                var site = Site.create(data);
                
                settingsModel.siteMap('http://'+site.domain()+'/sitemap.xml');
                
                settingsModel.site(site);
                
                // set up tiers
                var shippingCalculation = settingsModel.site().shippingCalculation();
                
                if(shippingCalculation == 'amount' || shippingCalculation == 'weight'){
	                
	                var tiers = JSON.parse(settingsModel.site().shippingTiers());
	                var tos = $('.'+shippingCalculation).find('.to');
			        var froms = $('.'+shippingCalculation).find('.from');
			        var rates = $('.'+shippingCalculation).find('.rate');
	                
	                for(x=0; x<tiers.length; x++){
		                
		                var tier = tiers[x];
		                $(froms[x]).text(tier.from); 
		                $(tos[x]).val(tier.to);
		                $(rates[x]).val(tier.rate); 
		  
	                }
	                
                }
                
                // setup language
                $('#language-select').val(settingsModel.site().language());
                $('#language').val(settingsModel.site().language());
                
                // show custom
                if($('#language-select').val() == ''){
	                $('#language').removeClass('hidden');
                }
			}
		});
        
    },
    
    updateCurrencies:function(o){
    
	    settingsModel.currencies.removeAll();
       
    	$.ajax({
			url: 'data/currencies.json',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
	
                for(x in data.currencies){
    
    				var currency = {
        			    'code': data.currencies[x]['code'],
                        'text': data.currencies[x]['text']
    				};
                
					settingsModel.currencies.push(currency); 
				}

			}
		});
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var name = $('#name').val();
        var domain = $('#domain').val();
        var primaryEmail = $('#primaryEmail').val();
        var timeZone = $('#timeZone').val();
        var language = $('#language').val();
        var currency = $('#currency').val();
        var weightUnit = $('#weightUnit').val();
        var shippingCalculation = $('#shippingCalculation').val();
        var shippingRate = $('#shippingRate').val();
        var analyticsId = $('#analyticsId').val();
        var analyticssubdomain = $('#analyticssubdomain').prop('checked') ? 1 : 0;
        var analyticsmultidomain = $('#analyticsmultidomain').prop('checked') ? 1 : 0;
        var analyticsdomain = $('#analyticsdomain').val();
        var formPublicId = $('#formPublicId').val();
        var formPrivateId = $('#formPrivateId').val();
        var facebookAppId = $('#facebookAppId').val();
        var taxRate = $('#taxRate').val();
        var payPalId = $('#payPalId').val();
        var payPalUseSandbox = $('#payPalUseSandbox').val();
        
        var shippingTiers = '';
        
        if(shippingCalculation == 'amount' || shippingCalculation == 'weight'){
	        
	        var tos = $('.'+shippingCalculation).find('.to');
	        var froms = $('.'+shippingCalculation).find('.from');
	        var rates = $('.'+shippingCalculation).find('.rate');
	        
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
	        
	        shippingTiers = JSON.stringify(tiers);
	        
	        console.log(shippingTiers);
	        
        }
        
        // clean up domain
        domain = global.replaceAll(domain, 'www.', '');
        domain = global.replaceAll(domain, 'http://', '');
        domain = global.replaceAll(domain, '//', '');
        
        if(domain.charAt(domain.length-1) == '/') {
		    domain = domain.slice(0, -1);
		}
		
		settingsModel.site().domain(domain);
		
        $.ajax({
            url: 'api/site/' + o.siteUniqId(),
			type: 'POST',
			data: {name: name, domain: domain, primaryEmail: primaryEmail, timeZone: timeZone, language: language, currency: currency, weightUnit: weightUnit, shippingCalculation: shippingCalculation, shippingRate: shippingRate, shippingTiers: shippingTiers, taxRate: taxRate, payPalId: payPalId, payPalUseSandbox: payPalUseSandbox, analyticsId: analyticsId, facebookAppId: facebookAppId, analyticssubdomain: analyticssubdomain, analyticsmultidomain: analyticsmultidomain, analyticsdomain: analyticsdomain, formPublicId: formPublicId, formPrivateId: formPrivateId},
			success: function(data){
    			message.showMessage('success', $('#msg-updated').val());
    			$('.list-menu').removeClass('hidden');
			},
			error: function(data){
				message.showMessage('error', $('#msg-updating-error').val());
			}
		});
        
    },
    
    showVerificationDialog:function(o, e){
        
        $('#fileName').val('');
        $('#fileContent').val('');
        $('#verificationDialog').modal('show');
        
    },
    
    generateVerification:function(o, e){
        
        var name = $('#fileName').val();
        var content = $('#fileContent').val();
        
        if(name=='' || content==''){
            message.showMessage('error', $('#msg-name-content-error').val());
            return;
        }
        
        message.showMessage('progress', $('#msg-generating').val());
   
        $.ajax({
            url: 'api/site/verification/generate',
    		type: 'POST',
			data: {name: name, content: content},
			dataType: 'json',
			success: function(data){
    			message.showMessage('success', $('#msg-generated').val());
                $('#verificationDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-generating-error').val());
			}
		});
    }
}

settingsModel.init();