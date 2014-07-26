/*
	Creates the lists for Respond CMS
*/
var respond = respond || {};

respond.List = function(config){

	this.el = config.el;

	// build initial params
	var params = respond.List.BuildParams(this.el);
	params.page = 0;
	
	// create observable array
	pageModel[params.id] = ko.observableArray([]);
	pageModel[params.id + 'Loading'] = ko.observable(false); // set loading to true by default
	
	// update list
	respond.List.Update(params);
	
    // handles paging the list
    $('#pager-' + $(this.el).attr('id')).on('click', function(){
    
    	var id = $(this).attr('data-id');
		var el = $('#'+id);
		var page = parseInt($(el).attr('data-page'));
        
		// build initial params
		var params = respond.List.BuildParams(el);
		params.page = page + 1;
		$(el).attr('data-page', params.page);
        
        // updates the list based on params
        respond.List.Update(params);
        
    });
    
    // handles previous for respond calendar
    $('body').on('click', '.respond-calendar .prev', function(){
    	var start = $(this).attr('data-start');
    	var weeks = parseInt($(this).attr('data-weeks'));
    	var list = $(this).attr('data-list');
    	
    	var m = moment(start, 'YYYY-MM-DD HH:mm:ss');
    	
    	// build params
    	var el = $('#' + list);
    	var params = respond.List.BuildParams(el);
    	
    	// calculate m_start
    	var m_start = moment(m).add('days', (weeks*7*-1));
    	
    	// set begin and end date
    	params.beginDate = m_start.format('YYYY-MM-DD 00:00:00');
    	params.endDate = m.format('YYYY-MM-DD 23:59:59');
    	params.page = 0;
    	
    	console.log(params);
    	
    	// update list
		respond.List.Update(params);
		
		// refresh calendar
		var els = $(this).parents('.respond-calendar');
		
		if(els.length > 0){
			respond.Calendar.Build(els[0], m_start, weeks)
		}
    });
    
     // handles next for respond calendar
    $('body').on('click', '.respond-calendar .next', function(){
	   	var start = $(this).attr('data-start');
    	var weeks = $(this).attr('data-weeks');
    	var list = $(this).attr('data-list');
    	
    	var m = moment(start, 'YYYY-MM-DD HH:mm:ss');
    	
    	// build params
    	var el = $('#' + list);
    	var params = respond.List.BuildParams(el);
    	
    	// calculate m_start
    	var m_start = moment(m).add('days', (weeks*7));
    	
    	// set begin and end date
    	params.beginDate = m_start.format('YYYY-MM-DD 00:00:00');
    	params.endDate = m.add('days', (weeks*7)+(weeks*7)).format('YYYY-MM-DD 23:59:59');
    	params.page = 0;
    	
    	console.log(params);
    	
    	// update list
		respond.List.Update(params);
		
		// refresh calendar
		var els = $(this).parents('.respond-calendar');
	
		if(els.length > 0){
			respond.Calendar.Build(els[0], m_start, weeks)
		}
    });


}

