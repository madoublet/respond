<?php 

    error_reporting(E_ALL);
    ini_set('display_errors', '1');

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
    
	// handle request
	$app = new Tonic\Application();
	$request = new Tonic\Request(
			array(
			'baseUri' => '/api'
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