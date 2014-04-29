var skuDialog = {

	dialog: null,
	shelfId: -1,
	product: null,
	toBeEdited: null,
	currency: 'USD', // default for now (will be set at site level)

	init:function(){

		skuDialog.dialog = $('#skuDialog');
		
		$('#add-sku').click(function(){
		
			var currency = $('#skuDialog').attr('data-currency');
			
			// validate currency
			if(currency != '' && currency != undefined){
				skuDialog.currency = currency;
			}
		
			var pageUniqId = contentModel.pageUniqId();
			
			var itemId = "shelf-item-" + $('.shelf-item').length;
			var sku = $('#sku').val();
			var desc = $('#sku-desc').val();
			var price = $('#sku-price').val();
			var shippingType = $('#sku-shippingType').val();
			var weight = $('#sku-weight').val();
			var unit = $('#sku-unit').val();
			
			// get readable
			var priceReadable = price+' '+skuDialog.currency;
			
			if(skuDialog.currency == 'USD'){
	   			priceReadable = '$'+priceReadable;
	   		
	   		}
			
			var item = '<div id="'+itemId+'" class="shelf-item">'+
								respond.defaults.elementMenuShelf +
								'<div class="shelf-group1">'+
								'<span class="shelf-description">'+desc+'</span>'+
								'<span class="shelf-sku">'+sku+'</span>'+
								'</div>'+
								'<div class="shelf-group2">'+
								'<span class="shelf-price" data-currency="'+skuDialog.currency+'" data-price="'+price+'">'+priceReadable+'</span>'+
								'<span class="shelf-shipping" data-type="'+shippingType+'" data-weight="'+weight+'" data-unit="'+unit+'">'+shippingType+'</span>'+
								'</div>'+
								'<div class="shelf-group3">'+
								'<span class="shelf-quantity"><input type="number" value="1" class="form-control"></span>'+
								'<span class="shelf-add"><button class="btn btn-default"><i class="fa fa-shopping-cart"></i> <span>Add to Cart</span></button></span>'+
								'</div></div>'; 
								
			
			$('#'+skuDialog.shelfId).find('.shelf-items').append(item);
			
			$('#skuDialog').modal('hide');
			
			return false;
		});
		
		$('#update-sku').click(function(){
		
			var sku = $('#sku').val();
			var desc = $('#sku-desc').val();
			var price = $('#sku-price').val();
			var shippingType = $('#sku-shippingType').val();
			var weight = $('#sku-weight').val();
			var unit = $('#sku-unit').val();
			
			// get readable
			var priceReadable = price+' '+skuDialog.currency;
			
			if(skuDialog.currency == 'USD'){
	   			priceReadable = '$'+priceReadable;
	   		}
			
			// update
			$(skuDialog.toBeEdited).find('.shelf-sku').text(sku);
			$(skuDialog.toBeEdited).find('.shelf-description').text(desc);
			$(skuDialog.toBeEdited).find('.shelf-price').attr('data-price', price);
			$(skuDialog.toBeEdited).find('.shelf-price').text(priceReadable);
			$(skuDialog.toBeEdited).find('.shelf-shipping').text(shippingType);
			$(skuDialog.toBeEdited).find('.shelf-shipping').attr('data-type', shippingType);
			$(skuDialog.toBeEdited).find('.shelf-shipping').attr('data-weight', weight);
			$(skuDialog.toBeEdited).find('.shelf-shipping').attr('data-unit', unit);
			
			$('#skuDialog').modal('hide');
			
			return false;
			
		});
		
		// hide/show shipping information
		$('#sku-shippingType').on('change', function(){
			
			var shippingType = $('#sku-shippingType').val();
			
			if(shippingType == 'shipped'){
				$('.shipped').show();
			}
			else{
				$('.shipped').hide();
			}
			
		});

		$('body').on('click', '.config-shelf', function(){
		
			var item = $(this.parentNode.parentNode);
		
			skuDialog.toBeEdited = item;
			skuDialog.shelfId = $(item).id;
		
			$('#skuDialog h3').text('Update SKU');
			$('#add-sku').hide();
			$('#update-sku').show();
		
			var sku = $(item).find('.shelf-sku').text();
			var description = $(item).find('.shelf-description').text();
			var price = $(item).find('.shelf-price').attr('data-price');
			var shippingType = $(item).find('.shelf-shipping').attr('data-type');
			var weight = $(item).find('.shelf-shipping').attr('data-weight');
			var unit = $(item).find('.shelf-shipping').attr('data-unit');
			
			// set shipping
			if(shippingType == 'shipped'){
				$('.shipped').show();
			}
			else{
				$('.shipped').hide();
			}
			
			// populate fields
			$('#sku').val(sku);
			$('#sku-desc').val(description);
			$('#sku-price').val(price);
			$('#sku-shippingType').val(shippingType);
			$('#sku-weight').val(weight);
			$('#sku-unit').val(unit);
	
		    $('#skuDialog').modal('show');
			
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
		$('#sku-shippingType').val('not shipped');
		$('#sku-shippingWeight').val('');
		$('#sku-shippingUnit').val('kgs');
		$('.shipped').hide();

	    $('#skuDialog').modal('show');

	}

}

$(document).ready(function(){
  	skuDialog.init();
});