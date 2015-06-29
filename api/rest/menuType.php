<?php

/**
 * A protected API call to add a page
 * @uri /menutype/add
 */
class MenuTypeAddResource extends Tonic\Resource {

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
            $friendlyId = $request['friendlyId'];
        
            $menuType = MenuType::Add($friendlyId, $name, $token->SiteId, $token->UserId);
      
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($menuType);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to update and remove a menu type
 * @uri /menutype/remove
 */
class MenuTypeResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
    	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	parse_str($this->request->data, $request); // parse request

            $menuTypeId = $request['menuTypeId'];
            
            $menuType = MenuType::GetByMenuTypeId($menuTypeId);
            
            // remove items for type
            MenuItem::RemoveForType($menuType['FriendlyId'], $token->SiteId);
        
			// remove type
            MenuType::Remove($menuTypeId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to get a list of menu types
 * @uri /menutype/list
 */
class MenuTypeListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            $list = MenuType::GetMenuTypes($token->SiteId);
            
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

?>