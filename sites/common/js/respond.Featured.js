/*
	Creates the featured section for Respond CMS
*/
var respond = respond || {};

respond.Featured = function(config){

	this.el = config.el;

	var pageUniqId = $(this.el).attr('data-pageuniqid');
		
	$.ajax({
		url:  pageModel.apiEndpoint + 'api/page/published/featured',
		type: 'POST',
		context: this,
		data: {pageUniqId: pageUniqId, prefix: pageModel.prefix(), language: pageModel.language},
		success: function(data){
			$(this.el).html(data);
			
			// update controls for the featured content
			pageModel.setupControls(this.el);  
		}
	});
	
}