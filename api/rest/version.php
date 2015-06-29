<?php

/**
 * Adds a version of content, post params: token, pageId, content
 * @uri /version/add
 */
class VersionAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// parse request
        	parse_str($this->request->data, $request); 
			
            // get request paramters
            $pageId = $request['pageId'];
            $content = $request['content'];
            
            // adds a version
            Version::Add($pageId, $token->UserId, $content);
                        
            // return a 200
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * Returns a version of the content, post params: token, versionId
 * @uri /version/retrieve
 */
class VersionRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// parse request
        	parse_str($this->request->data, $request);
			
			$versionId = $request['versionId'];
			
			$version = Version::GetByVersionId($versionId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($version);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
}
    
/**
 * Returns a list of version for a page, post params: token, pageId
 * @uri /version/list
 */
class VersionListResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// parse request
        	parse_str($this->request->data, $request);
        
        	$pageId = $request['pageId'];
        	
			$list = Version::GetVersions($pageId);
			
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

?>