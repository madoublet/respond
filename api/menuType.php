<?php

/**
 * A protected API call to add a page
 * @uri /menutype/add
 */
class MenuTypeAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $friendlyId = $request['friendlyId'];
        
            $menuType = MenuType::Add($friendlyId, $name, $authUser->SiteId, $authUser->UserId, $authUser->UserId);
            $arr = $menuType->ToAssocArray();

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($arr);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to update and remove a menu type
 * @uri /menutype/{menuTypeUniqId}
 */
class MenuTypeResource extends Tonic\Resource {

    /**
     * @method DELETE
     */
    function delete($menuTypeUniqId) {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            MenuType::Delete($menuTypeUniqId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to get a list of menu types
 * @uri /menutype/list/all
 */
class MenuTypeListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $list = MenuType::GetMenuTypes($authUser->SiteId);
            
            $arr = array();

            while ($row = mysql_fetch_assoc($list)) {
                array_push($arr, $row);
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($arr);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>