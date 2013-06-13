<?php
	// the email of the site admin (grants access to all sites)
    define('SITE_ADMIN', 'youremail@yourdomain.com');

	// passcode to create a site (leave blank to not require a passcode)
	define('PASSCODE', 'iloverespond');

	// email and password of the demo user that appears on the login page (you still need to create a demo user)
    define('DEMO_EMAIL', 'demo@respondcms.com');
    define('DEMO_PASSWORD', 'demo');
    
    // google maps API key
    define('GOOGLE_MAPS_API_KEY', 'YOURKEY');

	// url of the app
    define('APP_URL', 'http://urloftheapp.com');
    
    // allowed CORS origins (allows JavaScript access to parts the API), ref: http://www.html5rocks.com/en/tutorials/cors/
    define ('CORS', serialize (array (
        'http://urloftheapp.com',
        'http://www.urloftheapp.com'
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
