// models the page
var pageModel = {
    
    apiEndpoint: '',
    
    prefix: ko.observable(''),
    siteUniqId: ko.observable(''),
    siteFriendlyId: ko.observable(''),
    pageUniqId: ko.observable(''),
    pageFriendlyId: ko.observable(''),
    pageTypeUniqId: ko.observable(''),
    menu: ko.observableArray([]),
    
    init:function(){
    
    	pageModel.apiEndpoint = $('body').attr('data-api');
    	
        pageModel.setupProperties();
		pageModel.setupControls();
		pageModel.updateLists();
		pageModel.updateFeatured();
        
        // apply bindings
        ko.applyBindings(pageModel);

	},

    // updates data for lists on the page
    updateLists: function(){
        
    	var lists = $('div.list');
		
        // create and populate bindings for the list
		for(var x=0; x<lists.length; x++){
			
            var id = $(lists[x]).attr('id');
            var label = $(lists[x]).attr('data-label');
            var display = $(lists[x]).attr('data-display');
            var pageTypeUniqId = $(lists[x]).attr('data-pagetypeid');
            var pageSize = $(lists[x]).attr('data-length');
            var orderBy = $(lists[x]).attr('data-orderby');
            var siteUniqId = pageModel.siteUniqId();
        
        
            pageModel[id] = ko.observableArray([]);
            
            console.log('create observableArray: ' + id);
            
            // use an anonymous function to pass the id, ref: http://stackoverflow.com/questions/1194104/jquery-ajax-ajax-passing-parameters-to-callback-good-pattern-to-use
            function updateList(id, display, pageTypeUniqId, pageSize, orderBy, siteUniqId){
                
                $.ajax({
                	url: pageModel.apiEndpoint + 'api/page/published/' + display,
        			type: 'POST',
                    dataType: 'JSON',
        			data: {siteUniqId: siteUniqId, pageTypeUniqId: pageTypeUniqId, pageSize: pageSize, orderBy: orderBy, page: 0},
        			success: function(data){

                        for(x=0; x<data.length; x++){
                        
                            if(display=='blog'){
                                
                                console.log(data);
                        
                                // replace image url
                                var content = data[x].Content;
                                var stringToFind = 'sites/' + pageModel.siteFriendlyId() + '/';
                                var stringToReplace = pageModel.prefix();
                                
                                content = pageModel.replaceAll(content, stringToFind, stringToReplace);
                                
                                // push page to model
                                pageModel[id].push({
                                    'pageUniqId': data[x].PageUniqId,
                                    'name': data[x].Name, 
                                    'content': content,
                                    'url': data[x].Url
                                    });
                            }
                            else{
                                pageModel[id].push({
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
            
            updateList(id, display, pageTypeUniqId, pageSize, orderBy, siteUniqId);
		}
    },
    
    // updated featured content for the widget
    updateFeatured: function(){
	  
	  var featured = $('.featured-content');
	  
	  for(x=0; x<featured.length; x++){
		  
		var pageUniqId = $(featured[x]).attr('data-pageuniqid');
		
		function setFeatured(el, pageUniqId){
			$.ajax({
				url: pageModel.prefix() + 'fragments/render/' + pageUniqId + '.html',
				type: 'GET',
				data: {},
				success: function(data){
					
					// replace image url
                    var content = data;
                    var stringToFind = 'sites/' + pageModel.siteFriendlyId() + '/';
                    var stringToReplace = pageModel.prefix();
                    
                    content = pageModel.replaceAll(content, stringToFind, stringToReplace);
					
					$(el).html(content);
				}
			});
		}
		
		setFeatured(featured[x], pageUniqId);
	  }
	    
    },
    
    // replaces all occurances for a string
    replaceAll: function(src, stringToFind, stringToReplace){
	  	var temp = src;
	
		var index = temp.indexOf(stringToFind);
		
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		
		return temp;
	},
    
    // gets page properties
    setupProperties: function(){
      
      var body = $('body');
      
      pageModel.siteUniqId(body.attr('data-siteuniqid'));
      pageModel.siteFriendlyId(body.attr('data-sitefriendlyid'));
      pageModel.pageUniqId(body.attr('data-pageuniqid'));
      pageModel.pageFriendlyId(body.attr('data-pagefriendlyid'));
      pageModel.pageTypeUniqId(body.attr('data-pageTypeUniqId'));
      
      if(pageModel.pageTypeUniqId()!='-1'){
          pageModel.prefix('../');
      }
      
    },
    
    // sets up controls for the page
    setupControls: function(){
        
        var maps = $('.map'); // setup maps
    	
		for(var x=0; x<maps.length; x++){
			$(maps[x]).respondMap();
		}
		
		$('.carousel').carousel();
		
		var forms = $('.form-respond');
		
		for(var x=0; x<forms.length; x++){
            
            /*
            function processForm(form){
                
                $(form).find('button').on('click', function(){
                    $(form).respondProcessForm();
                });
                
            }
            
            processForm(forms[x]);*/
            
            $(forms[x]).respondForm();
    
		}
        
        prettyPrint();
    }
}

$(document).ready(function(){pageModel.init();});
