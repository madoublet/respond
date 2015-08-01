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

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 

            parse_str($this->request->data, $request); // parse request

            $friendlyId = $request['friendlyId'];
            $layout = $request['layout'];
            $stylesheet = $request['stylesheet'];
            $isSecure = $request['isSecure'];
            $siteId = $token->SiteId;
            $lastModifiedBy = $token->UserId;
           
			// add pagetype
            $pageType = PageType::Add($friendlyId, $layout, $stylesheet, $isSecure, $siteId, $lastModifiedBy);
            
            // duplicate pages in pagetype (if set)
            if(isset($request['pageTypeId'])){
            
            	$pageTypeId = $request['pageTypeId'];
            	
            	// set order
            	$pageSize = 100;
            	$page = 0;
            	$orderBy = 'Pages.PageId ASC';
            	
	            // get pages
	            $list = Page::GetPages($siteId, $pageTypeId, $pageSize, $page, $orderBy);
	            
	            // walk through pages
	            foreach ($list as $row){
	            
	            	// duplicate page
					$page = Page::Add($row['FriendlyId'], $row['Name'], $row['Description'], $row['Layout'], $row['Stylesheet'], $pageType['PageTypeId'], $token->SiteId, $token->UserId);
					
					// set content for page						
					Page::EditContent($page['PageId'], $row['Content'], $token->UserId);
	            
	            }
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($pageType);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to add a pagetype
 * @uri /pagetype/edit
 */
class PageTypeEditResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function edit() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){

            parse_str($this->request->data, $request); // parse request

			$pageTypeId = $request['pageTypeId'];
            $layout = $request['layout'];
            $stylesheet = $request['stylesheet'];
            $isSecure = $request['isSecure'];
            $lastModifiedBy = $token->UserId;
            
            PageType::Edit($pageTypeId, $layout, $stylesheet, $isSecure, $lastModifiedBy);

            // return a json response
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to update and remove a page type
 * @uri /pagetype/remove
 */
class PageTypeRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){
        
        	parse_str($this->request->data, $request); // parse request

			$pageTypeId = $request['pageTypeId'];
        
        	$pageType = PageType::GetByPageTypeId($pageTypeId);
			$site = Site::GetBySiteId($pageType['SiteId']);
		
			// remove page type and pages from DB
            PageType::Remove($pageType['PageTypeId'], $token->SiteId);

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

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){

            $siteId = $token->SiteId;

            // get pagetype
            $list = PageType::GetPageTypes($siteId);

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

}


/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /pagetype/list/allowed
 */
class PageTypeListAllowedResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){

            $siteId = $token->SiteId;
            
            // get user
            $user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);

            // get pagetype
            $list = PageType::GetPageTypes($siteId);
			
			// allowed
			$allowed = array();
			
			// create a root element in the array
			$root = array(
				'FriendlyId' => '',
				'IsSecure' => 0,
				'LastModifiedBy' => NULL,
				'LastModifiedDate' => NULL,
				'Layout' => 'content',
				'PageTypeId' => -1,
				'PageTypeId' => -1,
				'SiteId' => -1,
				'Stylesheet' => 'content',
			);
			
			// return the entire list for all access
			if($access['CanAccess'] == 'All'){
			
				$allowed = $list;
				
				array_unshift($allowed, $root);
			}
			else{
				foreach ($list as $row){
				
					$pageTypeId = $row['PageTypeId'];
					
					if(Utilities::CanPerformAction('root', $access['CanAccess']) != false){
						array_push($allowed, $root);
					}
					
					//print('$pageTypeId='.$pageTypeId.' access='.$access['CanAccess']);
					
					// check permissions
					if(Utilities::CanPerformAction($pageTypeId, $access['CanAccess']) != false){
						array_push($allowed, $row);
					}
				
				}
			}

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($allowed);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}
?>