<?php

	// DB connection parameters
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'respond');
	define('DB_USER', 'dbuser');
	define('DB_PASSWORD', 'dbpass');
	
	// app URL
	define('APP_URL', 'http://path.torespond.com');
	
	// site admin
	define('SITE_ADMIN', '');
	
	// passcode
	define('PASSCODE', 'iloverespond');
	
	// CORS
	define ('CORS', serialize (array (
	    'http://path.torespond.com'
	    )));
	    
	// Google Maps API Key
	define('GOOGLE_MAPS_API_KEY', 'YOUR_API_KEY');
	
	// the brand of your app
    define('BRAND', 'Respond');
    define('COPY', 'Version 2.0.  Made by <a href="http://matthewsmith.com">Matthew Smith</a> in Manchester, MO');
	
	# libraries
	define('BOOTSTRAP_CSS', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css');
	define('BOOTSTRAP_AMELIA_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/amelia/bootstrap.min.css');
	define('BOOTSTRAP_CERULEAN_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/cerulean/bootstrap.min.css');
	define('BOOTSTRAP_COSMO_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/cosmo/bootstrap.min.css');
	define('BOOTSTRAP_CYBORG_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/cyborg/bootstrap.min.css');
	define('BOOTSTRAP_FLATLY_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/flatly/bootstrap.min.css');
	define('BOOTSTRAP_JOURNAL_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/journal/bootstrap.min.css');
	define('BOOTSTRAP_READABLE_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/readable/bootstrap.min.css');
	define('BOOTSTRAP_SIMPLEX_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/simplex/bootstrap.min.css');
	define('BOOTSTRAP_SLATE_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/slate/bootstrap.min.css');
	define('BOOTSTRAP_SPACELAB_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/spacelab/bootstrap.min.css');
	define('BOOTSTRAP_UNITED_CSS', '//netdna.bootstrapcdn.com/bootswatch/3.0.0/united/bootstrap.min.css');
	define('BOOTSTRAP_JS', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js');
	define('FONTAWESOME_CSS', '//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.min.css');
	define('JQUERY_JS', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
	define('JQUERYUI_JS', 'http://code.jquery.com/ui/1.10.3/jquery-ui.js');
	define('JQUERYUI_CSS', 'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css');
	define('KNOCKOUT_JS', 'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js');

?>