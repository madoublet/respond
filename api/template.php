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
    		Publish::PublishSite($site['SiteUniqId']);
            
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
    		Publish::PublishSite($site['SiteUniqId']);
            
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


?>