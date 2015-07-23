<?php
/**
 * A protected API call to login a user
 * @uri /user/login
 */
class UserLoginResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function login() {

        // parse request
        parse_str($this->request->data, $request);

        $email = $request['email'];
        $password = $request['password'];
        
        // get site
        $site = null;
        $first_login = false;
        
        if(isset($request['friendlyId'])){
	        
	         $friendlyId = $request['friendlyId'];
	         
	         // get site by its friendly id
			 $site = Site::GetByFriendlyId($friendlyId);
	        
        }
        else if(isset($request['siteId'])){
        
        	$siteId = $request['siteId'];
	         
	         // get site by its friendly id
			 $site = Site::GetBySiteId($siteId);
        
        }
        else{
	     
	     	// return an unauthorized exception (401)
            $response = new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			$response->body = 'Access denied';
			return $response;
	        
        }
        
        // set first_login if the last login is null
        if($site['LastLogin'] == NULL){
	        $first_login = true;
        }
       
        // get the user from the credentials
        $user = User::GetByEmailPassword($email, $site['SiteId'], $password);
        
        // determine if the user is authorized
        $is_auth = false;
        
        // permissions
        $canEdit = '';
        $canPublish = '';
        $canRemove = '';
        $canCreate = '';
        $canView = '';
        
        if($user!=null){
        
	        if($user['Role'] == 'Admin'){
		        $is_auth = true;
		        $canEdit = 'All';
		        $canPublish = 'All';
		        $canRemove = 'All';
		        $canCreate = 'All';
		        $canView= 'All';
	        }
	        else if($user['Role'] == 'Contributor'){
	        	$is_auth = true;
	        	$canEdit = 'All';
		        $canPublish = '';
		        $canRemove = '';
		        $canCreate = '';
		        $canView= 'All';
	        }
	        else if($user['Role'] == 'Member'){
	        	$is_auth = true;
	        	$canEdit = '';
		        $canPublish = '';
		        $canRemove = '';
		        $canCreate = '';
		        $canView= 'All';
	        }
	        else{
		        
		        // try to get a role by its name
				$role = Role::GetByName($user['Role'], $user['SiteId']);
		        
		        if($role!=null){
		        	$canEdit = trim($role['CanEdit']);
					$canPublish = trim($role['CanPublish']);
					$canRemove = trim($role['CanRemove']);
					$canCreate = trim($role['CanCreate']);
					$canView = trim($role['CanView']);
		        }
		        else{
			        $is_auth = false;
		        }
		        
	        }
	        
        }
        else{
            // return an unauthorized exception (401)
            $response = new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			$response->body = 'Access denied';
			return $response;
        }

		// login if authorized
        if($is_auth = true){
            
            try{
            
            	$fullPhotoUrl = '';
            	
            	// set photo url
            	if($user['PhotoUrl'] != '' && $user['PhotoUrl'] != NULL){
            	
            		// build the full URL for the photo
            		$site = Site::GetBySiteId($user['SiteId']);
            		
            		// set images URL
					$imagesURL = $site['Domain'];
					
	            	$fullPhotoUrl = $imagesURL.'/files/thumbs/'.$user['PhotoUrl'];
	            	
            	}
            	
            	// set last login
            	Site::SetLastLogin($user['SiteId']);
            
            	// return a subset of the user array
            	$returned_user = array(
            		'Email' => $user['Email'],
            		'FirstName' => $user['FirstName'],
            		'LastName' => $user['LastName'],
            		'PhotoUrl' => $user['PhotoUrl'],
            		'FullPhotoUrl' => $fullPhotoUrl,
            		'Language' => $user['Language'],
            		'Role' => $user['Role'],
            		'SiteAdmin' => $user['SiteAdmin'],
            		'SiteId' => $user['SiteId'],
            		'UserId' => $user['UserId'],
            		'CanEdit' => $canEdit,
            		'CanPublish' => $canPublish,
            		'CanRemove' => $canRemove,
            		'CanCreate' => $canCreate,
            		'CanView' => $canView
            	);
            
            
				// send token
				$params = array(
					'start' => START_PAGE,
					'user' => $returned_user,
					'firstLogin' => $first_login,
					'token' => Utilities::CreateJWTToken($user['UserId'], $user['SiteId'])
				);
				
				// return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($params);
			
			}
			catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::UNAUTHORIZED);
				$response->body = $e->getMessage();
				return $response;
			}
            
            return $response;
        }
        else{
            // return an unauthorized exception (401)
            $response = new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			$response->body = 'Access denied';
			return $response;
        }
    }
}


/**
 * A protected API call to send an email if you forgot your password
 * @uri /user/forgot
 */
class UserForgotResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

        $email = $request['email'];
        $friendlyId = $request['friendlyId'];
        
        // get site
        $site = Site::GetByFriendlyId($friendlyId);
        
        // get user
        $user = User::GetByEmail($email, $site['SiteId']);

		// send email
        if($user!=null){
            
            // set token
            $token = urlencode(User::SetToken($user['UserId']));
            
            // send email
            $to = $email;
    		$from = EMAILS_FROM;
    		$fromName = EMAILS_FROM_NAME;
    		$subject = BRAND.': Reset Password';
    		$file = APP_LOCATION.'/emails/reset-password.html';
    		
    		// create strings to replace
    		$resetUrl = APP_URL.'/#/reset/'.$site['FriendlyId'].'/'.$token;
    		
    		$replace = array(
    			'{{brand}}' => BRAND,
    			'{{reply-to}}' => EMAILS_FROM,
    			'{{reset-url}}' => $resetUrl
    		);
    		
    		// send email from file
    		Utilities::SendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);
                    
            // return a successful response (200)
            return new Tonic\Response(Tonic\Response::OK);

        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to reset a user's password
 * @uri /user/reset
 */
class UserResetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

        $token = $request['token'];
        $password = $request['password'];
        $friendlyId = $request['friendlyId'];
        
        // get site
        $site = Site::GetByFriendlyId($friendlyId);

        // get the user from the credentials
        $user = User::GetByToken($token, $site['SiteId']);

        if($user!=null){
            
            User::EditPassword($user['UserId'], $password);
            
            // return a successful response (200)
            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            // return a bad request
            return new Tonic\Response(Tonic\Response::BADREQUEST);
        }
    }
}

/**
 * A protected API call to add a user
 * @uri /user/add
 */
class UserAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $email = $request['email'];
            $password = $request['password'];
            $firstName = $request['firstName'];
            $lastName = $request['lastName'];
            $role = $request['role'];
            $language = $request['language'];
            $isActive = $request['isActive'];

            $user = User::Add($email, $password, $firstName, $lastName, $role, $language, $isActive, $token->SiteId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($user);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to add a user
 * @uri /user/add/member
 */
class UserAddMemberResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        parse_str($this->request->data, $request); // parse request

		$siteId = $request['siteId'];
        $email = $request['email'];
        $password = $request['password'];
        $firstName = $request['firstName'];
        $lastName = $request['lastName'];
        $role = 'Member';
        
        // get a reference to the site
        $site = Site::GetBySiteId($siteId);
        
        // set default language
        $language = $site['Language'];
        $isActive = 0;

        $user = User::Add($email, $password, $firstName, $lastName, $role, $language, $isActive, $siteId);
        
        // send welcome email
        $subject = SITE_WELCOME_EMAIL_SUBJECT;
    	$subject = str_replace('{{site}}', $site['Name'], $subject);
    		
        $content = $site['WelcomeEmail'];
    		
    	// send site email
    	Utilities::SendSiteEmail($site, $email, $site['PrimaryEmail'], $site['Name'], $subject, $content);
        
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'application/json';
        $response->body = json_encode($user);

        return $response;
        
    }

}


/**
 * A protected API call to get the current user
 * @uri /user/current
 */
class UserCurrentResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

		// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            $user = User::GetByUserId($token->UserId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($user);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to add a user
 * @uri /user/photo
 */
class UserPhotoResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $userId = $request['userId'];
            $photoUrl = $request['photoUrl'];

            $user = User::EditPhoto($userId, $photoUrl);
           
			// build full photo url
			$site = Site::GetBySiteId($token->SiteId);
			
			// set images URL
			$imagesURL = $site['Domain'];
			
			$fullPhotoUrl = $imagesURL.'/files/thumbs/'.$photoUrl;
           
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
            $response->body = $fullPhotoUrl;

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call to edit, delete an existing user
 * @uri /user/retrieve
 */
class UserRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	parse_str($this->request->data, $request); // parse request

            $userId = $request['userId'];

            $user = User::GetByUserId($userId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($user);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
}


/**
 * A protected API call to edit, delete an existing user
 * @uri /user/edit
 */
class UserEditResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $userId = $request['userId'];
            $email = $request['email'];
            $password = $request['password'];
            $firstName = $request['firstName'];
            $lastName = $request['lastName'];
            $language = $request['language'];
            
            if(isset($request['isActive'])){
            	$isActive = $request['isActive'];
            }

			if(isset($request['role'])){
            	$role = $request['role'];
				User::Edit($userId, $email, $password, $firstName, $lastName, $role, $language, $isActive);
			}
			else{
				User::EditProfile($userId, $email, $password, $firstName, $lastName, $language);
			}

            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
        
    }

}


/**
 * A protected API call to edit, delete an existing user
 * @uri /user/remove
 */
class UserRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

			parse_str($this->request->data, $request); // parse request

            $userId = $request['userId'];

            User::Remove($userId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call that shows all pages
 * @uri /user/list
 */
class UserList extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            // get users
            $list = User::GetUsersForSite($token->SiteId, true);
            $site = Site::GetBySiteId($token->SiteId);
            
            $updated_list = array();
            
            //print each file name
            foreach($list as $user){
            	
            	$hasPhoto = false;
            	$fullPhotoUrl = '';
            	
            	if($user['PhotoUrl'] != '' && $user['PhotoUrl'] != ''){
            		$hasPhoto = true;
            		
            		// set images URL
					$imagesURL = $site['Domain'];
					
	            	$fullPhotoUrl = $imagesURL.'/files/thumbs/'.$user['PhotoUrl'];
            	}
            	
            	$user['HasPhoto'] = $hasPhoto; 
            	$user['FullPhotoUrl'] = $fullPhotoUrl; 
            	
            	array_push($updated_list, $user);
            }
      
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($updated_list);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

?>