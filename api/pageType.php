<?php

/**
 * A protected API call to add a pagetype
 * @uri /pagetype/add
 */
class PageTypeAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $friendlyId = $request['friendlyId'];
            $typeS = $request['typeS'];
            $typeP = $request['typeP'];
            $siteId = $authUser->SiteId;
            $createdBy = $authUser->UserId;
            $lastModifiedBy = $authUser->UserId;

            $pageType = PageType::Add($friendlyId, $typeS, $typeP, $siteId, $createdBy, $lastModifiedBy);
            $arr = $pageType->ToAssocArray();

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
 * A protected API call to update and remove a page type
 * @uri /pagetype/{pageTypeUniqId}
 */
class PageTypeResource extends Tonic\Resource {

    /**
     * @method DELETE
     */
    function delete($pageTypeUniqId) {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            PageType::Delete($pageTypeUniqId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /pagetype/list/all
 */
class PageTypeListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $siteId = $authUser->SiteId;

            // get pagetype
            $list = PageType::GetPageTypes($siteId);

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
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

?>