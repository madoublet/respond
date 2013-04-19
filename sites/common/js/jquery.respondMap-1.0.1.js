(function($){  
	$.fn.respondMap = function(){
	
		var mapId = $(this).find('.map-container').attr('id');
		var directionId = $(this).find('a').attr('id'); 
		var zoom = 12;
	
		var address = $(this).find('p.map-address span').html();
		
		var latitude = 38.646991;
		var longitude = -90.224967;
		
		var container = new VEMap(mapId);
		container.SetDashboardSize(VEDashboardSize.Tiny);
		container.LoadMap(new VELatLong(latitude, longitude), 10, 'r', false);
		
		var context = this;
		
		// handle callback
		function callback(shapeLayer, findResults, places, moreResults, errorMsg){
			// if there are no results, display any error message and return
			if(places == null){
				alert( (errorMsg == null) ? "There were no results" : errorMsg );
				return;
			}
		
			var bestPlace = places[0];
		   
			// Add pushpin to the *best* place
			var location = bestPlace.LatLong;
		   
			var newShape = new VEShape(VEShapeType.Pushpin, location);
		   
			var desc = address + '<br>(' + location.Latitude + ', ' + location.Longitude + ')';
		 
			newShape.SetDescription(desc);
			newShape.SetTitle(address);
			container.AddShape(newShape);
			container.SetZoomLevel(zoom);
		   
			// set url for full map
			var fullurl = 'http://bing.com/maps/default.aspx?v=2&lvl=12&rtp=~pos.' + location.Latitude + '_' + location.Longitude;
		   
			$('#'+directionId).attr('href', fullurl); // set new url for the full map
		}
	
		container.Find(null, // what
		  address, // where
		  null, // VEFindType (always VEFindType.Businesses)
		  null, // VEShapeLayer (base by default)
		  null, // start index for results (0 by default)
		  null, // max number of results (default is 10)
		  null, // show results? (default is true)
		  null, // create pushpin for what results? (ignored since what is null)
		  false, // use default disambiguation? (default is true)
		  null, // set best map view? (default is true)
		  callback); // call back function
		
	}	
})(jQuery);