// builds parameters for the API call
respond.List.BuildParams = function(el){

	// parse element to build the params
	var params = {
				id: $(el).attr('id'),
				label: $(el).attr('data-label'),
				display: $(el).attr('data-display'),
				pageTypeUniqId: $(el).attr('data-pagetypeid'), 
				descLength: $(el).attr('data-desclength'),
				pageSize: $(el).attr('data-length'), 
				orderBy: $(el).attr('data-orderby'), 
				category: $(el).attr('data-category'),
				language: pageModel.language, 
				prefix: pageModel.prefix()
				};
				
	// set URL based on display
	var url = pageModel.apiEndpoint + 'api/page/published/list';
	
	if(params.display == 'blog'){
        url = pageModel.apiEndpoint + 'api/page/published/blog';
    }
    
    if(params.display == 'calendar'){
	    
	    url = pageModel.apiEndpoint + 'api/page/published/calendar';
	    
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

// updates the list based on params
respond.List.Update = function(params){
     
    pageModel[params.id + 'Loading'](true); 
    
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
			
			// gets a reference to the calendar
			var calendar = null;
			
			if(params.display=='calendar'){
			
				var els = $('.respond-calendar[data-list='+ params.id+ ']');
				
				if(els.length>0){
					calendar = $(els[0]).get(0);
				}
			}
			
			// clear observable array
			pageModel[params.id].removeAll();
		
			// iterate through the data
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
						'beginDateReadable': data[x].BeginDateReadable,
                        'lastModified': data[x].LastModified,
                        'author': data[x].Author,
                        'hasPhoto': data[x].HasPhoto,
                        'photo': pageModel.prefix()+data[x].Photo
                        });
                }
                else if(params.display=='calendar'){
                
                	// set desc length
                	var desc = data[x].Description;
                	
                	if(desc != ''){
	                	if(desc.length > params.descLength){
		                	desc = desc.substr(0, params.descLength) + '...';
	                	}
                	}
                
                	// push page to model
                	pageModel[params.id].push({
                        'pageUniqId': data[x].PageUniqId,
                        'name': data[x].Name, 
                        'desc': desc,
                        'url': pageModel.prefix()+data[x].Url,
                        'hasImage': data[x].HasImage,
                        'image': pageModel.prefix()+data[x].Image,
                        'thumb': pageModel.prefix()+data[x].Thumb,
                        'hasCallout': data[x].HasCallout,
                        'beginDate': data[x].BeginDate,
                        'beginDateReadable': data[x].BeginDateReadable,
                        'endDate': data[x].EndDate,
                        'endDateReadable': data[x].EndDateReadable,
                        'callout': data[x].Callout,
                        'author': data[x].Author,
                        'hasPhoto': data[x].HasPhoto,
                        'photo': pageModel.prefix()+data[x].Photo
                        });
                        
					respond.Calendar.AddEvent(calendar, 
						data[x].Name, data[x].Description, 
						pageModel.prefix()+data[x].Url, 
						data[x].BeginDate, data[x].EndDate);
                        
                }
                else if(params.display=='map'){
                
                	// get location and latlong
                	var location = data[x].Location;
                	var latLong = data[x].LatLong;
                	var latitude = null;
                	var longitude = null;
                	
                	// parse latitude and longitude
                	if(latLong != null && latLong != ''){
	
						var point = latLong.replace('POINT(', '').replace(')', '');
						var arr = point.split(' ');
					
						// set latitude and longitude
						latitude = arr[0];
						longitude = arr[1];
					}
					
					// set desc length
                	var desc = data[x].Description;
                	
                	if(desc != ''){
	                	if(desc.length > params.descLength){
		                	desc = desc.substr(0, params.descLength) + '...';
	                	}
                	}
                
                	// push page to model
                    pageModel[params.id].push({
                        'pageUniqId': data[x].PageUniqId,
                        'name': data[x].Name, 
                        'desc': desc,
                        'url': pageModel.prefix()+data[x].Url,
                        'location': location,
                        'latitude': latitude,
                        'longitude': longitude,
                        'hasImage': data[x].HasImage,
                        'image': pageModel.prefix()+data[x].Image,
                        'thumb': pageModel.prefix()+data[x].Thumb,
                        'hasCallout': data[x].HasCallout,
                        'callout': data[x].Callout,
                        'author': data[x].Author,
                        'hasPhoto': data[x].HasPhoto,
                        'photo': pageModel.prefix()+data[x].Photo
                        });
                    
                    // add a point to the map    
					if(latitude != null && longitude != null){
						var mapId = 'list-map-' + params.id;
						
						var content = '<div class="map-marker-content content">' +
										'<h4><a href="' + pageModel.prefix()+data[x].Url + '">' + data[x].Name + '</a></h4>';
						
						if(data[x].HasImage == true){
							content +=	'<img src="' + pageModel.prefix()+data[x].Thumb + '">';
						}				
										
						content +=	'<h5>' + location + '</h5>' +
										'<p>' + data[x].Description + '</p>' +
										'</div>';
						
						
						respond.Map.CreatePoint(mapId, 'auto', latitude, longitude, content);
					}
                }
                else{
                
                	// set desc length
                	var desc = data[x].Description;
                	
                	if(desc != ''){
	                	if(desc.length > params.descLength){
		                	desc = desc.substr(0, params.descLength) + '...';
	                	}
                	}
                	
                	// push page to model
                    pageModel[params.id].push({
                        'pageUniqId': data[x].PageUniqId,
                        'name': data[x].Name, 
                        'desc': desc,
                        'url': pageModel.prefix()+data[x].Url,
                        'hasImage': data[x].HasImage,
                        'image': pageModel.prefix()+data[x].Image,
                        'thumb': pageModel.prefix()+data[x].Thumb,
                        'hasCallout': data[x].HasCallout,
                        'callout': data[x].Callout,
                        'author': data[x].Author,
                        'hasPhoto': data[x].HasPhoto,
                        'photo': pageModel.prefix()+data[x].Photo
                        });
                }
            }
            
            pageModel[params.id + 'Loading'](false);
            
            // update controls for the blog
            if(params.display == 'blog'){
            	var el = $('#'+params.id);
            	pageModel.setupControls(el);    
            }
           
            
		}
	});
}