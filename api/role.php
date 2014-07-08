<?php

/**
 * A protected API call to edit a page
 * @uri /role/add
 */
class RoleAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			try{
	            parse_str($this->request->data, $request); // parse request
	          
				$name = $request['name'];
	            $canView = $request['canView'];
	            $canEdit = $request['canEdit'];
	            $canPublish = $request['canPublish'];
	            $canRemove = $request['canRemove'];
	            $canCreate = $request['canCreate'];
	
				// add role
				$role = Role::Add($name, $canView, $canEdit, $canPublish, $canRemove, $canCreate, $authUser->SiteId);
	           
	            // return a response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($role);
	
	            return $response;
            
            }
			catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
	    
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to edit a plan
 * @uri /role/edit
 */
class RoleEditResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			try{
	            parse_str($this->request->data, $request); // parse request
	          	
				$roleUniqId = $request['roleUniqId'];
				$name = $request['name'];
	            $canView = $request['canView'];
	            $canEdit = $request['canEdit'];
	            $canPublish = $request['canPublish'];
	            $canRemove = $request['canRemove'];
	            $canCreate = $request['canCreate'];
	
				// edit role
				Role::Edit($roleUniqId, $name, $canView, $canEdit, $canPublish, $canRemove, $canCreate, $authUser->SiteId);
	           
	            // return a response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'text/html';
	            $response->body = 'success';
	
	            return $response;
            
            }
			catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
	    
        
        } else{ // unauthorized access
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to add a page
 * @uri /role/list
 */
class RoleListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

		// get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $list = Role::GetRoles($authUser->SiteId);
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($list);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
        
    }

}

/**
 * A protected API call to edit a page
 * @uri /role/remove
 */
class RoleRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			try{
	            parse_str($this->request->data, $request); // parse request
	          	
				$roleUniqId = $request['roleUniqId'];
			
				// remove role
				Role::Remove($roleUniqId, $authUser->SiteId);
	           
	            // return a response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'text/html';
	            $response->body = 'success';
	
	            return $response;
            
            }
			catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
	    
        
        } else{ // unauthorized access
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

?>