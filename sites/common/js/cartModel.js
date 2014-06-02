// models a cart item
var CartItem = function(description, sku, price, shippingType, weight, quantity){
	
	var self = this;
	self.description = ko.observable(description);
	self.sku = ko.observable(sku);
	self.price = ko.observable(price);
	self.shippingType = ko.observable(shippingType);
	self.weight = ko.observable(weight);
	self.quantity = ko.observable(quantity);	
	
	self.priceFriendly = ko.computed(function(){
		var p = self.price() + ' ' + cartModel.currency;
		
		if(cartModel.currency == 'USD'){
			p = '$' + p;
		}
	
    	return p;
	});
	
	// total weight for line item
	self.totalWeight = ko.computed(function(){
	
		var weight = parseFloat(self.weight()) * parseInt(self.quantity());
		
		return Number(weight);
	});
	
	// total price for line item
	self.total = ko.computed(function(){
	
		var total = parseFloat(self.price()) * parseInt(self.quantity());
		
		return Number(total);
	});
	
	// total price for line item (formatted)
	self.totalFriendly = ko.computed(function(){
	
		var total = parseFloat(self.price()) * parseInt(self.quantity());
	
		var p = Number(total).toFixed(2) + ' ' + cartModel.currency;
		
		if(cartModel.currency == 'USD'){
			p = '$' + p;
		}
		
		return p;
	});
}

