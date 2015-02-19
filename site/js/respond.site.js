var respond = respond || {};

respond.site = {
	
	// site settings
	settings: {},
	
	// states
	settingsVisible: false,
	cartVisible: false,
	searchVisible: false,
	
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
	
	// gets the qs from the URL
	getQueryStringByName:function(name){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if(results == null){
			return "";
		}
		else{
			return decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	}
	
};

$(document).ready(function(){respond.site.init();});