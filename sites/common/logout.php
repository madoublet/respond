<?php
	
	if(!isset($_SESSION)){
		session_start();
	}
	
	$logoutUrl = 'index';

	$_SESSION = array();
	
	if (ini_get("session.use_cookies")) {
    	$params = session_get_cookie_params();
    	setcookie(session_name(), '', time() - 42000,
        	$params["path"], $params["domain"],
        	$params["secure"], $params["httponly"]
    	);
	}

	// destroy the session
	session_destroy();
	
	// transfer to the login page
	header('location:'.$logoutUrl);

?>