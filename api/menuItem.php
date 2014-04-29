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
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $cssClass = $request['cssClass'];
            $type = $request['type'];
            $url = $request['url'];
            $pageId = $request['pageId'];
            $priority = $request['priority'];
            $siteId = $authUser->SiteId;
            $createdBy = $authUser->UserId;
            $lastModifiedBy = $authUser->UserId;
            
            $menuItem = MenuItem::Add($name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy);
         
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
 * @uri /menuitem/list/{type}
 */
class MenuItemListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($type) {
        
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

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
 * A protected API call to update the order of a menu
 * @uri /menuitem/order
 */
class MenuItemOrderResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function updateOrder() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $json = $request['json'];
            
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
 * @uri /menuitem/nested
 */
class MenuItemNestedResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function updateIsNested() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $menuItemUniqId = $request['menuItemUniqId'];
            $isNested = $request['isNested'];
            
            $menuItem = MenuItem::EditIsNested($menuItemUniqId, $isNested);
         
            // return a 200
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call to update a menu item
 * @uri /menuitem/{menuItemUniqId}
 */
class MenuItemResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update($menuItemUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $cssClass = $request['cssClass'];
            $url = $request['url'];
            
            MenuItem::Edit($menuItemUniqId, $name, $cssClass, $url);
       
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
    /**
     * @method DELETE
     */
    function delete($menuItemUniqId) {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            MenuItem::Remove($menuItemUniqId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


?>