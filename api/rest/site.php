<?php 

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/test
 */
class SiteTestResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/HTML';
        $response->body = 'API works!';

        return $response;
    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/validate/id
 */
class SiteValidateIdResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

        $friendlyId = $request['friendlyId'];
        
        $isFriendlyIdUnique = Site::IsFriendlyIdUnique($friendlyId);
        
        // check for reserved names
        if($friendlyId == 'app' || $friendlyId == 'sites' || $friendlyId == 'api'){
	        $isFriendlyIdUnique = false;
        }
	            
        if($isFriendlyIdUnique==false){
            return new Tonic\Response(Tonic\Response::CONFLICT);
        }
        else{
	        return new Tonic\Response(Tonic\Response::OK);
        }

    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/validate/email
 */
class SiteValidateEmailResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

        $email = $request['email'];
        
        $isUserUnique = User::IsLoginUnique($email);
	            
        if($isUserUnique==false){
        
            return new Tonic\Response(Tonic\Response::CONFLICT);
        }
        else{
	        return new Tonic\Response(Tonic\Response::OK);
        }

    }
}


/**
 * A protected API call to retrieve the current site
 * @uri /site/create
 */
class SiteCreateResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
        
        parse_str($this->request->data, $request); // parse request

        $friendlyId = trim($request['friendlyId']);
        $name = trim($request['name']);
        $s_passcode = $request['passcode'];
        $timeZone = $request['timeZone'];
        $email = '';
        $password = '';
        $language = DEFAULT_LANGUAGE; // language for the app
        $direction = DEFAULT_DIRECTION;
        $userId = -1;
        
        // get first name and lastname
        $firstName = $request['firstName'];
        $lastName = $request['lastName'];
        
        // validate name and friendlyId
        if($friendlyId == '' || $name == ''){
	        return new Tonic\Response(Tonic\Response::BADREQUEST);
        }
        
        $theme = DEFAULT_THEME;
        
        // set theme
        if(isset($request['theme'])){
	        $theme = $request['theme'];
        }
        
        // set language if set
        if(isset($request['language'])){
	        $language = $request['language'];
        }
        
        // set direction if set
        if(isset($request['direction'])){
	        $direction = $request['direction'];
        }
        
        // check for email and password
        if(isset($request['email'])){
        	
        	$userLanguage = 'en-us';
        
       		if(isset($request['userLanguage'])){
		        $userLanguage = $request['userLanguage'];
	        }
	        
	        $email = $request['email'];
	        $password = $request['password'];
	        
	        // valide email and password
	        if($email == '' || $password == ''){
		        return new Tonic\Response(Tonic\Response::BADREQUEST);
	        }
        }
        else{
			// get an authuser
			$authUser = new AuthUser();
			
			if($authUser->UserId && $authUser->IsSuperAdmin==true){ // check if authorized
				$userId = $authUser->UserId;
			}
			else{
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
        }
        
        // defaults
        $domain = SITE_URL;
    	
    	$domain = str_replace('{{friendlyId}}', $friendlyId, $domain);
    	
		$logoUrl = 'sample-logo.png';
		$altLogoUrl = '';
		
        if($s_passcode == PASSCODE){
           
            $isFriendlyIdUnique = Site::IsFriendlyIdUnique($friendlyId);
	            
	        // check for reserved names
	        if($friendlyId == 'app' || $friendlyId == 'sites' || $friendlyId == 'api' || $friendlyId == 'triangulate' || $friendlyId == 'developer'){
		        $isFriendlyIdUnique = false;
	        }    
	            
            if($isFriendlyIdUnique==false){
                return new Tonic\Response(Tonic\Response::CONFLICT);
            }
            
            // default is blank
            $welcomeEmail = '';
            $receiptEmail = '';
            
            // files for emails
            $welcome_file = APP_LOCATION.'/site/emails/welcome.html';
            $receipt_file = APP_LOCATION.'/site/emails/receipt.html';
            
            // make sure the welcome email exists
            if(file_exists($welcome_file)){
    			
    			// get default email file
    			$welcomeEmail = file_get_contents($welcome_file);
    			
    		}
    		
    		// make sure the receipt email exists
            if(file_exists($receipt_file)){
    			
    			// get default email file
    			$receiptEmail = file_get_contents($receipt_file);
    			
    		}
    		
            // add the site
    	    $site = Site::Add($domain, $name, $friendlyId, $logoUrl, $altLogoUrl, $theme, $email, $timeZone, $language, $direction, $welcomeEmail, $receiptEmail);
    	                
            // add the admin
            if($email != ''){
            	$isActive = 1; // admins by default are active
            
            	$user = User::Add($email, $password, $firstName, $lastName, 'Admin', $userLanguage, $isActive, $site['SiteId']);
            	$userId = $user['UserId'];
            }
           
            // set $siteId
            $siteId = $site['SiteId'];
                        
    		// publishes a theme for a site
    		Publish::PublishTheme($site, $theme);
    		
    		// publish default content for the theme
    		Publish::PublishDefaultContent($site, $theme, $user['UserId']);
    		
    		// publish the site
    		Publish::PublishSite($site['SiteId']);
    		
    		// create a locale directory
			$locales_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/locales';
			
			// create locales directory if it does not exist
			if(!file_exists($locales_dir)){
				mkdir($locales_dir, 0755, true);	
			}
			
			// set directory for locale
			$locale_dir = $locales_dir.'/'.$site['Language'].'/';
			
			// make the locale dir if it does not exist
			if(!file_exists($locale_dir)){
				mkdir($locale_dir, 0755, true);	
			}
			
			// set filename
			$filename = 'translation.json';
			
			if(!file_exists($locale_dir.$filename)){
				// create a blank translation file
				Utilities::SaveContent($locale_dir, $filename, '{}');
			}
    		
    		// send welcome email
    		if(SEND_WELCOME_EMAIL == true && $email != ''){
    		
	    		$to = $email;
	    		$from = EMAILS_FROM;
	    		$fromName = EMAILS_FROM_NAME;
	    		$subject = WELCOME_EMAIL_SUBJECT;
	    		$file = WELCOME_EMAIL_FILE;
	    		
	    		// create strings to replace
	    		$loginUrl = APP_URL.'/login/'.$site['FriendlyId'];
	    		$newSiteUrl = $domain;
	    		
	    		$replace = array(
	    			'{{brand-logo}}' => '<img src="'.BRAND_LOGO.'" style="max-height:50px">',
	    			'{{brand}}' => BRAND,
	    			'{{reply-to}}' => EMAILS_FROM,
	    			'{{new-site-url}}' => $newSiteUrl,
	    			'{{login-url}}' => $loginUrl
	    		);
	    		
	    		// send email from file
	    		Utilities::SendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);
	    		
	    	}
	    	
	    	// send new site hook
    		Webhooks::NewSite($site);
    		
    		// send new user hook
    		Webhooks::NewUser($user);
            
            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        
    }
}

