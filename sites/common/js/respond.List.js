/*
	Creates the lists for Respond CMS
*/
var respond = respond || {};

respond.List = function(config){

	this.el = config.el;

    function updateList(params){
           
		// get the list from the API
	    $.ajax({
	    	url: params.url,
			type: 'POST',
	        dataType: 'JSON',
			data: params,
			success: function(data){
			
				if(data.length == 0){ // hide pager when we hit the end
					$('#pager-'+params.id).hide();
				}
			
	            for(x=0; x<data.length; x++){
	            
	                if(params.display=='blog'){
	            
	                    // replace image url
	                    var content = data[x].Content;
	                    
	                    // push page to model
	                    pageModel[params.id].push({
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
	                    pageModel[params.id].push({
	                        'pageUniqId': data[x].PageUniqId,
	                        'name': data[x].Name, 
	                        'desc': data[x].Description,
	                        'url': pageModel.prefix()+data[x].Url,
	                        'hasImage': data[x].HasImage,
	                        'image': pageModel.prefix()+data[x].Image,
	                        'thumb': pageModel.prefix()+data[x].Thumb,
	                        'hasCallout': data[x].HasCallout,
	                        'callout': data[x].Callout
	                        });
	                }
	            }
	            
	            
			}
		});
		
	}
	
	// build initial params
	var params = respond.List.BuildParams(this.el);
	params.page = 0;
	
	// create observable array
	pageModel[params.id] = ko.observableArray([]);
	
	// update list
	updateList(params);
	
    // handles paging the list
    $('#pager-' + $(this.el).attr('id')).on('click', function(){
    
    	var id = $(this).attr('data-id');
		var el = $('#'+id);
		var page = parseInt($(el).attr('data-page'));
        
		// build initial params
		var params = respond.List.BuildParams(el);
		params.page = page + 1;
		$(el).attr('data-page', params.page);
        
        updateList(params);
        
    });


}

// builds parameters for the API call
respond.List.BuildParams = function(el){

	// parse element to build the params
	var params = {
				id: $(el).attr('id'),
				label: $(el).attr('data-label'),
				display: $(el).attr('data-display'),
				siteUniqId: pageModel.siteUniqId(), 
				pageTypeUniqId: $(el).attr('data-pagetypeid'), 
				pageSize: $(el).attr('data-length'), 
				orderBy: $(el).attr('data-orderby'), 
				category: $(el).attr('data-category'),
				language: pageModel.language, 
				prefix: pageModel.prefix()
				};

	
	// set URL based on display
	var url = pageModel.apiEndpoint + '/api/page/published/list';
	
	if(params.display == 'blog'){
        url = pageModel.apiEndpoint + '/api/page/published/blog';
    }
    
    if(params.display == 'calendar'){
	    
	    url = '/api/page/published/calendar';
	    
	    // set begin equal to today
	    var today = moment().startOf('day');
	    
	    params.beginDate = today.format('YYYY-MM-DD 00:00:00');
	    
	    // 2 weeks
	    var end = moment().add('days', 14).endOf('day');
	    
	    params.endDate = end.format('YYYY-MM-DD 23:59:59'); //two weeks from now by default
    }
    
    // set the url
    params.url = url;
    
	return params;
    
}