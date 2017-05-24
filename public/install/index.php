<!DOCTYPE html>
<html ng-app="respond" dir="{{direction}}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title ng-bind="title"></title>

	<!-- libs css (external) -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


	<style>
		body {
			max-width: 700px;
			margin: 50px auto;
		}

    body a {
      color: #00ADE3;
    }

		body h1, body h2, body h3, body p {
			font-family: 'Open Sans', 'sans-serif';
			position: relative;
		}

		body h1 {
			font-size: 25px;
  		margin: 0 0 20px 0;
  		padding: 0;
		}

		body h3 {
			font-size: 15px;
			text-transform: uppercase;
  		margin: 20px 0;
  		padding: 0;
		}

		body p {
      font-size: 15px;
  		margin: 0;
  		padding: 0 0 20px 0;
		}

		body i {
  		position: absolute;
  		top: 10px;
  		left: 0;
			font-size: 20px;
			margin: 0 10px 0 0;
			padding: 0;
		}

		body p.success i {
			color: green;
		}

		body p.fail i {
			color: red;
		}

		body p.success, body p.fail {
  		padding: 15px 0 15px 40px;
  		border-bottom: 1px solid #ddd;
		}

		body p.noline {
  		border-bottom: none;
		}

		body p.slow-fail i {
			color: #ccc;
		}

		body small {
			font-size: 13px;
			display: block;
			color: #777;
			margin-top: 5px;
		}

		body .support {
      background-color: rgba(184,223,134,0.15);
      border-radius: 0;
      border: 1px solid #ddd;
      margin-bottom: 25px;
      color: #555;
      padding: 20px;
      margin: 25px 20px 25px 0;
  }

	</style>

  </head>

  <body>

  <h1>Respond Installation Tests</h1>

  <p class="welcome">
  	We have put together a set of tests to see if your Respond installation was successful. The checks are broken down into requirements and security.  Respond should run if you have all green checks in the requirements section.  The security checks are put in place to give you a quick overview of what you need to do to secure your Respond installation.
  </p>

  <h3>Requirements</h3>

