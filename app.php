<?php

	// debugging
	define('DEBUG', true);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}
	
	// set default as UTC
	date_default_timezone_set('UTC');

    // include setup
    require_once 'setup.php';
    
    // include data-access objects
	require_once 'dao/DB.php';
	require_once 'dao/User.php';
	require_once 'dao/Site.php';
	require_once 'dao/PageType.php';
	require_once 'dao/MenuType.php';
	require_once 'dao/Page.php';
	require_once 'dao/MenuItem.php';
	require_once 'dao/Category.php';
	
	// include external libs
    require_once 'libs/stripe/lib/Stripe.php';
	require_once 'libs/simple_html_dom.php';
	require_once "libs/lessc.inc.php";
	require_once 'libs/PasswordHash.php';
	
	// include libs
	require_once 'libs/Utilities.php';
	require_once 'libs/Validator.php';
	require_once 'libs/Image.php';
	require_once 'libs/AuthUser.php';
	require_once 'libs/Publish.php';
	
?>
