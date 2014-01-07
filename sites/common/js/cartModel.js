// models a cart item
var CartItem = function(description, sku, price, shippingType, quantity){
	
	var self = this;
	self.description = ko.observable(description);
	self.sku = ko.observable(sku);
	self.price = ko.observable(price);
	self.shippingType = ko.observable(shippingType);
	self.quantity = ko.observable(quantity);	
	
	// need to add thumbnail and return url
	
	self.priceFriendly = ko.computed(function(){
		var p = self.price() + ' ' + cartModel.currency;
		
		if(cartModel.currency == 'USD'){
			p = '$' + p;
		}
	
    	return p;
	});
	
	self.subtotal = ko.computed(function(){
	
		var subtotal = parseFloat(self.price()) * parseInt(self.quantity());
		
		return parseFloat(subtotal).toFixed(2);
	});
	
	self.subtotalFriendly = ko.computed(function(){
	
		var subtotal = parseFloat(self.price()) * parseInt(self.quantity());
	
		var p = parseFloat(subtotal).toFixed(2) + ' ' + cartModel.currency;
		
		if(cartModel.currency == 'USD'){
			p = '$' + p;
		}
		
		return p;
	});
}

// models the cart
var cartModel = {
   
   	currency: 'USD',
   	tax: 0,
   	returnUrl: 'temp.html',
   
    items: ko.observableArray([]),
    
    init:function(){
    
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
			
		});
	
		// handle add to cart
		$('.shelf-add button').on('click', function(){
		
			var shelfItem = $(this).parents('.shelf-item');
			
			var description = $(shelfItem).find('.shelf-description').text();
			var sku = $(shelfItem).find('.shelf-sku').text();
			var price = $(shelfItem).find('.shelf-price').attr('data-price');
			var type = $(shelfItem).find('.shelf-shipping').attr('data-type');
			var quantity = $(shelfItem).find('.shelf-quantity input').val();
		
			// create new cart item
			var item = new CartItem(description, sku, price, type, quantity);
			
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
		
		if(localStorage['respond-cart']){
			
			var str = localStorage['respond-cart'];
			
			var storedItems = eval(str);
			
			for(x=0; x<storedItems.length; x++){
				console.log(storedItems[x]);
				
				var description = storedItems[x].description;
				var sku = storedItems[x].sku;
				var price = storedItems[x].price;
				var type = storedItems[x].shippingType;
				var quantity = storedItems[x].quantity;
			
				// create new cart item
				var item = new CartItem(description, sku, price, type, quantity);
				
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
		$('.cart-total').text(cartModel.totalFriendly());
		
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
	
		var email = $(e.target).attr('data-email');
	
		// data setup
		// #ref tutorial: https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/cart_upload/
		// #ref: form: https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/#id08A6HF00TZS
		var data = {
			'email':			email,
			'cmd':				'_cart',
			'upload':			'1',
			'currency_code': 	cartModel.currency,
			'business':			email,
			//'rm':				'0',
			'tax_cart':			(cartModel.tax * 1).toFixed(2),
			//'handling_cart':	cartModel.shippingTotal(),
			'charset':			'utf-8',
			'return':			cartModel.returnUrl,
			'cancel_return':	cartModel.returnUrl + '#cancel',
			'notify_url':		cartModel.returnUrl + '#notify'
		
		};
	
		// add cart items
		for (x=0; x<cartModel.items().length; x++){
			
			var c = x+1;
			
			var item = cartModel.items()[x];
			
			data['item_name_'+c] = item.description();
			data['quantity_'+c] = item.quantity();
			data['amount_'+c] = item.price();
			data['item_number_'+c] = item.sku();
			
		}
		
		// create form with data values
		var form = $('<form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="POST"></form');
		
		for(x in data){
			form.append('<input type="hidden" name="'+x+'" value="'+data[x]+'" />');
		}
		
		// append form
		$('body').append(form);
		
		// submit form
		$('#paypal-form').submit();
		
	}
}

cartModel.count = ko.computed(function() {
    var count = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
        count += parseInt(item.quantity());
    });

    return count;
}, cartModel);

cartModel.total = ko.computed(function() {
    var total = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
        total += parseFloat(item.subtotal());
    });

    return total.toFixed(2);
}, cartModel);

cartModel.totalFriendly = ko.computed(function() {
    var total = 0;
    ko.utils.arrayForEach(this.items(), function(item) {
        total += parseFloat(item.subtotal());
    });
    
    var p = total.toFixed(2) + ' ' + this.currency;
    
    if(this.currency == 'USD'){
		p = '$' + p;
	}

    return p;
}, cartModel);

cartModel.shippingTotal = ko.computed(function() {
    var total = 0;
    
    /* TBD
    ko.utils.arrayForEach(this.items(), function(item) {
        total += parseFloat(item.subtotal());
    });*/

    return total.toFixed(2);
}, cartModel);

$(document).ready(function(){cartModel.init();});