<?php

    // autoload
    require '../../vendor/autoload.php';

    // steup
    $hasDotEnv = false;
    $dotEnvLocation = '../../.env';
    $url = siteURL().'api/sites/test';
    $hasUniqueAppKey = false;
    $hasUniqueSMTPEncKey = false;
    $hasUniqueJWTKey = false;
    $hasUniquePasscode = false;
    $hasRecaptcha = false;

    // make sure .env exists
    if (file_exists('../../.env')) {
      $hasDotEnv = true;

      try {
        $dotenv = new Dotenv\Dotenv('../../');
        $dotenv->load();

        // check for updated app key
        if (getenv('APP_KEY') != 'SomeRandomKey!!!') {
          $hasUniqueAppKey = true;
        }

        // check for updated smtp key
        if (getenv('SMTPENC_KEY') != 'iloverespond') {
          $hasUniqueSMTPEncKey = true;
        }

        // check for updated jwt key
        if (getenv('JWT_KEY') != 'iloverespond') {
          $hasUniqueJWTKey = true;
        }

        // check for updated passcode
        if (getenv('JWT_KEY') != 'PASSCODE') {
          $hasUniquePasscode = true;
        }

        // check for reCAPTCHA
        if (getenv('RECAPTCHA_SITE_KEY') !== false && getenv('RECAPTCHA_SECRET_KEY') !== false) {
          if (getenv('RECAPTCHA_SITE_KEY') != '' && getenv('RECAPTCHA_SECRET_KEY') != '') {
            $hasRecaptcha = true;
          }
        }


      }
      catch (Exception $e) {
        print 'Caught exception: '.$e->getMessage();
      }
    }

    function siteURL() {
      $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
      $domainName = $_SERVER['HTTP_HOST'].'/';
      return $protocol.$domainName;
    }

    function isHttps() {
      $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https" : "http";

      if ($protocol == 'https') {
        return true;
      }
      else {
        return false;
      }

    }

    // check PHP version
    if (strnatcmp(phpversion(),'5.4.0') >= 0) {
  	  echo '<p class="success"><i class="material-icons">check</i> PHP version is greater than 5.4</p>';
  	}
  	else
  	{
  	  echo '<p class="fail"><i class="material-icons">close</i> PHP version is less than 5.4 <small>Respond requires version 5.4 or greater. Upgrade your version of PHP and try to install Respond again.  If you are unsure about how to do this, reach out to your hosting provider.</small></p>';
  	}

    // check if sites directory is writeable
    if ($hasDotEnv == true) {
        print '<p class="success"><i class="material-icons">check</i> Environment (.env) file created</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> Environment (.env) file not created <small>Make sure you copy the .env.example file to .env</small></p>';
    }


    // check if sites directory is writeable
    if (is_writable('../../public/sites')) {
        print '<p class="success"><i class="material-icons">check</i> Sites directory is writeable</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> Sites directory is NOT writeable <small>Respond requires the sites directory to be writeable to create and update sites.  You can do this by assigning the Apache process as the owner of the directory or by enabling write permissions on the directory.</small></p>';
    }

    // check if resources directory is writeable
    if (is_writable('../../resources/sites')) {
        print '<p class="success"><i class="material-icons">check</i> Resources directory is writeable</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> Resources directory is NOT writeable <small>Respond requires the resources directory to be writeable to create and update sites.  You can do this by assigning the Apache process as the owner of the directory or by enabling write permissions on the directory.</small></p>';
    }

    // check if storage directory is writeable
    if (is_writable('../../storage')) {
        print '<p class="success"><i class="material-icons">check</i> Storage directory is writeable</p>';
    }
    else{
        print '<p class="slow-fail"><i class="material-icons">close</i> The storage directory is NOT writeable <small>This is not required, but it does enable Lumen to provide you with better error messaging when something fails.</small></p>';
    }

    if (extension_loaded('gd') && function_exists('gd_info')) {
        print '<p class="success"><i class="material-icons">check</i> GD library is installed</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> GD library is NOT installed <small>Respond requires the GD library to adjust image sizes and create thumbnails. Talk to your hosting provider about installing this PHP extension.</small></p>';
    }

    if (function_exists('curl_version')) {
        print '<p class="success"><i class="material-icons">check</i> CURL is installed and enabled</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> CURL is NOT installed and enabled <small>CURL is not specifically required by Respond. But the following API check will fail if it is not installed.</small></p>';
    }

    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($handle, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");

    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);

    /* Check for 200*/
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);
    if($httpCode == 200 && strpos($response, 'error') == FALSE) {
        print '<p class="success noline"><i class="material-icons">check</i> Connection to API succeeded</p>';
    }
    else{
        print '<p class="fail noline"><i class="material-icons">close</i> Connection to API failed <small>This typically happens because MOD_REWRITE is not enabled or if you tried to install Respond in a subdirectory.  Try going to the <a href="'.$url.'">'.$url.'</a> URL directly.  If you get a 500 error, something is wrong on your server.  You will need to check the logs.  A 404 error indicates that MOD_REWRITE is not enabled.</small></p>';
    }

	?>

	<h3>Security</h3>

	<?php
  	if (isHttps()==true) {
        print '<p class="success"><i class="material-icons">check</i> SSL is enabled</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> SSL is not enabled<small>SSL secures the communication between the Respond Angular 2 app and the server. Without SSL enabled, the data submitted in your app is not encrypted. You can now use <a href="https://certbot.eff.org/">Certbot</a> to do this for free.</small></p>';
    }

    if ($hasUniqueAppKey==true) {
        print '<p class="success"><i class="material-icons">check</i> App Key has been updated</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> App Key has not been updated<small>Update the APP_KEY in the .env file to be unique to your application.</small></p>';
    }

    if ($hasUniqueSMTPEncKey==true) {
        print '<p class="success"><i class="material-icons">check</i> SMTP Encryption Key has been updated</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> SMTP Encryption Key has not been updated<small>Update the SMTPENC_KEY in the .env file to be unique to your application.</small></p>';
    }

    if ($hasUniqueJWTKey==true) {
        print '<p class="success"><i class="material-icons">check</i> JWT Encryption Key has been updated</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> JWT Encryption Key has not been updated<small>Update the JWT_KEY in the .env file to be unique to your application.</small></p>';
    }

    if ($hasUniquePasscode==true) {
        print '<p class="success"><i class="material-icons">check</i> Passcode has been updated</p>';
    }
    else{
        print '<p class="fail"><i class="material-icons">close</i> Passcode has not been updated<small>Update the PASSCODE in the .env file to be unique to your application.</small></p>';
    }

    if ($hasRecaptcha==true) {
        print '<p class="success noline"><i class="material-icons">check</i> reCAPTCHA has been setup</p>';
    }
    else{
        print '<p class="fail noline"><i class="material-icons">close</i> reCAPTCHA has not been setup<small>Update (or add) the RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY in the .env file to setup reCAPTCHA.</small></p>';
    }

    // $hasRecaptcha

	?>

	<p class="support"><b>Did you find this tool helpful?</b> Help us reach our goal on <a href="https://patreon.com/respond">Patreon</a> and you can ensure a stream of updates and helpful tools for Respond.</p>

	</body>

</html>