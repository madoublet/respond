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
 * @uri /site/switch
 */
class SiteSwitchResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

        $siteUniqId = $request['siteUniqId'];
        
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            if($authUser->IsSuperAdmin == 1){  // and is the super-admin
            
                $site = Site::GetBySiteUniqId($siteUniqId);
        
                $_SESSION['SiteId'] = $site['SiteId'];
                $_SESSION['SiteUniqId'] = $site['SiteUniqId'];
                $_SESSION['SiteFriendlyId'] = $site['FriendlyId'];
        		$_SESSION['LogoUrl'] = $site['LogoUrl'];
        		$_SESSION['SiteName'] = $site['Name'];
        		$_SESSION['FileUrl'] = 'sites/'.$site['FriendlyId'].'/files/';
        		$_SESSION['TimeZone'] = $site['TimeZone'];
                
                return new Tonic\Response(Tonic\Response::OK);
                
            }
            else{
                // return an unauthorized exception (401)
                return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
        
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

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
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/change/language
 */
class SiteChangeLanguageResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

		session_start();

        $friendlyId = $request['friendlyId'];
        $language = $request['language'];
        
        $_SESSION[$friendlyId.'.Language'] = $language;
        
        
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/html';
        $response->body = $friendlyId.'.Language='.$language;

        return $response;
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

        $friendlyId = $request['friendlyId'];
        $name = $request['name'];
        $s_passcode = $request['passcode'];
        $timeZone = $request['timeZone'];
        $email = '';
        $password = '';
        $language = 'en-us'; // language for the app
        $userId = -1;
        
        // set language if set
        if(isset($request['language'])){
	        $language = $request['language'];
        }
        
        // check for email and password
        if(isset($request['email'])){
        	
        	$userLanguage = 'en-us';
        
       		if(isset($request['userLanguage'])){
		        $userLanguage = $request['userLanguage'];
	        }
	        
	        $email = $request['email'];
	        $password = $request['password'];
        }
        else{
			// get an authuser
			$authUser = new AuthUser();
			
			if($authUser->UserUniqId && $authUser->IsSuperAdmin==true){ // check if authorized
				$userId = $authUser->UserId;
			}
			else{
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
        }
        
        // defaults
        $firstName = 'New';
        $lastName = 'User';
        $domain = APP_URL.'/sites/'.$friendlyId;
    	$domain = str_replace('http://', '', $domain);
		$logoUrl = 'sample-logo.png';
		
        if($s_passcode == PASSCODE){
           
           	// check for uniqueness of email 
            if($email != ''){
	            $isUserUnique = User::IsLoginUnique($email);
	            
	            if($isUserUnique==false){
	            
	                return new Tonic\Response(Tonic\Response::CONFLICT);
	            }
            }
            
            $isFriendlyIdUnique = Site::IsFriendlyIdUnique($friendlyId);
	            
            if($isFriendlyIdUnique==false){
                return new Tonic\Response(Tonic\Response::CONFLICT);
            }
            
            // add the site
    	    $site = Site::Add($domain, $name, $friendlyId, $logoUrl, DEFAULT_THEME, $email, $timeZone, $language); // add the site
            
            // add the admin
            if($email != ''){
            	$isActive = 1; // admins by default are active
            
            	$user = User::Add($email, $password, $firstName, $lastName, 'Admin', $userLanguage, $isActive, $site['SiteId']);
            	$userId = $user['UserId'];
            }
            
            // set the stripe plan, customer id, status
            if(DEFAULT_STRIPE_PLAN != ''){
            
            	Stripe::setApiKey(STRIPE_API_KEY);
	            
	            $customer = Stripe_Customer::create(
	            	array(
						"plan" => DEFAULT_STRIPE_PLAN,
						"email" => $email)
	            );
	            
	            $customerId = $customer->id;
	            
	            Site::EditCustomer($site['SiteUniqId'], $customerId);
            }
            
            // create the home page
        	$description = '';
    		$content = '';
    		$filename = '../themes/'.DEFAULT_THEME.'/pages/home.html';
    		$layout = 'home';
    		$stylesheet = 'home';
    		
    		if(file_exists($filename)){
    			$content = file_get_contents($filename);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['FriendlyId'], $content);
    		}
    		
            $homePage = Page::Add('index', 'Home', $description, $layout, $stylesheet, -1, $site['SiteId'], $userId);
            Page::SetIsActive($homePage['PageUniqId'], 1);
            
    		Publish::PublishFragment($site['FriendlyId'], $homePage['PageUniqId'], 'publish', $content);
    		
    		// create the about page
    		$content = '';
    		$filename = '../themes/'.DEFAULT_THEME.'/pages/about.html';
    		$layout = 'content';
    		$stylesheet = 'content';
    		
    		// add the general page type and create a list
    		$pageType = PageType::Add('page', 'Page', 'Pages', $layout, $stylesheet, 0, $site['SiteId'], $userId, $userId);
    				
    		if(file_exists($filename)){
    			$content = file_get_contents($filename);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['FriendlyId'], $content);
    		}
            
    		$aboutUs = Page::Add('about', 'About', $description, $layout, $stylesheet, $pageType['PageTypeId'], $site['SiteId'], $userId);
            Page::SetIsActive($aboutUs['PageUniqId'], 1);
    		
    		Publish::PublishFragment($site['FriendlyId'], $aboutUs['PageUniqId'], 'publish', $content);
    			
    		// create the contact us page
    		$content = '';
    		$filename = '../themes/'.DEFAULT_THEME.'/pages/contact.html';
    		$layout = 'content';
    		$stylesheet = 'content';
    				
    		if(file_exists($filename)){
    			$content = file_get_contents($filename);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['FriendlyId'], $content);
    		}
    		
            $contactUs = Page::Add('contact', 'Contact', $description, $layout, $stylesheet, $pageType['PageTypeId'], $site['SiteId'], $userId);
            Page::SetIsActive($contactUs['PageUniqId'], 1);
        
    		Publish::PublishFragment($site['FriendlyId'], $contactUs['PageUniqId'], 'publish', $content);
    			
    		// create the error page
    		$content = '';
    		$filename = '../themes/'.DEFAULT_THEME.'/pages/error.html';
    		$layout = 'content';
    		$stylesheet = 'content';
    				
    		if(file_exists($filename)){
    			$content = file_get_contents($filename);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['FriendlyId'], $content);
    		}
    		
            $pageNotFound = Page::Add('error', 'Page Not Found', $description, $layout, $stylesheet, $pageType['PageTypeId'], $site['SiteId'], $userId);
            Page::SetIsActive($pageNotFound['PageUniqId'], 1);
            
    		Publish::PublishFragment($site['FriendlyId'], $pageNotFound['PageUniqId'], 'publish', $content);

    		// create a sample blog post
    		$content = '';
    		$filename = '../themes/'.DEFAULT_THEME.'/pages/post.html';
    		$layout = 'post';
    		$stylesheet = 'content';
    		
    		// add the post page type
    		$postPageType = PageType::Add('post', 'Post', 'Posts', $layout, $stylesheet, 0, $site['SiteId'], $userId, $userId);
    		
    				
    		if(file_exists($filename)){
    			$content = file_get_contents($filename);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['FriendlyId'], $content);
    		}
            
    		$samplePost = Page::Add('sample-blog-post', 'Sample Blog Post', $description, $layout, $stylesheet, $postPageType['PageTypeId'], $site['SiteId'], $userId);
    		Page::EditLayout($samplePost['PageUniqId'], 'post', $userId);
            Page::SetIsActive($samplePost['PageUniqId'], 1);
    		
    		Publish::PublishFragment($site['FriendlyId'], $samplePost['PageUniqId'], 'publish', $content);
    		
    		// create a sample blog list page
    		$content = '';
    		$filename = '../themes/'.DEFAULT_THEME.'/pages/blog.html';
    		$layout = 'post';
    		$stylesheet = 'content';
    				
    		if(file_exists($filename)){
    			$content = file_get_contents($filename);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['FriendlyId'], $content);
    		}
            
    		$blog = Page::Add('blog', 'Blog', $description, $layout, $stylesheet, -1, $site['SiteId'], $userId);
    		Page::EditLayout($blog['PageUniqId'], 'blog', $userId);
    		Page::SetIsActive($blog['PageUniqId'], 1);
    		
    		Publish::PublishFragment($site['FriendlyId'], $blog['PageUniqId'], 'publish', $content);
    		
    		// create the menu
    		MenuItem::Add('Home', '', 'primary', 'index', $homePage['PageId'], 0, $site['SiteId'], $userId, $userId);
            MenuItem::Add('Blog', '', 'primary', 'blog', $blog['PageId'], 2, $site['SiteId'], $userId, $userId);
            MenuItem::Add('About', '', 'primary', 'page/about', $aboutUs['PageId'], 2, $site['SiteId'], $userId, $userId);
    		MenuItem::Add('Contact', '', 'primary', 'page/contact', $contactUs['PageId'], 3, $site['SiteId'], $userId, $userId);
    		
    		// publishes a theme for a site
    		Publish::PublishTheme($site, DEFAULT_THEME);
    		
    		// publish the site
    		Publish::PublishSite($site['SiteUniqId']);
    		
    		// send welcome email
    		if(SEND_WELCOME_EMAIL == true && $email != ''){
    		
	    		$to = $email;
	    		$from = REPLY_TO;
	    		$subject = BRAND.': Welcome to '.BRAND;
	    		$file = 'emails/new-user.html';
	    		
	    		// create strings to replace
	    		$loginUrl = APP_URL;
	    		$newSiteUrl = APP_URL.'/sites/'.$site['FriendlyId'];
	    		
	    		$replace = array(
	    			'{{brand}}' => BRAND,
	    			'{{reply-to}}' => REPLY_TO,
	    			'{{new-site-url}}' => $newSiteUrl,
	    			'{{login-url}}' => $loginUrl
	    		);
	    		
	    		// send email from file
	    		Utilities::SendEmailFromFile($to, $from, $subject, $replace, $file);
	    	}
            
            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        
    }
}