/**
 * A protected API call to retrieve the current site
 * @uri /site/retrieve
 */
class SiteRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            $site = Site::GetBySiteId($token->SiteId);
            
            // set images URL
			$imagesURL = $site['Domain'];
			
			// set the ImagesURL
			$site['ImagesUrl'] = $imagesURL.'/';
            
            // determine offset for timezone
            $zone = new DateTimeZone($site['TimeZone']);
			$now = new DateTime("now", $zone);
			
			$offset = $zone->getOffset($now);
			$offset_hours = round(($offset)/3600); 
			
			// set offset for site
			$site['Offset'] = $offset_hours;

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($site);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to publish the site
 * @uri /site/publish
 */
class SitePublishResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            Publish::PublishSite($token->SiteId);

            $response = new Tonic\Response(Tonic\Response::OK);
       
            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/remove
 */
class SiteRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function remove() {

        // get an authuser
        $token = Utilities::ValidateJWTToken();

        if($token != NULL){  // check if authorized

			 // validate that the user can remove the site
	        $user = User::GetByUserId($token->UserId);
			
			if($user['SiteAdmin'] == 1){
	        
	            parse_str($this->request->data, $request); // parse request
	        
	            $siteId = $request['siteId'];
	            
	            $site = Site::GetBySiteId($siteId);
	            
	            $directory = SITES_LOCATION.'/'.$site['FriendlyId'];
	            
	            // Get the directory name
				$oldname = SITES_LOCATION.'/'.$site['FriendlyId'];
				
				// Set the directory to be removed
				$newname = SITES_LOCATION.'/removed-'.$site['FriendlyId'];
				
				if(file_exists($oldname)){
					// Renames the directory
					rename($oldname, $newname);
				}
				
				// remove site from DB
				Site::Remove($siteId);
	
	            return new Tonic\Response(Tonic\Response::OK);
            }
            else{ // unauthorized access
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
        
        } 
        else{ // unauthorized access
			return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}


/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/save
 */
class SiteSaveResource extends Tonic\Resource {


    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $domain = $request['domain'];
            $primaryEmail = $request['primaryEmail'];
            $timeZone = $request['timeZone'];
            $language = $request['language'];
            $direction = $request['direction'];
            
            $currency = $request['currency'];
            $showCart = $request['showCart'];
            
            $showSettings = $request['showSettings'];
            $showLanguages = $request['showLanguages'];
            $showLogin = $request['showLogin'];
            $showSearch = $request['showSearch'];
            
            $weightUnit = $request['weightUnit'];
            $shippingCalculation = $request['shippingCalculation'];
            $shippingRate = $request['shippingRate'];
            $shippingTiers = $request['shippingTiers'];
            $taxRate = $request['taxRate'];
            $payPalId = $request['payPalId'];
            $payPalUseSandbox = $request['payPalUseSandbox'];
            
            $welcomeEmail = $request['welcomeEmail']; 
            $receiptEmail = $request['receiptEmail'];
			$isSMTP = $request['isSMTP']; 
			$SMTPHost = $request['SMTPHost'];
			$SMTPAuth = $request['SMTPAuth'];
			$SMTPUsername = $request['SMTPUsername'];
			$SMTPPassword = $request['SMTPPassword']; 
			$SMTPSecure = $request['SMTPSecure'];
            
            $formPublicId = $request['formPublicId'];
            $formPrivateId = $request['formPrivateId'];
            
            $embeddedCodeHead = $request['embeddedCodeHead'];
            $embeddedCodeBottom = $request['embeddedCodeBottom'];
            
            $SMTPPasswordIV = '';
            
            // encyrpt password, #ref: http://stackoverflow.com/questions/10916284/how-to-encrypt-decrypt-data-in-php
            if($SMTPPassword != '' && $SMTPPassword != 'temppassword'){
	            
	            // encrypt password
				$key_size = mcrypt_get_key_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CFB);
				$encryption_key = SMTPENC_KEY;
				
				// create iv
				$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CFB);
				$iv = mcrypt_create_iv($iv_size, MCRYPT_DEV_URANDOM); // 16 bytes output
				
				// encrypt password
				$encrypted = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $encryption_key, $SMTPPassword, MCRYPT_MODE_CFB, $iv);
	            
