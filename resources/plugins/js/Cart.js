/*!
 * accounting.js v0.4.2, copyright 2014 Open Exchange Rates, MIT license, http://openexchangerates.github.io/accounting.js
 */
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.4.1",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=c.format=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(this);

/*
 * Prebuilt Cart - Shopping cart with support for Stripe Checkout / Paypal
 * @author Prebuilt / matt@matthewsmith.com
 * @ref: https://prebuilt.io/cart
 */
class Cart {

  constructor(flatRateShipping, taxRate, currency, locale, image, name, zipCode, billingAddress, shippingAddress, key, payApi, subscribeApi, successUrl) {

    var cartHtml, successHtml;

    // statics
    this.SESSION_STORAGE_ID = 'saved-cart';

    // class variables
    this.flatRateShipping = flatRateShipping;
    this.shipping = 0
    this.taxRate = taxRate;
    this.currency = currency;
    this.locale = locale;
    this.image = image;
    this.name = name;
    this.zipCode = zipCode;
    this.billingAddress = billingAddress;
    this.shippingAddress = shippingAddress;
    this.key = key;
    this.payApi = payApi;
    this.subscribeApi = subscribeApi;
    this.handler = null;
    this.buttonLabel = null;
    this.successUrl = successUrl;

    // cart
    this.cart = [];

    // subscribe
    this.isSubscription = false;

    // buy now
    this.isBuyNow = false;
    this.buyNowCart = [];

    cartHtml = '<h2>Shopping Cart</h2>' +
            '<a class="close-cart" cart-toggle>' +
              '<svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>' +
            '</a>' +
            '<div class="cart-container">' +
              '<table>' +
      					'<thead>' +
      						'<tr>' +
      							'<th>Item</th>' +
      							'<th class="number">Quantity</th>' +
      							'<th class="number">Price</th>' +
      							'<th class="number">Total</th>' +
      						'</tr>' +
      					'</thead>' +
      					'<tbody></tbody>' +
      					'<tfoot>' +
      						'<tr class="subtotal">' +
      							'<th colspan="3">Subtotal</th>' +
      							'<td class="number">$0.00</td>' +
      						'</tr>' +
      						'<tr class="tax">' +
      							'<th colspan="3">Tax</th>' +
      							'<td class="number">$0.00</td>' +
      						'</tr>' +
      						'<tr class="shipping">' +
      							'<th colspan="3">Shipping</th>' +
      							'<td class="number">$0.00</td>' +
      						'</tr>' +
      						'<tr class="total">' +
      							'<th colspan="3">Total</th>' +
      							'<td class="number">$0.00</td' +
      						'</tr>' +
      					'</tfoot>' +
      				'</table' +
            '</div>' +
            '<div class="actions">' +
      				'<button class="clear-cart" cart-clear state="pay"><span>Clear Cart</span></button>' +
      				'<button class="start-checkout" state="pay"><span>Checkout</span></button>' +
      			'</div>';

    successHtml = '<h2>Payment Successful!</h2>' +
            '<a class="close-success" cart-success-close>' +
              '<svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>' +
            '</a>' +
            '<p>Thank you for your purchase!  You will receive a receipt via email soon.</p>' +
            '<p class="downloads"></p>' +
            '<div class="actions">' +
      				'<button class="complete" cart-success-close><span>Continue</span></button>' +
      			'</div>';

    // create cart element and add it to the dom
    this.el = document.createElement('DIV');
    this.el.className = 'cart';
    this.el.innerHTML = cartHtml;
    document.body.appendChild(this.el);

    // create complete element and add it to the dom
    this.success = document.createElement('DIV');
    this.success.className = 'cart-success';
    this.success.innerHTML = successHtml;
    document.body.appendChild(this.success);

    // init tracking elements
    this.currency = currency

    // retrieve the cart
		this.retrieveCart();

    // init helper references
    this.table = this.el.querySelector('table');
    this.tbody = this.el.querySelector('tbody');

    // setup shipping, taxRate, total
    this.taxRate = taxRate;
    this.total = 0;

    // setup symbols
    this.symbols = {
			    'USD': '$', // US Dollar
			    'EUR': '€', // Euro
			    'CRC': '₡', // Costa Rican Colón
			    'GBP': '£', // British Pound Sterling
			    'ILS': '₪', // Israeli New Sheqel
			    'INR': '₹', // Indian Rupee
			    'JPY': '¥', // Japanese Yen
			    'KRW': '₩', // South Korean Won
			    'NGN': '₦', // Nigerian Naira
			    'PHP': '₱', // Philippine Peso
			    'PLN': 'zł', // Polish Zloty
			    'PYG': '₲', // Paraguayan Guarani
			    'THB': '฿', // Thai Baht
			    'UAH': '₴', // Ukrainian Hryvnia
			    'VND': '₫', // Vietnamese Dong
			};

    // setup mark
    if(this.symbols[this.currency] != undefined) {
			this.mark = this.symbols[this.currency];
		}

		// setup UI
		this.setupUI();

		// setup Stripe
		this.setupStripe();

		// bind
		this.bind();

  }

