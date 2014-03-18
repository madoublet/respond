<?php
	
	include 'libs/Utilities.php'; // import utilities
	include 'libs/AuthUser.php'; // import utilities
	
	session_start();

	// get supported language
	$supported = Utilities::GetSupportedLanguages($rootPrefix);
	
	// check if multiple languages are supported
	if(count($supported) > 1){
	
		if(isset($_SESSION['Language'])){
			$language = $_SESSION['Language'];
		}
		else{
			// get the preferred language from the supported list
			$language = Utilities::GetPreferredLanguage($supported);
			
			// set language in the session
			$_SESSION['Language'] = $language;
		}
		
	}
	
	Utilities::SetLanguage($language, $rootPrefix);
	
	// convert php syntax (e.g. en_US -> en-us
    if(strlen($language) > 2){ 
		$arr = explode('_', $language);
		$language = strtolower($arr[0]).'-'.strtoupper($arr[1]);
	}
?>