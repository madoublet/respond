<?php 

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /app/setup
 */
class AppSetupResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
	    
	    $setup = array(
		    'debug' => DEBUG,
		    'url' => APP_URL,
		    'api' => API_URL,
		    'sites' => SITES_URL,
		    'site' => SITE_URL,
		    'terms' => TERMS_URL,
		    'themeId' => DEFAULT_THEME,
		    'logo' => BRAND_LOGO,
		    'icon' => BRAND_ICON,
		    'brand' => BRAND,
		    'language' => DEFAULT_LANGUAGE,
		    'stripePubKey' => STRIPE_PUBLISHABLE_KEY,
		    'paypalEmail' => PAYPAL_EMAIL,
		    'passcode' => PASSCODE,
		    'app' => BRAND,
		    'version' => VERSION,
		    'copy' => COPY,
		    'pricingLink' => PRICING_URL
	    );
	 
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'application/json';
        $response->body = json_encode($setup);

        return $response;
    }
    
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /app/validate/passcode
 */
class AppValidatePasscode extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
    	parse_str($this->request->data, $request); // parse request

        $new_passcode = $request['passcode'];
    
	    // set passcode
	    if($new_passcode == PASSCODE){
	    	return new Tonic\Response(Tonic\Response::OK);
        }
        else{
	        return new Tonic\Response(Tonic\Response::BADREQUEST);
        }
        
    }
    
}


/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /app/install
 */
class AppInstallResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
    	/* WIP
    	// location of SCHEMA file
    	$sql_file = APP_LOCATION.'schema.sql';
    
		// PDO
		$pdo = new PDO("mysql:host=$host;", $dbuser, $dbpass);
        $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // create a database
        $pdo->query('CREATE DATABASE '.$dbname);  
        $pdo->query('use '.$dbname);
        
        // load schema
        $sql = file_get_contents($sql_file);
        $pdo->exec($sql);
    
		// return OK
        $response = new Tonic\Response(Tonic\Response::OK);
        
        return $response;
		*/
 
    }
    
}

?>