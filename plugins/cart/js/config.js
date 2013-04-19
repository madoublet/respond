if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the name
plugin.cart = {

	showUpdate:false, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.cart.pageUniqId = pageUniqId;
		plugin.cart.pluginUniqId = pluginUniqId;

		// load data from action class
		$.post('plugins/cart/process.php', {
			Ajax: 'product.get',
			PageUniqId: pageUniqId
		}, function(data){
			$('#cart-existing tbody').html(data);
		});

		// setup click event for custom button
		$('#cart-addsku').click(function(){
			var sku = $('#cart-sku').val();
			var name = $('#cart-name').val();
			var price =$('#cart-price').val();

			message.showMessage('progress', 'Adding SKU...');
				
			$.post('plugins/cart/process.php', {
				Ajax: 'product.add',
				PageUniqId: plugin.cart.pageUniqId,
				SKU: sku,
				Name: name,
				Price: price
			}, function(data){

				message.showMessage('success', 'SKU added successfully!');

				var html = '<tr data-productuniqid="'+data.ProductUniqId+'" data-sku="'+sku+'" + data-name="'+name+'" + data-price="'+price+'"><td>' + sku + '</td>' +
					'<td>' + name + '</td><td>$' + price + '</td><td><a class="remove-product">Remove</a></td></tr>';

				$('#cart-noskus').remove();

				$('#cart-existing tbody').append(html);

				// clear form
				$('#cart-sku').val('');
				$('#cart-name').val('');
				$('#cart-price').val('');

			}, 'json');
		});
	},

	// handles the click of the submit button
	update:function(el){
		alert('test submit');
	}

}
