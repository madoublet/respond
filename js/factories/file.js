(function() {
    
    angular.module('respond.factories')
    
    .factory('File', function($http, $cacheFactory, Setup){
	
		var file = {};
		file.data = [];
		
		// invalidate cache
		file.invalidateCache = function(){
			
			var $cache = $cacheFactory.get('$http');
			$cache.remove(Setup.api + '/file/list');
			$cache.remove(Setup.api + '/download/list');
			$cache.remove(Setup.api + '/file/retrieve/size');
			$cache.remove(Setup.api + '/image/list/all');
			
		}
		
		// retrieve downloads
		file.listDownloads = function(callback){
		
			// post to API
			$http.get(Setup.api + '/download/list', {cache:true})
				.then(function(res){
					// set data for factory
					file.data = res.data;
					return file.data;
				})
				.then(callback);
		}
		
		
		// retrieve files
		file.list = function(callback){
		
			// post to API
			$http.get(Setup.api + '/file/list', {cache:true})
				.then(function(res){
					// set data for factory
					file.data = res.data;
					return file.data;
				})
				.then(callback);
		}
		
		// retrieve size of files
		file.retrieveSize = function(callback){
		
			// post to API
			$http.get(Setup.api + '/file/retrieve/size', {cache:true})
				.then(function(res){
					// set data for factory
					file.data = res.data;
					return file.data;
				})
				.then(callback);
		}
		
		// remove file
		file.remove = function(toBeRemoved, folder, callback){
		
			// set params
			var params = {
					filename: toBeRemoved.filename,
					folder: folder
				};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/file/remove', $.param(params))
				.then(function(res){
					
					var i = file.getIndexByFilename(toBeRemoved.filename);
					if(i !== -1)file.data.splice(i, 1);
					
					return;
				})
				.then(callback);
			
			// invalidate the cache
			file.invalidateCache();
		}
		
		// get the index by id
		file.getIndexByFilename = function(filename){
		
			var data = file.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].filename == filename){
					return x;
				}
				
			}
			
			return -1;
		}
		
		
		return file;
		
	})
	
})();