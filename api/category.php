<?php

/**
 * A protected API call to add a category
 * @uri /category/add
 */
class CategoryAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $friendlyId = $request['friendlyId'];
            $name = $request['name'];
            $pageTypeUniqId = $request['pageTypeUniqId'];
            $createdBy = $authUser->UserId;
            
            $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);
            
            $category = Category::Add($friendlyId, $name, $pageType['PageTypeId'], $createdBy);
         
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($category);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to get a list of categories
 * @uri /category/list/all
 */
class CategoryListResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {
        
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	$pageTypeId = -1;
        	
        	parse_str($this->request->data, $request); // parse request
        	
        	if(isset($request['pageTypeId'])){
	        	$pageTypeId = $request['pageTypeId'];
        	}
        	
        	if(isset($request['friendlyId'])){
	        	$friendlyId = $request['friendlyId'];
	        	
	        	$pageType = PageType::GetByFriendlyId($friendlyId, $authUser->SiteId); // look up id
        		
        		$pageTypeId = $pageType['PageTypeId'];
        	}
        	
        	if(isset($request['pageTypeUniqId'])){
        		$pageType = PageType::GetByPageTypeUniqId($request['pageTypeUniqId']); // look up id
        		
        		$pageTypeId = $pageType['PageTypeId'];
        	}
        
			// check that pageTypeId was set
			if($pageTypeId != -1){
	            $list = Category::GetCategories($pageTypeId);
	            
	            // return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($list);
	
	            return $response;
            }
            else{ // return an empty response (e.g. root has not categories)
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = '[]';
	
	            return $response;
	        }
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to get a list of categories for a page
 * @uri /category/list/page
 */
class CategoryListPageResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {
        
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	$pageTypeId = -1;
        	
        	parse_str($this->request->data, $request); // parse request
        	
        	$pageId = $request['pageId'];
        	    
    	    $list = Category::GetCategoriesForPage($pageId);
            
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
 * A protected API call to update a menu item
 * @uri /category/{categoryUniqId}
 */
class CategoryResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update($categoryUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $lastModifiedBy = $authUser->UserId;
            
            Category::Edit($categoryUniqId, $name, $lastModifiedBy);
       
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
    function delete($categoryUniqId) {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            Category::Remove($categoryUniqId);

            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


?>