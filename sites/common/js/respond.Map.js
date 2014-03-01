/*
	Creates the map for Respond CMS
*/
var respond = respond || {};

respond.maps = [];

respond.Map = function(config){

	this.el = config.el;
	
	// get DOM id of map
	var mapId = $(this.el).find('.map-container').attr('id');
	
	// create the map
	var mapOptions = {
      center: new google.maps.LatLng(38.6272, 90.1978),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

	// create the map              
    var map = new google.maps.Map(document.getElementById(mapId), mapOptions);

	// add it to the associative array
	respond.maps[mapId] = {
		reference:map, 
		bounds:new google.maps.LatLngBounds(),
		markers: []
		};
	
	// look for a default address
	if($(this.el).find('p.map-address span').length > 0){
	
		var address = $(this.el).find('p.map-address span').html();
	      
	    // geo-code the address
	    var geocoder = new google.maps.Geocoder();
	    
	    geocoder.geocode({'address': address}, function(results, status){
	    
	        if (status == google.maps.GeocoderStatus.OK){
	            // #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
	            respond.Map.CreatePoint(mapId, results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
	        }
	    
	    });
	    
    }
	
}

// creates and adds a point to a map
respond.Map.CreatePoint = function(mapId, latitude, longitude, content){
	
    // create coords
    var coords = new google.maps.LatLng(latitude, longitude);
    
    // create info window
    var infowindow = new google.maps.InfoWindow({
        content: content
    });
    
    // create marker
    var marker = new google.maps.Marker({
        position: coords,
        map: respond.maps[mapId].reference,
        title: content
    });
    
    // push marker to array
    respond.maps[mapId].markers.push(marker);
    
    // set map
    var map =  respond.maps[mapId].reference;
    
	// handle click of marker (future)
	google.maps.event.addListener(marker, 'click', function() {
    	infowindow.open(map, marker);
		});
    
    // extend the bounds based on the new marker
    respond.maps[mapId].bounds.extend(marker.position);
    
    // fit the map to the bounds
    respond.maps[mapId].reference.fitBounds(respond.maps[mapId].bounds);

}

// creates and adds a point to a map
respond.Map.ClearPoints = function(mapId){

	if(respond.maps[mapId]){

		for (var i = 0; i < respond.maps[mapId].markers.length; i++ ) {
			respond.maps[mapId].markers[i].setMap(null);
		}
		
		respond.maps[mapId].markers.length = 0;
		
	}

}