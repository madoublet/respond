<?php
	function detectedAppURL() {
    	$url = sprintf(
		    "%s://%s%s",
		    isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
		    $_SERVER['SERVER_NAME'],
		    $_SERVER['SERVER_PORT'] == 80 ? '' : ':'.$_SERVER['SERVER_PORT']
		);
		return $url;
	}
?>