  /*
   * Retrieve cart from localStorage
   */
  retrieveCart() {

		if(sessionStorage[this.SESSION_STORAGE_ID] != null) {
			var str = sessionStorage[this.SESSION_STORAGE_ID];
      this.cart = eval(str);
		}
		else {
			this.cart = [];
		}

  }

  /*
   * Save cart to localStorage
   */
  saveCart() {
		var json = JSON.stringify(this.cart);
		sessionStorage[this.SESSION_STORAGE_ID] = json;
  }

  /*
   * Setup UI events for the cart
   */
  setupUI() {

    var context = this, x, els, el, index;

    // handle clicks on the table
    this.table.addEventListener('click', function(e) {

      var target = e.target, tr;

      if(target.closest('.cart-remove-item') != null) {

        // get index
        tr = target.closest('tr');
        index = tr.getAttribute('data-index');

        context.cart.splice(index, 1);

        context.bind();

      }

    });

    // setup toggles
    els = document.querySelectorAll('[cart-toggle]');

    for(x=0; x<els.length; x++) {
      els[x].addEventListener('click', function(e) {

        // toggle [visible] on cart
        if(context.el.hasAttribute('visible')) {
          context.el.removeAttribute('visible');
        }
        else {
          context.el.setAttribute('visible', '');
        }

      });
    }

    // setup add to cart
    els = document.querySelectorAll('[cart-add]');

    for(x=0; x<els.length; x++) {
      els[x].addEventListener('click', function(e) {

        var target = e.target, name, sku, quantity, price, shipped, strShipped;

        name = target.getAttribute('data-name') || 'Unknown Name';
        sku = target.getAttribute('data-sku') || 'UNKNOWN';
        quantity = parseInt(target.getAttribute('data-quantity')) || 1;
        price = parseFloat(target.getAttribute('data-price')) || 0;

        // set shipped
        strShipped = target.getAttribute('data-shipped') || 'false';
        shipped = (strShipped == 'true');

        context.buttonLabel = target.getAttribute('data-button-label') || null;

        context.addItem(new CartItem(name, sku, quantity, price, shipped));

        e.preventDefault();
        return false;

      });
    }

    // setup buy now
    els = document.querySelectorAll('[buy-now]');

    for(x=0; x<els.length; x++) {
      els[x].addEventListener('click', function(e) {

        var target = e.target, name, sku, quantity, price, shipped, strShipped, buttonLabel, total = 0;

        name = target.getAttribute('data-name') || 'Unknown Name';
        sku = target.getAttribute('data-sku') || 'UNKNOWN';
        quantity = 1;
        price = parseFloat(target.getAttribute('data-price')) || 0;

        // set shipped
        strShipped = target.getAttribute('data-shipped') || 'false';
        shipped = (strShipped == 'true');

        buttonLabel = target.getAttribute('data-button-label') || null;

        context.setBuyNowItem(new CartItem(name, sku, quantity, price, shipped));

        total = price + (price * context.taxRate);

        if(shipped == true) {
          total += context.flatRateShipping;
        }

        var options = {
          name: context.name,
          description: name,
          amount: (total * 100)
        };

        if(buttonLabel != null) {
          options.panelLabel = buttonLabel;
        }

        context.handler.open(options);

        e.preventDefault();
        return false;

      });
    }

    // setup subscribe
    els = document.querySelectorAll('[subscribe]');

    for(x=0; x<els.length; x++) {
      els[x].addEventListener('click', function(e) {

        var target = e.target, name, sku, quantity, price, buttonLabel, shipped, total=0;

        name = target.getAttribute('data-name') || 'Unknown Name';
        sku = target.getAttribute('data-sku') || 'UNKNOWN';
        quantity = 1;
        price = parseFloat(target.getAttribute('data-price')) || 0;
        buttonLabel = target.getAttribute('data-button-label') || null;
        shipped = false;

        context.setBuyNowItem(new CartItem(name, sku, quantity, price, shipped));

        context.isSubscription = true;

        total = price; // + (price * context.taxRate);

        var options = {
          name: context.name,
          description: name,
          amount: (total * 100)
        }

        if(buttonLabel != null) {
          options.panelLabel = buttonLabel;
        }

        context.handler.open(options);

        e.preventDefault();
        return false;

      });
    }

    // setup clear cart
    el = this.el.querySelector('[cart-clear]');

    el.addEventListener('click', function(e) {
      context.cart = [];
      context.bind();
    });

    // setup cart-success-close
    els = this.success.querySelectorAll('[cart-success-close]');

    for(x=0; x<els.length; x++) {
      els[x].addEventListener('click', function(e) {
        context.success.removeAttribute('visible');
      });
    }


  }

