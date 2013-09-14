<?php

	// debugging
	define('DEBUG', true);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}

    // include setup
    include 'setup.php';
    
    // include data-access objects
	include 'dao/DB.php';
	include 'dao/User.php';
	include 'dao/Site.php';
	include 'dao/PageType.php';
	include 'dao/MenuType.php';
	include 'dao/Page.php';
	include 'dao/MenuItem.php';
	
	// include libs
	include 'libs/Utilities.php';
	include 'libs/Validator.php';
	include 'libs/Image.php';
	include 'libs/AuthUser.php';
	include 'libs/simple_html_dom.php';
	require "libs/lessc.inc.php";
	include 'libs/Generator.php';
	include 'libs/Publish.php';
	include 'libs/PasswordHash.php';
	
?>
