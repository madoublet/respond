<!DOCTYPE html>
<html ng-app="respond" dir="{{direction}}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title ng-bind="title"></title>

	<!-- libs css (external) -->
	<link type="text/css" href="//fonts.googleapis.com/css?family=Roboto:700,300,100|Inconsolata" rel="stylesheet">
	<link type="text/css" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
	
	<!-- libs css (combined) -->
	<link type="text/css" href="../css/respond.libs.min.css" rel="stylesheet">
	
	<style>
		body.test{
			width: 500px;
			margin: 50px auto;
		}
		
		body.test h1{
			margin-bottom: 25px;
		}
		
		body.test i{
			font-size: 20px;
			margin-right: 10px;
		}
		
		body.test i.fa-check-circle{
			color: green;
		}
		
		body.test i.fa-minus-circle{
			color: red;
		}
		
		body.test p{
			font-size: 15px;
			padding: 25px 0 15px 0;
			border-top: 1px solid #f0f0f0;
		}
		
		body.test small{
			font-size: 13px;
			text-transform: uppercase;
			display: block;
			color: #777;
			margin-top: 5px;
		}
		
		body.test p.welcome{
			color: #777;
		}
	</style>
	
  </head>
  
  <body class="test">
  
  <h1>Respond Installation Tests</h1>
  
  <p class="welcome">
  	We have put together a set of tests to see if your Respond installation was successful. If you have all green checkmarks below, you should be ready to go.
  </p>
  

<?php

	// include setup
    if(file_exists('../setup.local.php')){
    	include '../setup.local.php';
    }
    else{
    	include '../setup.php';
    }
    
    // check PHP version
    if (strnatcmp(phpversion(),'5.4.0') >= 0)
	{
	  echo '<p><i class="fa fa-check-circle"></i> PHP version is greater than 5.4</p>';
	}
	else
	{
	  echo '<p><i class="fa fa-minus-circle"></i> PHP version is less than 5.4 <small>Respond requires version 5.4 or greater. Upgrade your version of PHP and try to install Respond again.  If you are unsure about how to do this, reach out to your hosting provider.</small></p>';
	}
	
	// check PDO
	if (class_exists('PDO')){
        print '<p><i class="fa fa-check-circle"></i> PDO Enabled</p>';
    }
    else{
        print '<p><i class="fa fa-minus-circle"></i> PDO Disabled <small>Respond uses PDO to establish a secure connection to your Database.  Talk to your hosting provider about installing this PHP extension.</small></p>';
    }
    
    // check if sites directory is writeable
    if (is_writable('../sites')){
        print '<p><i class="fa fa-check-circle"></i> Sites directory is writeable</p>';
    }
    else{
        print '<p><i class="fa fa-minus-circle"></i> Sites directory is NOT writeable <small>Respond requires the sites directory to be writeable to create and update sites.  You can do this by assigning the Apache process as the owner of the directory or by enabling write permissions on the directory.</small></p>';
    }
    
    if (extension_loaded('gd') && function_exists('gd_info')) {
        print '<p><i class="fa fa-check-circle"></i> GD library is installed</p>';
    }
    else{
        print '<p><i class="fa fa-minus-circle"></i> GD library is NOT installed <small>Respond requires the GD library to adjust image sizes and create thumbnails. Talk to your hosting provider about installing this PHP extension.</small></p>';
    }
    
    if (APP_URL != 'http://app.myrespond.com') {
        print '<p><i class="fa fa-check-circle"></i> APP_URL has been updated</p>';
    }
    else{
        print '<p><i class="fa fa-minus-circle"></i> APP_URL has NOT been updated</p>';
    }
    
    if (function_exists('curl_version')) {
        print '<p><i class="fa fa-check-circle"></i> CURL is installed and enabled</p>';
    }
    else{
        print '<p><i class="fa fa-minus-circle"></i> CURL is NOT installed and enabled <small>CURL is not specifically required by Respond. But the following API check will fail if it is not installed.</small></p>';
    }
    
    
    
    $url =  APP_URL.'/api/site/test';
    
    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($handle, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");
    
    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);
    
    /* Check for 200*/
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);
    if($httpCode == 200 && strpos($response, 'error') == FALSE) {
        print '<p><i class="fa fa-check-circle"></i> Connection to API succeeded</p>';
    }
    else{
        print '<p><i class="fa fa-minus-circle"></i> Connection to API failed <small>This typically happens because MOD_REWRITE is not enabled.  Try going to the <a href="'.APP_URL.'/api/site/test">'.APP_URL.'/api/site/test</a> URL directly.  If you get a 500 error, something is wrong on your server.  You will need to check the logs.  A 404 error indicates that MOD_REWRITE is not enabled.</small></p>';
    }
    
	// check database connection
	try{
	   	$host = DB_HOST;
    	$dbname = DB_NAME;
		$dbuser = DB_USER;
		$dbpass = DB_PASSWORD;
        
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $dbpass);
        
        echo '<p><i class="fa fa-check-circle"></i> Database Connection looks good</p>';
	}
	catch(PDOException $ex){
        echo '<p><i class="fa fa-minus-circle"></i> Unable to connect to the database</p> <small>Something went wrong.  Here are the error details:<br>'.$ex.'</small>';
	}
	
	?>

	</body>
  
</html>