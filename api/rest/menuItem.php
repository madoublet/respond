<?php

/**
 * A protected API call to add a page
 * @uri /menuitem/add
 */
class MenuItemAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $cssClass = $request['cssClass'];
            $type = $request['type'];
            $url = $request['url'];
            $pageId = $request['pageId'];
            $priority = $request['priority'];
            $siteId = $token->SiteId;
            $lastModifiedBy = $token->UserId;
            
            $menuItem = MenuItem::Add($name, $cssClass, $type, $url, $pageId, $priority, $siteId, $lastModifiedBy);
         
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($menuItem);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to get a list of menu types
 * @uri /menuitem/list/
 */
class MenuItemListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        
        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $type = $request['type'];

            $list = MenuItem::GetMenuItemsForType($authUser->SiteId, $type);
            
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
 * A protected API call to get a list of menu types
 * @uri /menuitem/list/all
 */
class MenuItemListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        
        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $list = MenuItem::GetMenuItems($token->SiteId);
            
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
 * A protected API call to update the order of a menu
 * @uri /menuitem/save/priorities
 */
class MenuItemSavePrioritiesResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function updateOrder() {

        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $json = $request['priorities'];
            
            $arr = json_decode($json, true);
            
            // update the order of the menu item
            foreach ($arr as $key => $value){
                MenuItem::EditPriority($key, $value);
            }
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to update the order of a menu
 * @uri /menuitem/toggle/nested
 */
class MenuItemNestedResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function updateIsNested() {

        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $menuItemId = $request['menuItemId'];
            $isNested = $request['isNested'];
            
            $menuItem = MenuItem::EditIsNested($menuItemId, $isNested);
         
            // return a 200
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call to update a menu item
 * @uri /menuitem/edit
 */
class MenuItemEditResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

			$menuItemId = $request['menuItemId'];
            $name = $request['name'];
            $cssClass = $request['cssClass'];
            $url = $request['url'];
            $pageId = $request['pageId'];
            
            MenuItem::Edit($menuItemId, $name, $cssClass, $url, $pageId);
       
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to remove a menu item
 * @uri /menuitem/remove
 */
class MenuItemRemoveResource extends Tonic\Resource {
    
    /**
     * @method POST
     */
    function post() {
        
        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

			$menuItemId = $request['menuItemId'];
        
            MenuItem::Remove($menuItemId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to remove a menu item
 * @uri /menuitem/publish
 */
class MenuItemPublishResource extends Tonic\Resource {
    
    /**
     * @method POST
     */
    function post() {
        
        // get an authuser
        $token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

			// re-publish the content of the site
			Publish::PublishContent($token->SiteId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


?>