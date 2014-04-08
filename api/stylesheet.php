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

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
            
            $file = $directory.$name.'.less';

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
 * @uri /stylesheet/get
 */
class StylesheetGetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';

            $content = html_entity_decode(file_get_contents($directory.$name.'.less'));

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
 * @uri /stylesheet/update
 */
class StylesheetUpdateResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
            
            $f = $directory.$name.'.less';

            file_put_contents($f, $content); // save to file

            Publish::PublishAllCSS($site['SiteUniqId']);
            
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
 * @uri /stylesheet/delete
 */
class StylesheetDeleteResource extends Tonic\Resource {

     /**
     * @method DELETE
     */
    function delete() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $name = $request['name'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
            
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

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';

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