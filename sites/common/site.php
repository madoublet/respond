<?php
	
	include 'libs/Utilities.php'; // import utilities
	
	session_start();

	if(isset($_SESSION['Language'])){
		$language = $_SESSION['Language'];
	}
	else{
		$supported = Utilities::GetSupportedLanguages($rootPrefix);
		$language = Utilities::GetPreferredLanguage($supported);
		
		// set language in the session
		$_SESSION['Language'] = $language;
	}
	
	Utilities::SetLanguage($language, $rootPrefix);
	
	// convert php syntax (e.g. en_US -> en-us
    if(strlen($language) > 2){ 
		$arr = explode('_', $language);
		$language = strtolower($arr[0]).'-'.strtoupper($arr[1]);
	}
?>