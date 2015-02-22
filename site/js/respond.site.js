var respond = respond || {};

respond.site = {
	
	// site settings
	settings: {},
	
	// options
	options: null,
	
	// init respond.site
	init:function(){
	
	},
	
	// translates a text string
	i18n:function(text){
		
		// setup i18next (if not setup)
		if(respond.site.options == null){
			
			respond.site.options = {
		        lng: respond.site.settings.Language,
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
	}
	
};

// fire init
$(document).ready(function(){respond.site.init();});