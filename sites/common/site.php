<?php
	
	include 'libs/Utilities.php'; // import utilities
	include 'libs/AuthUser.php'; // import utilities
	
	session_start();

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