<section id="cart" class="panel panel-default">

	<div class="panel-heading"><?php print _("Shopping Cart"); ?> <span class="badge" data-bind="text:count"></span></div>

	<div class="cart-items" data-bind="foreach:items">
	
		<div class="cart-item">
			<div class="cart-group1">
				<span class="cart-description" data-bind="text:description"></span>
				<span class="cart-sku" data-bind="text:sku"></span>
			</div><div class="cart-group2">
				<span class="cart-price" data-bind="text:priceFriendly, attr:{'data-price':price}"></span>
				<span class="cart-shipping" data-bind="text:shippingType, attr:{'data-type':shippingType}"></span>
			</div><div class="cart-group3">
				<span class="cart-quantity"><input type="number" class="form-control" data-bind="value: quantity, event:{change: $parent.updateQuantity}"></span>
				<span class="cart-add">
					<button class="btn btn-default" data-bind="click: $parent.removeFromCart">
						<i class="fa fa-minus-circle"></i> <span><?php print _("Remove"); ?></span>
					</button>
				</span>
			</div><div class="cart-group4">
				<span class="subtotal" data-bind="text:subtotalFriendly"></span>
			</div>
		</div>
		<!-- /.cart-item -->
	
	</div>
	<!-- /.cart-items -->
	
	<div class="total">
		<label><?php print _("Total:"); ?></label>
		<strong data-bind="text:totalFriendly"></strong> 
	</div>
	
	<div class="checkout">
		<button 
			class="btn btn-default" 
			data-email="{{email}}"
			data-bind="click:checkoutWithPayPal"><?php print _("Checkout with Paypal"); ?></button>
	
	</div>
	
</section>
<!-- /#cart -->


