// models the page
var pageModel = {
    
    apiEndpoint: '',
    language: 'en',
    
    prefix: ko.observable(''),
    siteUniqId: ko.observable(''),
    siteFriendlyId: ko.observable(''),
    pageUniqId: ko.observable(''),
    pageFriendlyId: ko.observable(''),
    pageTypeUniqId: ko.observable(''),
    menu: ko.observableArray([]),
    
    init:function(){
    
    	// get the api and language
    	pageModel.apiEndpoint = $('body').attr('data-api');
    	pageModel.language = $('html').attr('lang');
    	
    	// setup the controls
        pageModel.setupProperties();
		pageModel.setupControls();
	   
        // apply bindings
        ko.applyBindings(pageModel, $('#content').get(0));

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
    
    	// setup lists
    	var els = $('.respond-list');
		
		for(var x=0; x<els.length; x++){
		
			// default page to 0
			$(els[x]).attr('data-page', '0');
		    
		    // create list
            var list = new respond.List({
            	el: els[x]
			});                
		}
		
		// setup featured
		var els = $('.featured-content');
		
		for(x=0; x<els.length; x++){
		
			var featured = new respond.Featured({
				el: els[x]	
			});  
		
		}
        
        // setup maps
        var els = $('.map');
    	
		for(var x=0; x<els.length; x++){
			var map = new respond.Map({
	            el: els[x]
            });
        }
		
		// setup carousels
		$('.carousel').carousel();
		
		// setup forms
		var els = $('.respond-form');
		
		for(var x=0; x<els.length; x++){
            var form = new respond.Form({
	            el: els[x]
            });
		}
		
		// setup calendars
		var els = $('.respond-calendar');
		
		for(var x=0; x<els.length; x++){
            var calendar = new respond.Calendar({
	            el: els[x],
	            weeks: 2
            });
		}
        
        // setup pretty print
        prettyPrint();
    }
}

$(document).ready(function(){pageModel.init();});
