<?php 

	define('SITE_ID', '{{siteId}}');
	define('SITE_UNIQ_ID', '{{siteUniqId}}');
	define('SITE_FRIENDLY_ID', '{{siteFriendlyId}}');

	include '../../../app.php';

	require_once '../../../api/lib/Tonic/Autoloader.php';
	require_once '../libs/SiteAuthUser.php';
	require_once '../libs/IpnListener.php';
	require_once 'site.php';
	require_once 'page.php';
	require_once 'user.php';
	require_once 'form.php';
	require_once 'checkCaptcha.php';
	require_once 'transaction.php';
	require_once 'menu.php';
        
    // set REQUEST_URI as the default $uri
    $uri = $_SERVER['REQUEST_URI'];
    
    // grab everything after API (should fix subdirectory issue)
    $parts = explode('/api', $uri);
	$uri = $parts[1];
    
	// handle request
	$app = new Tonic\Application();
	$request = new Tonic\Request(
			array(
				'uri' => $uri
			));

	$resource = $app->getResource($request);
	$response = $resource->exec();
	
	// open up API
	$response->accessControlAllowCredentials = true;
    $response->accessControlAllowOrigin = $request->origin;
	
	$response->output();

?>