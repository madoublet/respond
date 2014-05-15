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
        
        // get the user from the credentials
        $user = User::GetByEmailPassword($email, $password);

        if($user!=null){
            
            try{
            
            	// if $site is null, login to the app, else login to the site
	            $site = Site::GetBySiteUniqId(SITE_UNIQ_ID);
	            
	            // default canView
	            $canView = '';
	            
	            // try to get a role by its name
				$role = Role::GetByName($user['Role'], $user['SiteId']);
		        
		        // set canView permission 
		        if($role!=null){
		        	$canView = trim($role['CanView']);
		        }
				
				if($site['SiteId'] == $user['SiteId']){
					SiteAuthUser::Create(SITE_FRIENDLY_ID, $user, $canView);
	
					$params = array();
				}
				else{ // invalid login
					$response = new Tonic\Response(Tonic\Response::BADREQUEST);
					$response->body = 'Site mismatch';
					return $response;	
				}
		
				// return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'text/html';
	            $response->body = 'success!';
			
			}
			catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
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
    function forgot() {

        // parse request
        parse_str($this->request->data, $request);

        $email = $request['email'];
        
        $user = User::GetByEmail($email);

        if($user!=null){
            
            $token = urlencode(User::SetToken($user['UserUniqId']));
            
            // send an email to reset the password
        	$to = $email;
    		$subject = 'RespondCMS: Reset your password';
    		$message = '<html>
    			<head>
    			  <title>RespondCMS: Reset your password</title>
    			</head>
    			<body>
    			  <p>
    			  	To reset your password, click on the <br>
    				<a href="'.APP_URL.'/forgot?t='.$token.'">'.APP_URL.'/forgot?t='.$token.'
    				</a>
    			  </p>
    			</body>
    			</html>';
    
    		$headers  = 'MIME-Version: 1.0' . "\r\n";
    		$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    		$headers .= 'From: no-reply@respondcms.com' . "\r\n" .
        				'Reply-To: no-reply@respondcms.com' . "\r\n";
    
    		mail($to, $subject, $message, $headers);
            
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
 * A protected API call to login a user
 * @uri /user/reset
 */
class UserResetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function reset() {

        // parse request
        parse_str($this->request->data, $request);

        $token = $request['token'];
        $password = $request['password'];

        // get the user from the credentials
        $user = User::GetByToken($token);

        if($user!=null){
            
            User::EditPassword($user['UserUniqId'], $password);
            
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
 * A protected API call to add a user
 * @uri /user/add
 */
class UserAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

		// parse request
        parse_str($this->request->data, $request); // parse request

        $email = $request['email'];
        $password = $request['password'];
        $firstName = $request['firstName'];
        $lastName = $request['lastName'];
        $role = 'Member';
        $isActive = 0;
        $language = $request['language'];
        
        $site = Site::GetBySiteUniqId(SITE_UNIQ_ID);

        $user = User::Add($email, $password, $firstName, $lastName, $role, $language, $isActive, $site['SiteId']);

        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'applicaton/json';
        $response->body = json_encode($user);

        return $response;
  
    }

}
?>