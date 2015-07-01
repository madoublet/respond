<?php
/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /layout/add
 */
class LayoutAddResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/';
            
            $file = $directory.$name.'.html';

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
 * @uri /layout/retrieve
 */
class LayoutRetrieveResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/';

            $content = html_entity_decode(file_get_contents($directory.$name.'.html'));

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
 * @uri /layout/publish
 */
class LayoutPublishResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/';
            
            $file = $directory.$name.'.html';

            file_put_contents($file, $content); // save to file
            
            // republish pages
            Publish::PublishAllPages($site);
            
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
 * @uri /layout/remove
 */
class LayoutRemoveResource extends Tonic\Resource {

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

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/';
            
            $file = $directory.$name.'.html';
            
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
 * @uri /layout/list
 */
class LayoutListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/';

            //get all image files with a .html ext
            $files = glob($directory . "*.html");

            $arr = array();
     
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                $name = str_replace('.html', '', $filename);

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