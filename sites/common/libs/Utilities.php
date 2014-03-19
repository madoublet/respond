<?php

class Utilities
{
	// sets a language for the app
	public static function SetLanguage($language, $directory = 'locale'){
	
		// convert language to PHP format, if needed (e.g. en-gb -> en_GB)
		if(strpos($language, '-') !== FALSE){
			$arr = explode('-', $language);
			$language = strtolower($arr[0]).'_'.strtoupper($arr[1]);
		}
	
		$domain = 'messages';
	
		putenv('LANG='.$language); 
		setlocale(LC_ALL, $language.'.UTF-8', $language, 'en');  // first we try UTF-8, if not, normal language code
		
		// set text domain
		bindtextdomain($domain, $directory); 
		bind_textdomain_codeset($domain, 'UTF-8');
		
		textdomain($domain);
	}
	
	// determines the user's preferred language, ref: http://www.php.net/manual/en/function.http-negotiate-language.php
	public static function GetPreferredLanguage($available_languages, $default_language) { 
    	
    	// if $http_accept_language was left out, read it from the HTTP-Header 
	    $http_accept_language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : ''; 
	    
	    print_r($http_accept_language.'<br>');

	    preg_match_all("/([[:alpha:]]{1,8})(-([[:alpha:]|-]{1,8}))?" . 
	                   "(\s*;\s*q\s*=\s*(1\.0{0,3}|0\.\d{0,3}))?\s*(,|$)/i", 
	                   $http_accept_language, $hits, PREG_SET_ORDER); 
	
	    // default language as set by site
	    $bestlang = $default_language; 
	    $bestqval = 0; 
	
	    foreach ($hits as $arr) { 
	        // read data from the array of this hit 
	        $langprefix = strtolower ($arr[1]); 
	        if (!empty($arr[3])) { 
	            $langrange = strtolower ($arr[3]); 
	            $language = $langprefix . "-" . $langrange; 
	        } 
	        else $language = $langprefix; 
	        $qvalue = 1.0; 
	        if (!empty($arr[5])) $qvalue = floatval($arr[5]); 
	      
	        // find q-maximal language  
	        if (in_array($language,$available_languages) && ($qvalue > $bestqval)) { 
	            $bestlang = $language; 
	            $bestqval = $qvalue; 
	        } 
	        // if no direct hit, try the prefix only but decrease q-value by 10% (as http_negotiate_language does) 
	        else if (in_array($langprefix,$available_languages) && (($qvalue*0.9) > $bestqval)) { 
	            $bestlang = $langprefix; 
	            $bestqval = $qvalue*0.9; 
	        } 
	    } 
	    
		// returns the bestlang
	    return $bestlang;   
	} 
	
	// determines the user's preferred language,
	public static function GetSupportedLanguages($rootPrefix){
		
		$directories = glob($rootPrefix.'locale/*' , GLOB_ONLYDIR);
		$languages = array();
		
		if(is_array($directories)){
		
			foreach ($directories as &$value) {
			    $language = str_replace($rootPrefix.'locale/', '', $value);
			    $language = str_replace('_', '-', $language);
			    $language = strtolower($language);
			    
			    array_push($languages, $language);
			}
		}
		
		return $languages;
	}
	
}

?>