/**
 * A protected API call to retrieve the current site
 * @uri /site/current
 */
class SiteCurrentResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $site = Site::GetBySiteUniqId($authUser->SiteUniqId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
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
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            Publish::PublishSite($authUser->SiteUniqId);

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
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			if($authUser->IsSuperAdmin == 1){
	            parse_str($this->request->data, $request); // parse request
	
	            $siteUniqId = $request['siteUniqId'];
	            
	            $site = Site::GetBySiteUniqId($siteUniqId);
	            
	            $directory = '../sites/'.$site['FriendlyId'];
	            
	            // Get the directory name
				$oldname = '../sites/'.$site['FriendlyId'];
				
				// Replace any special chars with your choice
				$newname = '../sites/'.$site['FriendlyId'].'-removed';
				
				if(file_exists($oldname)){
					// Renames the directory
					rename($oldname, $newname);
				}
	
				// remove site from DB
				Site::Remove($siteUniqId);
	
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
 * @uri /site/verification/generate
 */
class SiteVerificationGenerateResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function generate() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $content = $request['content'];
		
		    $site = Site::GetBySiteId($authUser->SiteId);
		
		    $dir = '../sites/'.$site['FriendlyId'].'/';
		
		    Utilities::SaveContent($dir, $name, $content);
            
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/{siteUniqId}
 */
class SiteResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($siteUniqId) {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $site = Site::GetBySiteUniqId($siteUniqId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($site);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

    /**
     * @method POST
     */
    function update($siteUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $domain = $request['domain'];
            $name = $request['name'];
            $analyticsId = $request['analyticsId'];
            $facebookAppId = $request['facebookAppId'];
            $primaryEmail = $request['primaryEmail'];
            $timeZone = $request['timeZone'];
            $language = $request['language'];
            $currency = $request['currency'];
            $weightUnit = $request['weightUnit'];
            $shippingCalculation = $request['shippingCalculation'];
            $shippingRate = $request['shippingRate'];
            $shippingTiers = $request['shippingTiers'];
            $taxRate = $request['taxRate'];
            $payPalId = $request['payPalId'];
            $payPalUseSandbox = $request['payPalUseSandbox'];

            Site::Edit($siteUniqId, $domain, $name, $analyticsId, $facebookAppId, $primaryEmail, $timeZone, $language, $currency, $weightUnit, $shippingCalculation, $shippingRate, $shippingTiers, $taxRate, $payPalId, $payPalUseSandbox);

            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * A protected API call to view, edit, and delete a site
 * @uri /site/logo/{siteUniqId}
 */
class SiteLogoResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update($siteUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $logoUrl = $request['logoUrl'];

            Site::EditLogo($siteUniqId, $logoUrl);

            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/list/all
 */
class SiteListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            // get sites
            $list = Site::GetSites();

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($list);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/list/extended
 */
class SiteListExtendedResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            // get sites
            $list = Site::GetSites();
            
            Stripe::setApiKey(STRIPE_API_KEY);
            
            // init
            $status = '';
			$plan = '';
			$planName = '';
			$renewalReadable = '';
			$customerId = '';
			
			$sites = array();
            
            foreach($list as $site){ // iterate files
            
            	if($site['CustomerId'] != null && $site['CustomerId'] != ''){
            	
            		$customerId = $site['CustomerId'];
	            	
	            	// get customer
					$customer = Stripe_Customer::retrieve($site['CustomerId']);
					
					if($customer->subscription){					
						$status = $customer->subscription->status;
						$plan = $customer->subscription->plan->id;
						$planName  = $customer->subscription->plan->name;
						
						
						$local = new DateTimeZone($site['TimeZone']);
						
						$date = new DateTime();
						$date->setTimestamp($customer->subscription->current_period_end);
						$date->setTimezone($local);
						
						$renewalReadable = $date->format('D, M d y h:i:s a');
											}
					else{
						$status = 'unsubscribed';
						$plan = '';
						$planName = 'N/A';
						$renewalReadable = 'N/A';
					}
	            	
            	}	
				else{
					$customerId = $site['CustomerId'];
					$status = 'N/A';
					$plan = '';
					$planName = '';
					$renewalReadable = '';
				}
            
				$new_site = array(
					'siteId' => $site['SiteId'],
					'siteUniqId' => $site['SiteUniqId'],
					'name' => $site['Name'],
					'domain' => $site['Domain'],
					'type' => $site['Type'],
					'status' => $status,
					'planId' => $plan,
					'planName' => $planName,
					'customerId' => $customerId,
					'renewalReadable' => $renewalReadable
				);
            	
            	array_push($sites, $new_site);
              
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($sites);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}


?>