  /*
   * Serialize the object
   */
  serialize(obj) {
    return Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
  }

  /*
   * Setup UI events for the cart
   */
  setupStripe() {

    var context=this, http, params;

    // configure Stripe
    this.handler = StripeCheckout.configure({
      key: this.key,
      image: this.image,
      locale: this.locale,
      zipCode: this.zipCode,
      billingAddress: this.billingAddress,
      shippingAddress: this.shippingAddress,
      token: function(token, addresses) {

        var cart = [], total = 0;

        if(context.isBuyNow == true) {
          cart = context.buyNowCart;
          total = context.buyNowCart[0].price;
        }
        else {
          cart = context.cart;
          total = context.total;
        }

        // setup params
        params = {
          token: token.id,
          email: token.email,
          name: context.count + ' total items',
          total: total,
          items: cart
        };

        // create post
        var http = new XMLHttpRequest();
        var url = context.payApi;

        if(context.isSubscription) {
          url = context.subscribeApi;
        }

        http.open("POST", url, true);

        // set request header
        http.setRequestHeader("Content-Type", "application/json");

        // callback
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                context.cart = [];
                context.bind();
                context.el.removeAttribute('visible');
                context.success.setAttribute('visible', '');

                if(context.successUrl != null && context.successUrl != '') {
                  window.location = context.successUrl;
                }

                // set downloads
                var downloads = context.success.querySelector('.downloads');
                downloads.innerHTML = http.responseText;

                // set response
                if(http.responseText != '') {
                  downloads.setAttribute('visible', '');
                }
                else {
                  downloads.removeAttribute('visible');
                }
            }
        }

        // send request
        http.send(JSON.stringify(params));

      }

    });

    // show the Stripe modal
    this.el.querySelector('.start-checkout').addEventListener('click', function(e) {

      context.isBuyNow = false;
      context.isSubscription = false;

      var amount = context.formatCurrency(context.total);

      var options = {
        name: context.name,
        description: context.count + ' total items',
        amount: (amount * 100)
      };

      if(context.buttonLabel != null) {
        options.panelLabel = context.buttonLabel;
      }

      context.handler.open(options);
      e.preventDefault();
    });


  }

  /*
   * Use the Accounting JS lib to format the currency
   * @param number
   * @return number
   * @ref http://openexchangerates.github.io/accounting.js/#download
   */
  formatCurrency(number) {
    return accounting.formatNumber(number, 2, ' ');
  }

  /*
   * Adds an item to the cart
   * @param CartItem item
   * @return null
   */
  addItem(item) {

    var inCart = false;

    // increment item if it exists
    this.cart.forEach(function(i) {
      if(i.sku === item.sku) {
        i.quantity++;
        inCart = true;
      }
    });

    // add it to the cart if not found
    if(inCart == false) {
      this.cart.push(item);
    }

    // rebind list
    this.bind();

  }

  /*
   * Adds an item to the buy now cart
   * @param CartItem item
   * @return null
   */
  setBuyNowItem(item) {

    this.isBuyNow = true;
    this.buyNowCart = [];

    this.buyNowCart.push(item);

  }

  /*
   * Adds an item to the cart
   * @param CartItem item
   * @returns null
   */
  bind() {

    var tr, rows, x, els, count = 0,
      context = this,
      subtotal = 0,
      tax = 0,
      isShipped = false,
      shipping = 0,
      total = 0,
      index = 0;

    // saves the cart to localstorage
    this.saveCart();

    // clear tbody
    this.tbody.innerHTML = '';

    // re-add new items to the cart
    this.cart.forEach(function(i) {

      tr = document.createElement('TR');
      tr.setAttribute('data-index', index);

      tr.innerHTML =
              '<td class="name">' +
								'<span>' + i.name + '</span>' +
								'<small>' + i.sku + '</small>' +
							'</td>' +
							'<td class="quantity number">' +
								'<input type="number" value="' + i.quantity + '" class="cart-change-item">' +
								'<button class="cart-remove-item">' +
									'<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g>' +
									' <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>' +
								'</button>' +
							'</td>' +
							'<td class="price number">' + context.mark + context.formatCurrency(i.price) + '</td>' +
							'<td class="total number">' + context.mark + context.formatCurrency((i.price * i.quantity)) + '</td>' +
						'</tr>';

				if(i.shipped == true) {
  				isShipped = true;
				}

        // calculate subtotal
				subtotal += (i.price * i.quantity);

        // append child
        context.tbody.appendChild(tr);

        // increment index
        index++;

    });

    // handle input changes on the table
    els = context.tbody.querySelectorAll('input[type=number]');

    for(x=0; x<els.length; x++) {

      count += parseInt(els[x].value);

      els[x].addEventListener('change', function(e) {

        var target = e.target, value, tr;

        // get index
        tr = target.closest('tr');
        index = tr.getAttribute('data-index');

        value = target.value;

        if(value == 0) {
          context.cart.splice(index, 1);
        }
        else {
          context.cart[index].quantity = value;
        }

        context.bind();

      });

    }

    // set count
    this.items = els.length;

    // set count
    this.count = count;

    // update ui
		this.el.querySelector('.subtotal td').innerHTML = this.mark + this.formatCurrency(subtotal);

		// calculate tax
		tax = subtotal * this.taxRate;

		// update ui
		this.table.querySelector('.tax td').innerHTML = this.mark + this.formatCurrency(tax);

		// hide tax if 0
		if(tax == 0) {
      this.table.querySelector('.tax').style.display = 'none';
		}
		else {
  		this.table.querySelector('.tax').style.display = 'table-row';
    }

		// calculate shipping
		if(isShipped == true) {
  		shipping = this.flatRateShipping;
		}
		else {
  		shipping = 0;
		}

		if(this.count == 0) {
  		shipping = 0;
		}

		// hide shipping if 0
		if(shipping == 0) {
      this.table.querySelector('.shipping').style.display = 'none';
		}
		else {
  		this.table.querySelector('.shipping').style.display = 'table-row';
    }

		// update ui
		this.table.querySelector('.shipping td').innerHTML = this.mark + this.formatCurrency(shipping);

		// calculate total
		this.total = subtotal + tax + shipping;

		// update ui
		this.table.querySelector('.total td').innerHTML = this.mark + this.formatCurrency(this.total);

		// update the count on the document
		els = document.querySelectorAll('[cart-count]');

		for(x=0; x<els.length; x++) {
  		els[x].innerHTML = this.cart.length;
		}

		// update the total on the document
		els = document.querySelectorAll('[cart-total]');

		for(x=0; x<els.length; x++) {
  		els[x].innerHTML = this.mark + this.formatCurrency(this.total);
		}

  }

}

