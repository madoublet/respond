<?php

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /template
 */
class TemplateResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $json = file_get_contents('../templates/templates.json');
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = $json;

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to apply a template
 * @uri /template/apply/{template}
 */
class TemplateApplyResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function apply($template) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteUniqId($authUser->SiteUniqId);
        
            // edits the template for the site
    		Site::EditTemplate($authUser->SiteUniqId, $template);
    		
    		// publishes a template for a site
    		Publish::PublishTemplate($site, $template);
    		
    		// republish site with the new template
    		Publish::PublishSite($site->SiteUniqId);
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = $json;

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to reset a template
 * @uri /template/reset/{template}
 */
class TemplateResetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function resets($template) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteUniqId($authUser->SiteUniqId);
        
        	// publishes a template for a site
    		Publish::PublishTemplate($site, $template);
    		
    		// republish site with the new template
    		Publish::PublishSite($site->SiteUniqId);
            
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
 * @uri /template/stylesheet/add
 */
class TemplateAddStylesheetResource extends Tonic\Resource {

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

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/less/';
            
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
 * @uri /template/stylesheet/{stylesheet}
 */
class TemplateStylesheetResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($stylesheet) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/less/';

            $content = html_entity_decode(file_get_contents($directory.$stylesheet.'.less'));

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
    
    /**
     * @method POST
     */
    function update($stylesheet) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/less/';
            
            $file = $directory.$stylesheet.'.less';

            file_put_contents($file, $content); // save to file

            Publish::PublishAllCSS($site->SiteUniqId);
            
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
    
    /**
     * @method DELETE
     */
    function delete($stylesheet) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/less/';
            
            $file = $directory.$stylesheet.'.less';
            
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
 * @uri /template/stylesheets
 */
class TemplateStylesheetsResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/less/';


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
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($arr);

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
 * @uri /template/layout/add
 */
class TemplateAddLayoutResource extends Tonic\Resource {

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

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/html/';
            
            $file = $directory.$name.'.html';

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
 * @uri /template/layout/{layout}
 */
class TemplateLayoutResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($layout) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/html/';

            $content = html_entity_decode(file_get_contents($directory.$layout.'.html'));

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
    
    /**
     * @method POST
     */
    function update($layout) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/html/';
            
            $file = $directory.$layout.'.html';

            file_put_contents($file, $content); // save to file

    	    Publish::PublishAllPages($site->SiteUniqId);
        
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
    
    /**
     * @method DELETE
     */
    function delete($layout) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/html/';
            
            $file = $directory.$layout.'.html';
            
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
 * @uri /template/layouts
 */
class TemplateLayoutsResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/templates/'.$site->Template.'/html/';

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
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($arr);

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
 * @uri /template/script/add
 */
class TemplateAddScriptResource extends Tonic\Resource {

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

            $directory = '../sites/'.$site->FriendlyId.'/js/custom/';
            
            // create dir if it doesn't exist
        	if(!file_exists($directory)){
    			mkdir($directory, 0777, true);	
    		}
            
            $file = $directory.$name.'.js';

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
 * @uri /template/script/{script}
 */
class TemplateScriptResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($script) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/js/custom/';

            $content = html_entity_decode(file_get_contents($directory.$script.'.js'));

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
    
    /**
     * @method POST
     */
    function update($script) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/js/custom/';
            
            $file = $directory.$script.'.js';

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
    
    /**
     * @method DELETE
     */
    function delete($script) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/js/custom/';
            
            $file = $directory.$script.'.js';
            
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
 * @uri /template/scripts
 */
class TemplateScriptsResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site->FriendlyId.'/js/custom/';


            //get all image files with a .less ext
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
            $response->contentType = 'applicaton/json';
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