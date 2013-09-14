var skuDialog = {

	dialog: null,
	cartId: -1,

	init:function(){

		skuDialog.dialog = $('#skuDialog');

		$('#addSKU').click(function(){
		
			var pageUniqId = contentModel.pageUniqId();
			var sku = $('#sku').val();
			var desc = $('#sku-desc').val();
			var price = $('#sku-price').val();
			var quantity = $('#sku-quantity').val();
			var shippingType = $('#sku-shipping-type').val();
			var shipping = $('#sku-shpping').val();
			var downloadUrl = $('#sku-download-url').val();
			
			$.ajax({
				url: 'api/product/add',
				type: 'GET',
				dataType: 'json',
				data: {
					sku:sku,
					description:desc,
					price:price,
					quantity:quantity,
					shippingType:shippingType,
					shipping:shipping,
					downloadUrl:downloadUrl,
					cartId:skuDialog.cartId,
					pageUniqId: pageUniqId
				},
				success: function(data){
	                message.showMessage('success', 'SKU added');
	                $('#skuDialog').modal('hide');
				}
			});


			/*
			var editor = $('#desc');

			if($('div#'+formId+' span.field-container:last-child').get(0)){
				$(editor).find('div#'+formId+' span.field-container:last-child').after(html);
			}
			else{
				$(editor).find('div#'+formId+' div').html(html);
			}

			$(editor).respondHandleEvents();

			$('#fieldDialog').modal('hide');*/

			return false;
			
		});
		
		$('#sku-shipping-type').on('change', function(){
		
			if($(this).val()=='flat-rate' || $(this).val()=='per-item'){
				$('#sku-show-download').hide();
				$('#sku-show-ship').show();
			}
			else if($(this).val()=='digital'){
				$('#sku-show-download').show();
				$('#sku-show-ship').hide();
			}
			else{
				$('#sku-show-download').hide();
				$('#sku-show-ship').hide();
			}
			
		});
	},

	show:function(cartId){ // shows the dialog
	 
		skuDialog.cartId = cartId;
		
		$('#sku-show-download').hide();
		$('#sku-show-ship').show();
		
		$('#sku').val('');
		$('#sku-desc').val('');
		$('#sku-price').val('');
		$('#sku-quantity').val('');
		$('#sku-shipping-type').val('flat-rate');
		$('#sku-shpping').val('');
		$('#sku-download-url').val('');

	    $('#skuDialog').modal('show');

	}

}

$(document).ready(function(){
  	skuDialog.init();
});