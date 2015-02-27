var respond = respond || {};

respond.site = {
	
	// site settings
	settings: {},
	
	// options
	options: null,

	// init respond.site
	init:function(){
		
		// translate if needed
		if(sessionStorage['respond-language'] != null){
			
			var language = sessionStorage['respond-language'];
			
			// translate if the set language is not the default
			if(language != respond.site.settings.Language){
				respond.site.translate(language);
			}
			
		}
		else{
			sessionStorage['respond-language'] = respond.site.settings.Language;
		}
		
		// setup prettyprint
		prettyPrint();
		
	},
	
	// translates a page
	translate:function(language){
		
		var els = $('[data-i18n]');
		
		for(x=0; x<els.length; x++){
			var id = $(els[x]).attr('data-i18n');
			var html = respond.site.i18n(id);
			
			$(els[x]).html(html);
		}
		
	},
	
	// translates a text string
	i18n:function(text){
		
		// setup i18next (if not setup)
		if(respond.site.options == null){
			
			var language = respond.site.settings.Language
			
			if(sessionStorage['respond-language'] != null){
				language = sessionStorage['respond-language'];
			}
			
			// set language
			respond.site.options = {
		        lng: language,
		        getAsync : false,
		        useCookie: false,
		        useLocalStorage: false,
		        fallbackLng: 'en',
		        resGetPath: 'locales/__lng__/__ns__.json',
		        defaultLoadingValue: ''
		    };
		
			i18n.init(respond.site.options);
			
		}
		
		return i18n.t(text);	
	},
	
	// set current language
	setLanguage:function(language){
		
		i18n.setLng(language, function(t) { /* loading done */ 
			sessionStorage['respond-language'] = language;
			respond.site.translate(language);
		});
	},
	
	// gets a QueryString by name
	getQueryStringByName:function(name){
		  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  var regexS = "[\\?&]" + name + "=([^&#]*)";
		  var regex = new RegExp(regexS);
		  var results = regex.exec(window.location.href);
		  if(results == null)
		    return null;
		  else
		    return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
};

// fire init
$(document).ready(function(){respond.site.init();});