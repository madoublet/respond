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
    results: ko.observableArray([]),
    
    init:function(){
    
    	// get the api and language
    	pageModel.apiEndpoint = '';
    	
    	if($('body').attr('data-pagetypeuniqid') != '-1'){
	    	pageModel.apiEndpoint = '../';
	    	pageModel.prefix('../');
    	}
    	
    	var language = $('html').attr('lang');
    	
    	if(language != ''){
	    	pageModel.language = language;
    	}
    	
    	// set language for moment
    	moment.lang(pageModel.language);
    	
    	// set the properties for the page
        pageModel.setupProperties();
    	
    	// setup controls for the initial state of the page
    	var el = $('body');
		pageModel.setupControls(el);
		
		// setup language controls
		pageModel.setupLanguageControls();
	   
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
    
    // get qs parameters
    getQueryString: function(name){
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
    
    // gets page properties
    setupProperties: function(){
      
      var body = $('body');
      
      pageModel.siteUniqId(body.attr('data-siteuniqid'));
      pageModel.siteFriendlyId(body.attr('data-sitefriendlyid'));
      pageModel.pageUniqId(body.attr('data-pageuniqid'));
      pageModel.pageFriendlyId(body.attr('data-pagefriendlyid'));
      pageModel.pageTypeUniqId(body.attr('data-pageTypeUniqId'));
      
    },
    
    // sets up controls for the page
    setupControls: function(el){
    
    	// setup lists
    	var els = $(el).find('.respond-list');
		
		for(var x=0; x<els.length; x++){
		
			// default page to 0
			$(els[x]).attr('data-page', '0');
		    
		    // create list
            var list = new respond.List({
            	el: els[x]
			});                
		}
		
		// setup search
    	var els = $(el).find('.respond-search');
		
		for(var x=0; x<els.length; x++){
		
		    // create search
            var search = new respond.Search({
            	el: els[x]
			});                
		}
		
		// setup featured
		var els = $(el).find('.featured-content');
		
		for(x=0; x<els.length; x++){
		
			var featured = new respond.Featured({
				el: els[x]	
			});  
		
		}
        
        // setup maps
        var els = $(el).find('.respond-map');
    	
		for(var x=0; x<els.length; x++){
			var map = new respond.Map({
	            el: els[x]
            });
        }
		
		// setup carousels
		$('.carousel').carousel();
		
		// setup forms
		var els = $(el).find('.respond-form');
		
		for(var x=0; x<els.length; x++){
            var form = new respond.Form({
	            el: els[x]
            });
		}
		
		// setup calendars
		var els = $(el).find('.respond-calendar');
		
		for(var x=0; x<els.length; x++){
            var calendar = new respond.Calendar({
	            el: els[x],
	            weeks: 2
            });
		}
		
		// setup login
		var els = $(el).find('.respond-login');
		
		for(var x=0; x<els.length; x++){
            var login = new respond.Login({
	            el: els[x]
            });
		}
		
		// setup registration
		var els = $(el).find('.respond-registration');
		
		for(var x=0; x<els.length; x++){
            var login = new respond.Registration({
	            el: els[x]
            });
		}
        
        // setup pretty print
        prettyPrint();
        
        // setup fancy box
        $(el).find('.gallery-image').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            }
        });
    },
    
    // handles language controls
    setupLanguageControls:function(){
	    
	    var language = $('html').attr('lang');
	    
	    // set the current language
	    $('select.respond-select-language').val(language);
	    
	    // handle the on change for the language
	    $('select.respond-select-language').on('change', function(){
		    
		    // new language
		    var language = $(this).val();
		    	
		    $.ajax({
				url:  pageModel.apiEndpoint + 'api/site/change/language',
				type: 'POST',
				context: this,
				data: {language: language},
				success: function(data){
					location.reload(true); // refresh page to get new language
				}
			});
		    
	    });
	    
	    // handle a language list
		$('ul.respond-select-language a').on('click', function(){
		    
		    // new language
		    var language = $(this).attr('data-lang');
		    
		    var friendlyId = $('body').attr('data-sitefriendlyid');
		    	
		    $.ajax({
				url:  pageModel.apiEndpoint + 'api/site/change/language',
				type: 'POST',
				context: this,
				data: {language: language},
				success: function(data){
					location.reload(true); // refresh page to get new language
				}
			});
		    
	    });
	    
	    
    }
}

$(document).ready(function(){pageModel.init();});
