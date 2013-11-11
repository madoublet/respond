<?php 

	include '../app.php';

	require_once 'lib/Tonic/Autoloader.php';
	require_once 'lib/oath.php';
	require_once 'page.php';
	require_once 'pageType.php';
	require_once 'plugin.php';
	require_once 'template.php';
	require_once 'menuItem.php';
	require_once 'menuType.php';
    require_once 'user.php';
    require_once 'site.php';
    require_once 'file.php';
    require_once 'form.php';
    require_once 'stylesheet.php';
    require_once 'script.php';
    require_once 'layout.php';
    require_once 'plan.php';
    require_once 'card.php';
    require_once 'customer.php';
    
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
    
    // ref: http://stackoverflow.com/questions/8719276/cors-with-php-headers
    $cors = unserialize(CORS);
    
    if(in_array($request->origin, $cors)){
        $response->accessControlAllowCredentials = true;
        $response->accessControlAllowOrigin = $request->origin;
    }
    
	$response->output();

?>