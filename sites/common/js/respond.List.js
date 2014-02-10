/*
	Creates the lists for Respond CMS
*/
var respond = respond || {};

respond.List = function(config){

	var url = pageModel.apiEndpoint + '/api/page/published/list';
	
	if(config.display == 'blog'){
        url = pageModel.apiEndpoint + '/api/page/published/blog';
    }
    
    var model = config.model;
    
    model[config.id] = ko.observableArray([]);
            
    // use an anonymous function to pass the id
    function updateList(id, display, pageTypeUniqId, category, pageSize, orderBy, siteUniqId, page){
        
        $.ajax({
        	url: url,
			type: 'POST',
            dataType: 'JSON',
			data: {siteUniqId: siteUniqId, pageTypeUniqId: pageTypeUniqId, pageSize: pageSize, orderBy: orderBy, category: category, page: page, language: model.language, prefix: model.prefix()},
			success: function(data){
			
				if(data.length == 0){ // hide pager when we hit the end
    				$('#pager-'+id).hide();
				}
			
                for(x=0; x<data.length; x++){
                
                    if(display=='blog'){
                
                        // replace image url
                        var content = data[x].Content;
                        
                        // push page to model
                        model[id].push({
                            'pageUniqId': data[x].PageUniqId,
                            'name': data[x].Name, 
                            'content': content,
                            'url': data[x].Url,
                            'lastModifiedReadable': data[x].LastModifiedReadable,
                            'lastModified': data[x].LastModified,
                            'author': data[x].Author
                            });
                    }
                    else{
                        model[id].push({
                            'pageUniqId': data[x].PageUniqId,
                            'name': data[x].Name, 
                            'desc': data[x].Description,
                            'url': model.prefix()+data[x].Url,
                            'hasImage': data[x].HasImage,
                            'image': model.prefix()+data[x].Image,
                            'thumb': model.prefix()+data[x].Thumb,
                            'hasCallout': data[x].HasCallout,
                            'callout': data[x].Callout
                            });
                    }
                }
                
                
			}
		});
    }
    
    updateList(config.id, config.display, config.pageTypeUniqId, config.category, config.pageSize, config.orderBy, config.siteUniqId, 0);
    
    // handles paging the list
    $('#pager-'+config.id).on('click', function(){
        
        var id = $(this).attr('data-id');
	
		var list = $('#'+id);
		var label = $(list).attr('data-label');
        var display = $(list).attr('data-display');
        var pageTypeUniqId = $(list).attr('data-pagetypeid');
        var pageSize = $(list).attr('data-length');
        var orderBy = $(list).attr('data-orderby');
        var category = $(list).attr('data-category')
        var page = parseInt($(list).attr('data-page'));
        var siteUniqId = model.siteUniqId();
        
        page += 1; // increment the page
        
        $(list).attr('data-page', page);
        
        updateList(id, display, pageTypeUniqId, category, pageSize, orderBy, siteUniqId, page);
        
    });


}