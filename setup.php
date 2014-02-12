<?php

	// Version
	define('VERSION', '2.7');

	// DB connection parameters
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'respond');
	define('DB_USER', 'dbuser');
	define('DB_PASSWORD', 'dbpass');
	
	// app URL NOTE: include the subdirectory if applicable, leave off the trailing /
	define('APP_URL', 'http://path.torespond.com');
	
	// setup default language for the site
	define('DEFAULT_LANGUAGE', 'en');
	
	// site admin
	define('SITE_ADMIN', '');
	
	// passcode
	define('PASSCODE', 'iloverespond');
	
	// CORS
	define ('CORS', serialize (array (
	    'http://path.torespond.com'
	    )));
	    
	// Google Maps API Key
	define('GOOGLE_MAPS_API_KEY', 'YOUR GOOGLE MAPS API KEY');
	
	// - Stripe
    // - set to the Stripe plan you want the user enrolled in when the site is created
    // - create account and plans at stripe.com (a trial period is recommended)
    define('DEFAULT_STRIPE_PLAN', '');
    
    // set Stripe API keys 
	define('STRIPE_API_KEY', '');
    define('STRIPE_PUB_KEY', '');
    
    // set what emails should be sent out and a reply-to email address
    define('REPLY_TO', '');
	define('SEND_WELCOME_EMAIL', false);
	define('SEND_PAYMENT_SUCCESSFUL_EMAIL', false);
	define('SEND_PAYMENT_FAILED_EMAIL', false);
	
	// the brand of your app
    define('BRAND', 'Respond CMS');
    define('COPY', 'Version 2.7.  Made by <a href="http://matthewsmith.com">Matthew Smith</a> in Manchester, MO');
    
    // start page (sets the default page a user sees after logon)
	define('START_PAGE', 'pages');
	
	// set the default theme (directory name: themes/simple => simple)
	define('DEFAULT_THEME', 'simple');
	
	// libraries
	define('FONT', 'http://fonts.googleapis.com/css?family=Roboto:400,700|Roboto+Condensed:400,700');
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
	define('FONTAWESOME_CSS', '//netdna.bootstrapcdn.com/font-awesome/4.0.2/css/font-awesome.css');
	define('JQUERY_JS', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
	define('JQUERYUI_JS', 'http://code.jquery.com/ui/1.10.3/jquery-ui.js');
	define('JQUERYUI_CSS', 'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css');
	define('KNOCKOUT_JS', 'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js');
    define('TIMEZONEDETECT_JS', '//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js');
	define('STRIPE_JS', 'https://js.stripe.com/v2/');
	define('MOMENT_JS', 'js/helper/moment-with-langs.min.js');

?>