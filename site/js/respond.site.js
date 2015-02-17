var respond = respond || {};

respond.site = {
	
	// site settings
	settings: {},
	
	// init respond.site
	init:function(){
		
		// settings toggle
		$('.settings-toggle').on('click', function(){
			$('body').toggleClass('show-settings');
		});
		
		// cart toggle
		$('.cart-toggle').on('click', function(){
			$('body').toggleClass('show-cart');
		});
		
		// search toggle
		$('.search-toggle').on('click', function(){
			$('body').toggleClass('show-search');
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