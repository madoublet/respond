<?php
/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /stylesheet/add
 */
class StylesheetAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
            
            $file = $directory.$name.'.less';

            file_put_contents($file, ''); // save to file

            // return a text/html response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/HTML';
            $response->body = $name;
          
            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /stylesheet/retrieve
 */
class StylesheetRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';

            $content = html_entity_decode(file_get_contents($directory.$name.'.less'));

            // return a text/html response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/HTML';
            $response->body = $content;

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * Publishes the LESS for a stylesheet and renders the CSS to the site
 * @uri /stylesheet/publish
 */
class StylesheetPublishResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $content = $request['content'];
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
            
            $f = $directory.$name.'.less';

            file_put_contents($f, $content); // save to file

            $errors = Publish::GetLESSErrors($site, $name);
            
            if($errors == NULL){
            
            	// publishes all css
            	Publish::PublishAllCSS($site);
            
            	// send success
            	$response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'text/HTML';
	            $response->body = 'yay!';
			}
            else{
            
            	// send errors
	            $response = new Tonic\Response(Tonic\Response::BADREQUEST);
	            $response->contentType = 'text/HTML';
	            $response->body = $errors;
            }

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
   
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /stylesheet/remove
 */
class StylesheetRemoveResource extends Tonic\Resource {

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
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
            
            $f = $directory.$name.'.less';
            
            unlink($f);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
         
            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /stylesheet/list
 */
class StylehseetListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';

            //get all image files with a .less ext
            $files = glob($directory . "*.less");

            $arr = array();
     
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                $name = str_replace('.less', '', $filename);

                array_push($arr, $name);
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($arr);

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>