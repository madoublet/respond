<?php
	function detectedAppURL() {
	// Scheme detection behind reverse proxy with forwarded headers
	if ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') $_SERVER['HTTPS'] = 'on';
    	
    	$url = sprintf(
		    "%s://%s%s",
		    isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
		    $_SERVER['SERVER_NAME'],
		    $_SERVER['SERVER_PORT'] == 80 ? '' : ':'.$_SERVER['SERVER_PORT']
		);
		return $url;
	}
?>
