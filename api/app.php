<?php

	/************************************/
	/*  LOAD SETUP                      */
	/************************************/

    // include optional local setup
    if(file_exists('../setup.local.php')){
    	include '../setup.local.php';
    }
    else{
    	include '../setup.php';
    }
    
    
    /************************************/
	/*  DEBUGGING                       */
	/************************************/
    
    // Debugging
	define('DEBUG', false);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}
   
   
	/************************************/
	/*  Locations                       */
	/************************************/
   
	// Locations of apps and sites
	define('APP_LOCATION', '../');
	define('SITES_LOCATION', '../sites');
   
   
	/************************************/
	/*  Data Access Objects             */
	/************************************/
   
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
	
	
	/************************************/
	/*  External Libraries              */
	/************************************/
	
	// include external libs (via composer)
	require 'vendor/autoload.php';

    // include non-composer external libs
	require_once 'libs/PasswordHash.php';
	require_once 'libs/class-php-ico.php';
	require_once 'libs/IpnListener.php';
	require_once 'libs/simple_html_dom.php';
	
	// include libs
	require_once 'libs/Utilities.php';
	require_once 'libs/Webhooks.php';
	require_once 'libs/S3.php';
	require_once 'libs/Validator.php';
	require_once 'libs/Image.php';
	require_once 'libs/Publish.php';
	
	
	/************************************/
	/*  REST Objects                    */
	/************************************/
	
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
    require_once 'rest/snippet.php';
    require_once 'rest/app.php';
   
	// workaround for JSON module issues
	if(defined('JSON_C_VERSION') == false){	
		define('JSON_C_VERSION', true);
	}
	
	// workaround for apache_request_headers not available under Nginx/FastCGI
	if (!function_exists('apache_request_headers')) { 
        function apache_request_headers() { 
            foreach($_SERVER as $key=>$value) { 
                if (substr($key,0,5)=="HTTP_") { 
                    $key=str_replace(" ","-",ucwords(strtolower(str_replace("_"," ",substr($key,5))))); 
                    $out[$key]=$value; 
                }else{
                    $out[$key]=$value; 
		}
            } 
            return $out; 
        } 
}
?>