// models the cart
var cartModel = {
   
   	payPalId: '',
   	logo: '',
   	useSandbox: false,
   	currency: 'USD',
   	weightUnit: 'kgs',
   	taxRate: 0,
   	returnUrl: 'return',
   	calculation: 'free',
   	flatRate: 0,
   	tiers: [],
   
    items: ko.observableArray([]),
    
    init:function(){
    	
    	var payPalId = $('#cart').attr('data-paypalid');
    	var logo = $('#cart').attr('data-logo');
    	var useSandbox = $('#cart').attr('data-usesandbox');
    	var currency = $('#cart').attr('data-currency');
    	var weightUnit = $('#cart').attr('data-weightunit');
    	var calculation = $('#cart').attr('data-shippingcalculation');  	
		var flatRate = Number($('#cart').attr('data-shippingrate'));
		var tiers = $('#cart').attr('data-shippingtiers');
		var taxRate = $('#cart').attr('data-taxrate');
	
		// validate payPalId
		if(payPalId != '' && payPalId != undefined){
			cartModel.payPalId = payPalId;
		}
	
		// validate logo
		if(logo != '' && logo != undefined){
			cartModel.logo = logo;
		}
	
		// set use sandbox
		if(useSandbox == '1'){
			cartModel.useSandbox = true;
		}
		
		// validate currency
		if(currency != '' && currency != undefined){
			cartModel.currency = currency;
		}
		
		// validate weightUnit
		if(weightUnit != '' && weightUnit != undefined){
			cartModel.weightUnit = weightUnit;
		}
		
		// validate calculation
		if(calculation != '' && calculation != undefined){
			cartModel.calculation = calculation;
		}
	
		// validate flatrate
		if(!isNaN(flatRate) && flatRate != undefined){
			cartModel.flatRate = flatRate;
		}
		
		// validate and parse tiers
		if(cartModel.tiers != '' && cartModel.tiers != undefined){
	    	cartModel.tiers = JSON.parse(decodeURI(tiers));
	    }
    	
    	// validate and parse taxrate
    	if(!isNaN(taxRate) && taxRate != undefined){
    		taxRate = Number(taxRate.replace(/[^0-9\.]+/g, ''));
    		cartModel.taxRate = taxRate;
    	}
    	
    	// set return url
    	var url = 'http://' + $('body').attr('data-domain') + '/';
    	cartModel.returnUrl = url;
    	
    	// setup events used by the cart
    	cartModel.setupEvents();
    
    	// grab cart from localStorage
    	cartModel.updateCart();
    	
        // apply bindings
        ko.applyBindings(cartModel, $('#cart').get(0));

	},
	
	// setup events
	setupEvents:function(){
	
		// toggles the cart
		$('.cart-toggle').on('click', function(){
			
			$('#cart').toggleClass('active');
			$('body').toggleClass('show-cart');
			
		});
	
		// handle add to cart
		$('.shelf-add button').on('click', function(){
		
			var shelfItem = $(this).parents('.shelf-item');
			
			var description = $(shelfItem).find('.shelf-description').text();
			var sku = $(shelfItem).find('.shelf-sku').text();
			
			// get price
			var price = Number($(shelfItem).find('.shelf-price').attr('data-price'));
    	
			// handle error
	    	if(isNaN(price)){
	    		throw('cartModel.js: pricing error');
	    	}
			
			var type = $(shelfItem).find('.shelf-shipping').attr('data-type');
			
			// get weight
			var weight = Number($(shelfItem).find('.shelf-shipping').attr('data-weight'));
    	
	    	// handle error (set default weight to 0)
	    	if(isNaN(weight)){
	    		weight = 0;
	    	}
			
			// get quantity
			var quantity = Number($(shelfItem).find('.shelf-quantity input').val());
    	
	    	// handle error (set default quantity to 1)
	    	if(isNaN(quantity)){
	    		quantity = 1;
	    	}
			
			// create new cart item
			var item = new CartItem(description, sku, price, type, weight, quantity);
			
			// check for match
			var match = false;
			match = ko.utils.arrayFirst(cartModel.items(), function (curr) {
                            if(curr.sku().toUpperCase() == item.sku().toUpperCase()){
                            	// get new quantity
                            	var q = parseInt(curr.quantity()) + parseInt(quantity);
                            	
                            	// update quantity
                            	curr.quantity(q);
                            	
                            	return true;
                            }
                        });
            
            // if match is not found, push item to the cart, or else +1 to quantity of existing item               
            if(!match){
                cartModel.items.push(item); 
            }
            
            // update external references and save the cart
			cartModel.updateExternal();
			cartModel.saveCart();
			
		});
		
		
	},
	
	// updates cart from local storage
	updateCart:function(){
	
		// check for hash to clear cart
		if(location.hash == '#clear-cart'){
			localStorage.removeItem('respond-cart');
		}
        
		// get cart from local storage
		if(localStorage['respond-cart']){
			
			var str = localStorage['respond-cart'];
			
			var storedItems = eval(str);
			
			for(x=0; x<storedItems.length; x++){
				// #debug console.log(storedItems[x]);
				
				var description = storedItems[x].description;
				var sku = storedItems[x].sku;
				var price = Number(storedItems[x].price);
				var type = storedItems[x].shippingType;
				var weight = Number(storedItems[x].weight);
				var quantity = Number(storedItems[x].quantity);
			
				// create new cart item
				var item = new CartItem(description, sku, price, type, weight, quantity);
				
				// push item to model
				cartModel.items.push(item);
			}
			
		}
		
		// update external elements
		cartModel.updateExternal();
		
	},
	
	// save cart
	saveCart:function(){
		
		var json = ko.toJSON(cartModel.items());
		
		localStorage['respond-cart'] = json;
		
	},
	
	// updates external references to the cart
	updateExternal:function(){
		
		$('.cart-count').text(cartModel.count());
		$('.cart-total').text(cartModel.subtotalFriendly());
		
	},
	
	// updates the cart quantity
	updateQuantity:function(o, e){
		var q = parseInt($(e.target).val());
		
		if(q<=0){
			cartModel.items.remove(o);
		}
		else{
			o.quantity(q);
		}
		
		// update external references and save the cart
		cartModel.updateExternal();
		cartModel.saveCart();
		
	},
	
	// removes an item from a cart
	removeFromCart:function(o, e){
		cartModel.items.remove(o);
		
		// update external references and save the cart
		cartModel.updateExternal();
		cartModel.saveCart();
	},
	
	// checkout using PayPal
	checkoutWithPayPal:function(o, e){
	
		var email = cartModel.payPalId;
	
		// data setup
		// #ref tutorial: https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/cart_upload/
		// #ref: form: https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/#id08A6HF00TZS
		// #ref: notify: https://developer.paypal.com/docs/classic/ipn/integration-guide/IPNIntro/
		var data = {
			'email':			email,
			'cmd':				'_cart',
			'upload':			'1',
			'currency_code': 	cartModel.currency,
			'business':			email,
			'rm':				'0',
			'charset':			'utf-8',
			'return':			cartModel.returnUrl + 'thank-you#clear-cart',
			'cancel_return':	cartModel.returnUrl + 'cancel',
			'notify_url':		cartModel.returnUrl + 'api/transaction/paypal',
			'custom':			$('body').attr('data-siteuniqid')
		};
		
		var noshipping = 1;
		
		// set logo
		if(cartModel.logo != ''){
			data['image_url'] = cartModel.logo;
		}
	
		// add cart items
		for (x=0; x<cartModel.items().length; x++){
			
			var c = x+1;
			
			var item = cartModel.items()[x];
			
			data['item_name_'+c] = item.description();
			data['quantity_'+c] = item.quantity();
			data['amount_'+c] = item.price().toFixed(2);
			data['item_number_'+c] = item.sku() + '-' + item.shippingType().toUpperCase();
			
			if(item.shippingType() == 'shipped'){
				noshipping = 2;
			}
			
		}
		
		data['no_shipping'] = noshipping; // 1 = do not prompt, 2 = prompt for address and require it
		data['weight_unit'] = cartModel.weightUnit;
		data['handling_cart'] = cartModel.shipping().toFixed(2);
		data['tax_cart'] = cartModel.tax().toFixed(2);
		
		// live url
		var url = 'https://www.paypal.com/cgi-bin/webscr';
		
		// set to sandbox if specified
		if(cartModel.useSandbox){
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

// total count calculation
cartModel.count = ko.computed(function() {
    var count = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
        count += item.quantity();
    });

    return count;
}, cartModel);

// total count of shipped items
cartModel.countShipped = ko.computed(function() {
    var count = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
    	if(item.shippingType() == 'shipped'){
        	count += item.quantity();
        }
    });

    return count;
}, cartModel);


