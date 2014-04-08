<?php

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /plugin
 */
class PluginResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $json = file_get_contents('../plugins/plugins.json');

            $siteUniqId = $authUser->SiteUniqId;

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = $json;

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>