	            // set password to encrypted password
	            $SMTPPasswordIV = base64_encode($iv);
	            $SMTPPassword = base64_encode($encrypted);
	            
	            // edit SMTP password
	            Site::EditSMTPPassword($token->SiteId, $SMTPPassword, $SMTPPasswordIV);
            }

			// edit site
            Site::Edit($token->SiteId, $name, $domain, $primaryEmail, $timeZone, $language, $direction, 
            	$showCart, $showSettings, $showLanguages, $showLogin, $showSearch,
            	$currency, $weightUnit, $shippingCalculation, $shippingRate, $shippingTiers, 
            	$taxRate, $payPalId, $payPalUseSandbox, 
            	$welcomeEmail, $receiptEmail,
				$isSMTP, $SMTPHost, $SMTPAuth, $SMTPUsername, $SMTPSecure,
            	$formPublicId, $formPrivateId, $embeddedCodeHead, $embeddedCodeBottom);
            
       
            Publish::PublishContent($token->SiteId);
            	
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/edit/admin
 */
class SiteEditAdminResource extends Tonic\Resource {


    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	$user = User::GetByUserId($token->UserId);
        	
        	if($user['SiteAdmin'] == 1){

	            parse_str($this->request->data, $request); // parse request
	
	            $siteId = $request['siteId'];
	            $domain = $request['domain'];
	            $status = $request['status'];
	            $fileLimit = $request['fileLimit'];
	            $userLimit = $request['userLimit'];
	            
	            // edit site
	            Site::EditAdmin($siteId, $domain, $status, $fileLimit, $userLimit);
	            
	            return new Tonic\Response(Tonic\Response::OK);
			
			} else{ // unauthorized access

            	return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/branding/image
 */
class SiteBrandingResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $url = $request['url'];
            $type = $request['type'];
            
            $site = Site::GetBySiteId($token->SiteId);

			if($type == 'logo'){
            	Site::EditLogo($token->SiteId, $url);
            }
            else if($type == 'alt'){
            	Site::EditAltLogo($token->SiteId, $url);
            }
            else if($type == 'paypal'){
            	Site::EditPayPalLogo($token->SiteId, $url);
            }
            else if($type == 'icon'){
	            Site::EditIcon($token->SiteId, $url);
	            
				$source = SITES_LOCATION.'/'.$site['FriendlyId'].'/files/'.$url;
				
	            // create the icon
	            $destination = SITES_LOCATION.'/'.$site['FriendlyId'].'/favicon.ico';
				
				$ico_lib = new PHP_ICO($source, array( array( 32, 32 ), array( 64, 64 ) ) );
				$ico_lib->save_ico( $destination );
				
            }
            
            // publish site content
            Publish::PublishContent($token->SiteId);

            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/branding/icon/background
 */
class SiteBrandingIconBackgroundResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $color = $request['color'];

			Site::EditIconBg($token->SiteId, $color);
			
			 // republish site
            Publish::PublishContent($token->SiteId);
                        
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * List all sites
 * @uri /site/list/all
 */
class SiteListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	$user = User::GetByUserId($token->UserId);
        	
        	if($user['SiteAdmin'] == 1){

	            // get sites
	            $list = Site::GetSites();
	
	            // return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($list);
	
	            return $response;
            }
            else{ // unauthorized access
	
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
	        }

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

/**
 * API call to pay for a subscription
 * @uri /site/subscription
 */
class SiteSubscriptionResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
    	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

        	// parse request
        	parse_str($this->request->data, $request);
        	
        	$site = Site::GetBySiteId($token->SiteId);

			$siteId = $site['siteId'];
			$status =  $site['status'];
			$plan = $request['plan'];
			$provider = $request['provider'];
			$subscriptionId = $request['subscriptionId'];
			$customerId = $request['customerId'];
			$userLimit = $request['userLimit'];
			$fileLimit = $request['fileLimit'];
			
			// subscribe to a plan
			Site::EditSubscription($siteId, $status, $plan, $provider, $subscriptionId, $customerId, $userLimit, $fileLimit);
			
            // return a json response
            return new Tonic\Response(Tonic\Response::OK); 
                
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}


?>