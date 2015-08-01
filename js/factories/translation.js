(function() {
    
    angular.module('respond.factories')
    
    .factory('Translation', function($http, Setup){
	
		var translation = {};
		translation.data = [];
		translation.locales = [];
		
		// retrieve locales for site
		translation.listLocales = function(callback){
		
			// set params
			var params = {};
		
			// post to API
			$http.post(Setup.api + '/translation/list/locales', $.param(params))
				.then(function(res){
				
					// set data for factory
					translation.locales = res.data;
					return translation.locales;
					
				})
				.then(callback);
		}
		
		// retrieve translation for language, site
		translation.retrieve = function(locale, callback){
		
			// set params
			var params = {
					locale: locale
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/retrieve', $.param(params))
				.then(function(res){
					// set data for factory
					translation.data = res.data;
					return translation.data;
				})
				.then(callback);
		}
		
		// retrieve default translation for site
		translation.retrieveDefault = function(callback){
		
			// post to API
			$http.post(Setup.api + '/translation/retrieve/default')
				.then(function(res){
					// set data for factory
					translation.data = res.data;
					return translation.data;
				})
				.then(callback);
		}
		
		// clears translations for a page
		translation.clear = function(pageId){
			
			// clear translations
			translation.data[pageId] = {};
			
		}
		
		// adds a translation
		translation.add = function(pageId, key, value){
			
			// create page namespace if null
			if(translation.data[pageId] == null){
				translation.data[pageId] = {};
			}
		
			// add translation 
			translation.data[pageId][key] = value;	
		}
		
		// adds a locale
		translation.addLocale = function(locale, callback){
		
			// set params
			var params = {locale: locale};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/add/locale', $.param(params))
				.then(function(res){
					
					// push locale to factory
					translation.locales.push(locale);
					
				})
				.then(callback);
		}
		
		// removes a locale
		translation.removeLocale = function(locale, callback){
		
			// set params
			var params = {locale: locale};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/remove/locale', $.param(params))
				.then(function(res){
					
					// push locale to factory
					var index = translation.locales.indexOf(locale);
					
					// remove from index
					if(index > -1){
					    translation.locales.splice(index, 1);
					}
					
				})
				.then(callback);
		}
		
		// saves a translation
		translation.save = function(callback){
			
			// stringify the translation object
			var content = JSON.stringify(translation.data, null, "\t");
			
			// set params
			var params = {content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/save', $.param(params))
				.success(callback);
			
		}
		
		// publishes a translation
		translation.publish = function(locale, content, callback){
			
			// set params
			var params = {locale: locale, content: content};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/translation/save', $.param(params))
				.success(callback);
			
		}	
		
		return translation;	
	})
	
})();