/*
 * Prebuilt CartItem - Holds an item in the cart
 * @author Prebuilt / matt@matthewsmith.com
 * @ref: https://prebuilt.io/cart
 */
class CartItem {

  constructor(name, sku, quantity, price, shipped) {

    this.name = name;
    this.sku = sku;
    this.quantity = quantity;
    this.price = price;
    this.shipped = shipped;
  }

}

/*
 * CartItem - Holds an item in the cart
 * <div cart
 *     data-flat-rate-shipping="0"
 *     data-tax-rate="0.67"
 *     data-currency="USD"
 *     data-locale="en"
 *     data-image="http://cart.prebuilt.io/resources/prebuilt-icon.png"
 *     data-name="Prebuilt Sample Store"
 *     data-zip-code="true"
 *     data-billing-address="true"
 *     data-shipping-address="true"
 *     data-key="pk_test_FnhHnW31Z7M7ggXsStF19xXJ"
 *     data-pay-api="api/pay.php"
 *     data-subscribe-api="api/subscribe.php"
 *     successUrl="page/thank-you.html"></div>
 *
 */
if(document.querySelector('[cart]')) {

  // add stripe cart JS
  document.write('<script src="https://checkout.stripe.com/checkout.js"></script>');

  var cart, flatRateShipping, taxRate, currency, locale, image, name, zipCode, billingAddress, shippingAddress, key, payApi, subscribeApi;

  cart = document.querySelector('[cart]');

  flatRateShipping = parseFloat(cart.getAttribute('data-flat-rate-shipping')) || 0;
  taxRate = parseFloat(cart.getAttribute('data-tax-rate')) || 0;
  currency = cart.getAttribute('data-currency') || 'USD';
  locale = cart.getAttribute('data-locale') || 'en';
  image = cart.getAttribute('data-image') || 'https://stripe.com/img/documentation/checkout/marketplace.png';
  name = cart.getAttribute('data-name') || 'Sample Store';
  zipCode = (cart.getAttribute('data-zip-code') === 'true') || false;
  billingAddress = (cart.getAttribute('data-billing-address') === 'true') || false;
  shippingAddress = (cart.getAttribute('data-shipping-address') === 'true') || false;
  key = cart.getAttribute('data-key') || '';
  payApi = cart.getAttribute('data-pay-api') || '';
  subscribeApi = cart.getAttribute('data-subscribe-api') || '';
  successUrl = cart.getAttribute('data-success-url') || '';

  cart = new Cart(flatRateShipping, taxRate, currency, locale, image, name, zipCode, billingAddress, shippingAddress, key, payApi, subscribeApi, successUrl);
}