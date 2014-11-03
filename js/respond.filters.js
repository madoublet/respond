angular.module('respond.filters', [])

.filter('notags', function() {
    return function(text) {
    
    	if(text === '' || text === null)return i18n.t('No tags');
    	else return text;
      
	}
})

.filter('fromNow', function() {
    return function(text) {
    	var st = moment.utc(text, 'YYYY-MM-DD HH:mm:ss');
		return st.fromNow();
	}
})

.filter('prettyDate', function() {
    return function(text) {
    	var st = moment.utc(text, 'YYYY-MM-DD HH:mm:ss');
		return st.format('MMM Do YYYY, h:mm:ss a');
	}
})

.filter('daysLeft', function() {
    return function(text) {
    
    	var now = moment.utc();
    
    	var st = moment.utc(text, 'YYYY-MM-DD HH:mm:ss');
		
		var difference = 30 - now.diff(st, 'days');
		
		if(difference < 0){
			difference = 0;
		}
		
		return difference;
	}
})

.filter('toid', function() {
    return function(text) {
    	
    	var text = text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    	return text.replace(/\s+/g, '-').toLowerCase();
      
	}
})


.filter('toHuman', function(){
	return function(text) {
		if(text != undefined){
			return text.charAt(0).toUpperCase() + text.substr(1);
		}
		else return text;
		
	}	
})
;
