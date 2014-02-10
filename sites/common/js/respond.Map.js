/*
	Creates the map for Respond CMS
*/
var respond = respond || {};

respond.Map = function(config){

	this.el = config.el;
	
	var mapId = $(this.el).find('.map-container').attr('id');
	var directionId = $(this.el).find('a').attr('id'); 

	var address = $(this.el).find('p.map-address span').html();
    
    // create a point on the map for the address
    function createPoint(latitude, longitude, content){
        
        // set map options
        var mapOptions = {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // create the map              
        var map = new google.maps.Map(document.getElementById(mapId), mapOptions);
        
        var coords = new google.maps.LatLng(latitude, longitude);
        
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        
        map.setCenter(coords);
        
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: content
        });
        
        
    }
    
    // geo-code the address
    var geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({'address': address}, function(results, status){
    
        if (status == google.maps.GeocoderStatus.OK){
            // #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
            createPoint(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
        }
    
    });
	
}