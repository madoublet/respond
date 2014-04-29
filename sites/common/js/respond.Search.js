/*
	Creates the lists for Respond CMS
*/
var respond = respond || {};

respond.Search = function(config){

	this.el = config.el;
	this.id = $(this.el).attr('data-for');

	var context = this;
	
	$('body').on('click', function(){
		
		$('.respond-search').parent().removeClass('open');
	});
	
    // handles previous for respond calendar
    $(this.el).on('submit', function(){
    	
    	var term = $(this).find('input[type=text]').val();
    	var language = $('html').attr('lang');
    	var url = pageModel.apiEndpoint + 'api/site/search';
    	
    	
		$(context.el).parent().find('.results').remove();
		$(context.el).parent().addClass('open');
    	$(context.el).parent().find('.searching').show();
		$(context.el).parent().find('.no-results').hide();
    	
    	$.ajax({
			url: url,
			type: 'POST',
			dataType: 'JSON',
			data: {term:term, language:language},
			success: function(data){
				
				var results = '';
			
				for(x=0; x<data.length; x++){
				
					var imageUrl = '';
					var hasImage = '';
					
					if(data[x]['Image'] != '' && data[x]['Image'] != null){
						imageUrl = '<img src="' + pageModel.prefix() + 'files/t-' + data[x]['Image'] + '">';
						hasImage = ' has-image';
					}
				
					// set desc length
                	var desc = data[x].Description;
                	
                	if(desc != ''){
	                	if(desc.length > 75){
		                	desc = desc.substr(0, 75) + '...';
	                	}
                	}
					
				
					results += '<li class="results'+hasImage+'">' +
				      	'<a href="'+ pageModel.prefix() + data[x]['Url'] + '">' +
				      		imageUrl + 
					      	'<h4>' + data[x]['Name'] + '</h4>' +
					      	'<small>' + data[x]['Url'] + '</small>' +
					      	'<p>' + desc + '</p>' +
				      	'</a>' +
				      '</li>';
				}
				
				if(data.length==0){
					$(context.el).parent().find('.searching').hide();
					$(context.el).parent().find('.no-results').show();
				}
				else{
					$(context.el).parent().find('.searching').hide();
					$(context.el).parent().find('.no-results').hide();
				}
				
				var searching = $(context.el).parent().find('.searching').get(0);
				$(results).insertBefore($(searching));
				
			},
			error: function(xhr, errorText, thrownError){
				//alert('error');
			}
        });
    	
    	return false;
    	
    });
    

}
