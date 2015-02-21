var respond = respond || {};

respond.site = {
	
	// site settings
	settings: {},
	
	// states
	settingsVisible: false,
	cartVisible: false,
	searchVisible: false,
	
	// options
	options: null,
	
	// init respond.site
	init:function(){
	
		// settings toggle
		$('.settings-toggle').on('click', function(){
			
			respond.site.settingsVisible = !respond.site.settingsVisible;
			
			if(respond.site.settingsVisible == true){
				$('respond-settings').attr('display', 'visible');
			}
			else{
				$('respond-settings').attr('display', 'hidden');	
			}
			
		});
		
		// cart toggle
		$('.cart-toggle').on('click', function(){
			
			respond.site.cartVisible = !respond.site.cartVisible;
			
			if(respond.site.cartVisible == true){
				$('respond-cart').attr('display', 'visible');
			}
			else{
				$('respond-cart').attr('display', 'hidden');	
			}
			
		});
		
		// search toggle
		$('.search-toggle').on('click', function(){
			
			respond.site.searchVisible = !respond.site.searchVisible;
			
			if(respond.site.searchVisible == true){
				$('respond-search').attr('display', 'visible');
			}
			else{
				alert('set hidden');
				$('respond-search').attr('display', 'hidden');	
			}
			
		});
		
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