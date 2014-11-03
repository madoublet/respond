<?php

	// Version
	define('VERSION', '4 ');

	// debugging
	define('DEBUG', true);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}
	
	// allowed filetypes (NOTE: gif, png, jpg, and svg are enabled by default)
	define('ALLOWED_FILETYPES', 'ico, css, js, pdf, doc, docx, zip');
	
	// advanced configurations
	define('IMAGE_AUTO_RESIZE', true);
	define('IMAGE_MAX_WIDTH', 1024);
	define('IMAGE_MAX_HEIGHT', 768);
	
	// thumb width and height
	define('THUMB_MAX_WIDTH', 200);
	define('THUMB_MAX_HEIGHT', 200);
	
	// set default as UTC
	date_default_timezone_set('UTC');
	
    // include optional local setup
    if(file_exists(__DIR__.'/setup.local.php')){
    	include 'setup.local.php';
    }
    else{
    	include 'setup.php';
    }
   
    // include database objects
	require_once 'db/DB.php';
	require_once 'db/User.php';
	require_once 'db/Site.php';
	require_once 'db/PageType.php';
	require_once 'db/MenuType.php';
	require_once 'db/Page.php';
	require_once 'db/Role.php';
	require_once 'db/MenuItem.php';
	require_once 'db/Transaction.php';
	require_once 'db/Version.php';
	require_once 'db/Product.php';
	
	// include external libs (via composer)
	require 'vendor/autoload.php';

    // include non-composer external libs
	require_once 'libs/PasswordHash.php';
	require_once 'libs/class-php-ico.php';
	require_once 'libs/IpnListener.php';
	
	// include libs
	require_once 'libs/Utilities.php';
	require_once 'libs/S3.php';
	require_once 'libs/Validator.php';
	require_once 'libs/Image.php';
	require_once 'libs/Publish.php';
	
	// include rest objects
	require_once 'rest/page.php';
	require_once 'rest/pageType.php';
	require_once 'rest/theme.php';
	require_once 'rest/menuItem.php';
	require_once 'rest/menuType.php';
    require_once 'rest/user.php';
    require_once 'rest/role.php';
    require_once 'rest/site.php';
    require_once 'rest/file.php';
    require_once 'rest/form.php';
    require_once 'rest/stylesheet.php';
    require_once 'rest/layout.php';
    require_once 'rest/script.php';
    require_once 'rest/translation.php';
    require_once 'rest/transaction.php';
    require_once 'rest/version.php';
    require_once 'rest/product.php';
    require_once 'rest/app.php';
   
	// workaround for JSON module issues
	if(defined('JSON_C_VERSION') == false){	
		define('JSON_C_VERSION', true);
	}
?>