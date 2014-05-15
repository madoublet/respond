<?php

	// debugging
	define('DEBUG', false);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}
	else{
		error_reporting(E_ERROR | E_PARSE);
	}
	
	session_start();
	
	// authenticate secure pages
	if($isSecure == true){
		$siteAuthUser = new SiteAuthUser($siteFriendlyId, $rootPrefix, $pageUrl); // get auth user
		$siteAuthUser->Authenticate($pageTypeUniqId, $rootPrefix, $pageUrl);
	}
	
	// get supported language
	$supported = Utilities::GetSupportedLanguages($rootPrefix);
	
	// check if multiple languages are supported
	if(count($supported) > 1){
	
		if(isset($_SESSION[$siteFriendlyId.'.Language'])){
			$language = $_SESSION[$siteFriendlyId.'.Language'];
		}
		else{
			// set language as the default language
			$_SESSION[$siteFriendlyId.'.Language'] = $language;
		}
		
	}
	
	Utilities::SetLanguage($language, $rootPrefix.'locale');
	
?>