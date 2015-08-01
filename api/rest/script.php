<?php
/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /script/add
 */
class ScriptAddResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';
            
            $file = $directory.$name.'.js';

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
 * @uri /script/retrieve
 */
class ScriptRetrieveResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';

            $content = html_entity_decode(file_get_contents($directory.$name.'.js'));

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
 * This class defines an example resource that is wired into the URI /example
 * @uri /script/publish
 */
class ScriptPublishResource extends Tonic\Resource {

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
            $content = $request['content'];
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';
            
            $file = $directory.$name.'.js';

            file_put_contents($file, $content); // save to file

            // return a json response
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
 * This class defines an example resource that is wired into the URI /example
 * @uri /script/remove
 */
class ScriptRemoveResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';
            
            $file = $directory.$name.'.js';
            
            unlink($file);

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
 * @uri /script/list
 */
class ScriptListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';

            // get all files with a .js ext
            $files = glob($directory . "*.js");

            $arr = array();
     
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                $name = str_replace('.js', '', $filename);

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