<?php

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
	
	// CORS (optional for external sites)
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
	
    // start page (sets the default page a user sees after logon)
	define('START_PAGE', 'pages');
	
	// set the default theme (directory name: themes/simple => simple)
	define('DEFAULT_THEME', 'simple');

	// the brand of your app
    define('BRAND', 'Respond CMS');
    define('COPY', 'Version '.VERSION.'.  Made by <a href="http://matthewsmith.com">Matthew Smith</a> in Manchester, MO');

?>
