/*
	Creates the calendar for Respond CMS
*/
var respond = respond || {};

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
respond.Calendar.AddEvent = function(el, name, description, url, beginDate, endDate){

	// create begin and end from moment
	var m_begin = moment(beginDate, "YYYY-MM-DD HH:mm:ss");
	var m_end = moment(endDate, "YYYY-MM-DD HH:mm:ss");
	
	var time = m_begin.format('h:mm a') + ' - ' + m_end.format('h:mm a')

	var event = '<div class="event">' +
					'<h4><a href="' + url + '">' + name + '</a></h4>' +
					'<h5>' + time + '</h5>' +
				//	'<p>' + description + '</p>' +
				'</div>';
				
	
	var els = $(el).find('[data-date='+m_begin.format('YYYY-MM-DD')+']');
	
	if(els.length > 0){
		$(els[0]).append(event);
	}				

	
}

