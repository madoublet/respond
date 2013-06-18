<?php

    // the brand of your app
    define('BRAND', 'Respond');
    define('COPY', 'Version 2.0.  Made by <a href="http://matthewsmith.com">Matthew Smith</a> in Manchester, MO');

	// the email of the site admin (grants access to all sites)
    define('SITE_ADMIN', 'youremail@yourdomain.com');

	// passcode to create a site (leave blank to not require a passcode)
	define('PASSCODE', 'iloverespond');

    // google maps API key
    define('GOOGLE_MAPS_API_KEY', 'YOUR GOOGLE MAPS API KEY');
    
    // define lib locations 
    define('BOOTSTRAP_CSS', '//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css');
    define('BOOTSTRAP_JS', '//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js');
    define('FONTAWESOME_CSS', '//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css');
    define('JQUERY_JS', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
    define('JQUERYUI_JS', 'http://code.jquery.com/ui/1.10.3/jquery-ui.js');
    define('JQUERYUI_CSS', 'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css');
    define('KNOCKOUT_JS', 'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js');

	// url of the app
    define('APP_URL', 'http://urloftheapp.com');
    
    // allowed CORS origins (allows JavaScript access to parts the API), ref: http://www.html5rocks.com/en/tutorials/cors/
    define ('CORS', serialize (array (
        'http://dev.respondcms.com'
        )));
    
    // include data-access objects and helper functions
	include 'dao/DB.php';
	include 'dao/User.php';
	include 'dao/Site.php';
	include 'dao/PageType.php';
	include 'dao/MenuType.php';
	include 'dao/Page.php';
	include 'dao/MenuItem.php';
	include 'libs/Utilities.php';
	include 'libs/Validator.php';
	include 'libs/Image.php';
	include 'libs/AuthUser.php';
	include 'libs/simple_html_dom.php';
	require "libs/lessc.inc.php";
	include 'libs/FeedParser.php';
	include 'libs/Generator.php';
	include 'libs/Publish.php';
	include 'libs/PasswordHash.php';
?>