/*
	Creates the featured section for Respond CMS
*/
var respond = respond || {};

respond.Featured = function(config){

	this.el = config.el;

	var pageUniqId = $(this.el).attr('data-pageuniqid');
	var context = this;
		
	$.ajax({
		url: pageModel.prefix() + 'fragments/render/' + pageUniqId + '.php',
		type: 'GET',
		data: {},
		success: function(data){
			
			// replace image url
            var content = data;
            var stringToFind = 'sites/' + pageModel.siteFriendlyId() + '/';
            var stringToReplace = pageModel.prefix();
            
            content = pageModel.replaceAll(content, stringToFind, stringToReplace);
			
			$(context.el).html(content);
		}
	});
	
}