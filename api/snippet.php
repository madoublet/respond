<?php
/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /snippet/add
 */
class SnippetAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/fragments/snippets/';
            
            // create dir if it doesn't exist
            if(!file_exists($directory)){
            	mkdir($directory, 0777, true);	
    		}
            
            $file = $directory.$name.'.php';

            file_put_contents($file, ''); // save to file

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
 * @uri /snippet/get
 */
class SnippetGetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $file = $request['file'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/fragments/snippets/';

            $content = html_entity_decode(file_get_contents($directory.$file));

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
 * @uri /snippet/update
 */
class SnippetUpdateResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $file = $request['file'];
            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/fragments/snippets/';
            
            $f = $directory.$file;

            file_put_contents($f, $content); // save to file

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
 * @uri /snippet/delete
 */
class SnippetDeleteResource extends Tonic\Resource {

     /**
     * @method DELETE
     */
    function delete() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $file = $request['file'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/fragments/snippets/';
            
            $f = $directory.$file;
            
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
 * @uri /snippet/list
 */
class SnippetsListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/fragments/snippets/';


            //get all image files with a .less ext
            $files = glob($directory . "*.php");

            $arr = array();
     
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];

                array_push($arr, $filename);
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