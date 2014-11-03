/*
	Components for default respond CMS widgets
*/
var respond = respond || {};

// respond.Map
respond.maps = [];

respond.Map = function(config){

	this.el = config.el;
	this.address = config.address;
	this.zoom = config.zoom;
	
	var defaultZoom = 8;	
	
	if(this.zoom != 'auto' && this.zoom != undefined){
		defaultZoom = parseInt(this.zoom);
	}
	
	// get DOM id of map
	var mapId = config.id;
	
	// create the map
	var mapOptions = {
      center: new google.maps.LatLng(38.6272, 90.1978),
      zoom: defaultZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

	// create the map              
	var container = $(config.el).find('.map-container').get(0);
	
    var map = new google.maps.Map(container, mapOptions);

	// add it to the associative array
	respond.maps[mapId] = {
		reference:map, 
		bounds:new google.maps.LatLngBounds(),
		markers: []
		};	
	
	// look for a default address
	if(this.address != null && this.address != undefined){
	
	    // geo-code the address
	    var geocoder = new google.maps.Geocoder();
	    
	    var context = this;
	    
	    geocoder.geocode({'address': this.address}, function(results, status){
	    
	        if (status == google.maps.GeocoderStatus.OK){
	            // #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
	            respond.Map.CreatePoint(mapId, context.zoom, results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
	        }
	    
	    });
	    
    }
	
}

// creates and adds a point to a map
respond.Map.CreatePoint = function(mapId, zoom, latitude, longitude, content){
	
    // create coords
    var coords = new google.maps.LatLng(latitude, longitude);
    
    // create info window
    var infowindow = new google.maps.InfoWindow({
        content: content
    });
    
    // create marker
    var marktext = $("<div/>").html(content).text();
    
    //alert(mapId);
    
    var marker = new google.maps.Marker({
        position: coords,
        map: respond.maps[mapId].reference,
        title: marktext
    });
    
    // push marker to array
    respond.maps[mapId].markers.push(marker);
    
    // set map
    var map =  respond.maps[mapId].reference;
    
	// handle click of marker (future)
	google.maps.event.addListener(marker, 'click', function() {
    	infowindow.open(map, marker);
		});
	
    if(zoom == 'auto'){
    	// extend the bounds based on the new marker
		respond.maps[mapId].bounds.extend(marker.position);
    
		// fit the map to the bounds
    	respond.maps[mapId].reference.fitBounds(respond.maps[mapId].bounds);
    }
    else{
	    respond.maps[mapId].reference.setCenter(coords);
    }

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

// respond.Calendar
respond.Calendar = function(config){

	this.el = config.el;
	this.weeks = config.weeks;

	var now = moment();

	// build calendar
	respond.Calendar.Build(this.el, now, this.weeks);

}

// build calendar
respond.Calendar.Build = function(el, m_start, weeks){

	// set begin and end
	var m_start = m_start.startOf('day');
	var m_end = moment(m_start).startOf('day').add('days', weeks*7);


	// build weekdays
	var days = moment.weekdaysShort();

	var container = '<div class="respond-calendar-container">';

	var day = parseInt(m_start.format('d'));

	// create title
	var title = '<div class="title">' +
				 m_start.format('dddd, MMMM Do') + ' - ' + m_end.format('dddd, MMMM Do') +
				 '<i class="prev fa fa-angle-left" ' +
				 'data-start="' + m_start.format('YYYY-MM-DD HH:mm:ss') + '" data-weeks="' + weeks + '" ' +
				 'data-list="' + $(el).attr('data-list') + '"' +
				 '></i>' +
				 '<i class="next fa fa-angle-right" ' +
				 'data-start="' + m_start.format('YYYY-MM-DD HH:mm:ss') + '" data-weeks="' + weeks + '" ' +
				 'data-list="' + $(el).attr('data-list') + '"' +
				 '></i>' +
				 '</div>'

	// create header (weeks)
	var header =  '<div class="header">';

	for(x=0; x<days.length; x++){
		header += '<span>' + days[x] + '</span>';
	}

	header += '</div>';

	container += '<div class="week">';

	var pastDate = true;
	var cssClass = '';


	for(x=0; x<(7*weeks)+day+1; x++){

		// create offset
		var offset = x - day;

		// get date
		var curr_date = moment(m_start).add('days', offset);

		// current day
		var curr_day = parseInt(curr_date.format('d'));

		// difference b/w days
        var diff = curr_date.diff(m_start, 'days');
        
		if(diff >= 0){
			cssClass = ' active';
		}

		if(moment(curr_date).isSame(moment(), 'day')){
			cssClass += ' today';
		}
        
		if(offset==0){
			container += '<span class="day'+cssClass+'" data-date="'+curr_date.format('YYYY-MM-DD')+'">';
			pastDate = true;
		}
		else{
			container += '<span class="day'+cssClass+'" data-date="'+curr_date.format('YYYY-MM-DD')+'">';
		}

		container += '<span class="day-number">'+curr_date.format('D') + '</span>';

		container += '</span>';

		if((x+1)%7==0){
			container+='</div><div class="week">';
		}

    }

    container += '</div></div>';


    $(el).html(title+header+container);

}

// adds an event to a calendar, el is a DOM reference to the calendar
respond.Calendar.AddEvent = function(calendarId, beginDate, endDate, content){

	var el = $('#' + calendarId);

	// create begin and end from moment
	var m_begin = moment(beginDate, "YYYY-MM-DD HH:mm:ss");
	var m_end = moment(endDate, "YYYY-MM-DD HH:mm:ss");

	var els = $(el).find('[data-date='+m_begin.format('YYYY-MM-DD')+']');

	if(els.length > 0){
		$(els[0]).append(content);
	}				
}

// reusable utility methods
respond.utilities = {

	getQueryStringByName:function(name){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if(results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
}