// subtotal calculation (line item total)
cartModel.subtotal = ko.computed(function() {
    var total = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
        total += item.total();
    });

    return total;
}, cartModel);

// subtotal calculation for shipped items (line item total)
cartModel.subtotalShipped = ko.computed(function() {
    var total = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
        if(item.shippingType() == 'shipped'){
        	total += item.total();
        }
    });

    return total;
}, cartModel);

// subtotal display
cartModel.subtotalFriendly = ko.computed(function() {
    var p = cartModel.subtotal().toFixed(2) + ' ' + cartModel.currency;
    
    if(cartModel.currency == 'USD'){
		p = '$' + p;
	}

    return p;
}, cartModel);

// tax calculation (subtotal * rate)
cartModel.tax = ko.computed(function() {
	return cartModel.subtotal() * cartModel.taxRate;
}, cartModel);

// tax display
cartModel.taxFriendly = ko.computed(function() {
    var p = cartModel.tax().toFixed(2) + ' ' + cartModel.currency;
    
    if(cartModel.currency == 'USD'){
		p = '$' + p;
	}
	
	p = '(' + cartModel.taxRate + '%) ' + p;

    return p;
}, cartModel);

// total weight calculation
cartModel.totalWeight = ko.computed(function() {
    var total = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
    	if(item.shippingType() == 'shipped'){
        	total += item.totalWeight();
        }
    });

    return total;
}, cartModel);

// total weight display
cartModel.totalWeightFriendly = ko.computed(function() {
   return cartModel.totalWeight() + ' ' + this.weightUnit;
}, cartModel);

// shipping calculation (based on settings)
cartModel.shipping = ko.computed(function() {
    
    var stop = 0;
    
    // get totals (this also makes sure the model is up-to-date)
    var subtotal = cartModel.subtotalShipped();
	var totalWeight = cartModel.totalWeight();
	
	// get params
	var calculation = cartModel.calculation;	
	var flatRate = cartModel.flatRate;
	var tiers = cartModel.tiers;


    if(calculation == 'free'){
	    return 0;
    }
    else if(calculation == 'flat-rate'){
    	if(cartModel.countShipped() > 0){
			return flatRate;
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
		    
		    console.log('rate='+rate);
		    
		    // return rate
		    if(!isNaN(rate)){
			    return rate;
		    }
	    }
	    
    } 
    
    // easy default
    return 0;
    
}, cartModel);

// shipping display
cartModel.shippingFriendly = ko.computed(function() {
    
    var p = cartModel.shipping().toFixed(2) + ' ' + this.currency;
    
    if(this.currency == 'USD'){
		p = '$' + p;
	}

    return p;
}, cartModel);

// total calculation (subtotal + shipping + tax)
cartModel.total = ko.computed(function() {
    
    var total = cartModel.subtotal() + cartModel.shipping() + cartModel.tax();
	return total;
	
}, cartModel);

// total display
cartModel.totalFriendly = ko.computed(function() {
    
    var p = cartModel.total().toFixed(2) + ' ' + this.currency;
    
    if(this.currency == 'USD'){
		p = '$' + p;
	}

    return p;
}, cartModel);

// init model
$(document).ready(function(){cartModel.init();});
