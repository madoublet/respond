var skuDialog = {

	dialog: null,
	shelfId: -1,
	product: null,

	init:function(){

		skuDialog.dialog = $('#skuDialog');
		
		$('#add-sku').click(function(){
		
			var pageUniqId = contentModel.pageUniqId();
			
			var itemId = "shelf-item-" + $('.shelf-item').length;
			var sku = $('#sku').val();
			var desc = $('#sku-desc').val();
			var price = $('#sku-price').val();
			var currency = $('#sku-currency').val();
			var shippingType = $('#sku-shippingType').val();
			var shippingRate = $('#sku-shippingRate').val();
			
			// get readable
			var priceReadable = price+' '+currency;
			var shippingReadable = shippingType;
			
			if(currency == 'USD'){
	   			priceReadable = '$'+priceReadable;
	   		
		   		if(shippingType != 'digital' && shippingType != 'delivered' && shippingType != 'not shipped'){
		   			shippingReadable += ' - $'+shippingRate+' '+currency;
		   		}
	   		}
	   		else{
	   			if(shippingType != 'digital' && shippingType != 'delivered' && shippingType != 'not shipped'){
		   		 	shippingReadable += ' - '+shippingRate+' '+currency;
		   		 }
	   		}
			
			var item = '<div class="shelf-item">'+
								editorDefaults.elementMenuShelf +
								'<div class="shelf-group1">'+
								'<span class="shelf-description">'+desc+'</span>'+
								'<span class="shelf-sku">'+sku+'</span>'+
								'</div>'+
								'<div class="shelf-group2">'+
								'<span class="shelf-price" data-price="'+price+'">'+priceReadable+'</span>'+
								'<span class="shelf-shipping" data-type="'+shippingType+'" data-rate="'+shippingRate+'">'+shippingReadable+'</span>'+
								'</div>'+
								'<div class="shelf-group3">'+
								'<span class="shelf-quantity"><input type="number" value="1" class="form-control"></span>'+
								'<span class="shelf-add"><button class="btn btn-default"><i class="fa fa-shopping-cart"></i> <span>Add to Cart</span></button></span>'+
								'</div></div>'; 
			
			$('#'+skuDialog.shelfId).find('.shelf-items').append(item);
			
			$('#desc').respondHandleEvents();
			
			$('#skuDialog').modal('hide');

			return false;
			
		});

		$('#desc').on('click', '.config-shelf', function(){
		
			var item = $(this.parentNode.parentNode);
		
			skuDialog.shelfId = $(item).id;
		
			$('#skuDialog h3').text('Update SKU');
			$('#add-sku').hide();
			$('#update-sku').show();
		
			var sku = $(item).find('.shelf-sku').text();
			var description = $(item).find('.shelf-description').text();
			var price = $(item).find('.shelf-price').attr('data-price');
			var shippingType = $(item).find('.shelf-shipping').attr('data-type');
			var shippingRate = $(item).find('.shelf-shipping').attr('data-rate');
			
			// show/hide
			if(shippingType=='flat-rate' || shippingType=='per-item'){
				$('#sku-show-ship').show();
			}
			else if(shippingType=='digital'){
				$('#sku-show-ship').hide();
			}
			else{
				$('#sku-show-ship').hide();
			}
			
			// populate fields
			$('#sku').val(sku);
			$('#sku-desc').val(description);
			$('#sku-price').val(price);
			$('#sku-shippingType').val(shippingType);
			$('#sku-shippingRate').val(shippingRate);
	
		    $('#skuDialog').modal('show');
			
		});

		$('#update-sku').click(function(){
		
			var sku = $('#sku').val();
			var desc = $('#sku-desc').val();
			var price = $('#sku-price').val();
			var currency = $('#sku-currency').val();
			var shippingType = $('#sku-shippingType').val();
			var shippingRate = $('#sku-shippingRate').val();
			
			return false;
			
		});

		
		$('#sku-shippingType').on('change', function(){
		
			if($(this).val()=='flat-rate' || $(this).val()=='per-item'){
				$('#sku-show-ship').show();
			}
			else if($(this).val()=='digital'){
				$('#sku-show-ship').hide();
			}
			else{
				$('#sku-show-ship').hide();
			}
			
		});
	},

	show:function(shelfId){ // shows the dialog
	 
		skuDialog.shelfId = shelfId;
		skuDialog.product = null;
		
		$('#skuDialog h3').text('Add SKU');
		$('#add-sku').show();
		$('#update-sku').hide();
		
		$('#sku-show-ship').show();
		
		$('#sku').val('');
		$('#sku-desc').val('');
		$('#sku-price').val('');
		$('#sku-shippingType').val('flat-rate');
		$('#sku-shippingRate').val('');

	    $('#skuDialog').modal('show');

	}

}

$(document).ready(function(){
  	skuDialog.init();
});