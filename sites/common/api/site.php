<?php 

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/test
 */
class SiteTestResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/HTML';
        $response->body = 'API works!';

        return $response;
    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /site/change/language
 */
class SiteChangeLanguageResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);

		session_start();

        $friendlyId = SITE_FRIENDLY_ID;
        $language = $request['language'];
        
        $_SESSION[$friendlyId.'.Language'] = $language;
        
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/html';
        $response->body = $friendlyId.'.Language='.$language;

        return $response;
    }
}

/**
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /site/search
 */
class SiteSearchResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        parse_str($this->request->data, $request); // parse request
        $term = $request['term'];
        $language = $request['language'];
        $siteUniqId = SITE_UNIQ_ID;
        
        $site = Site::GetBySiteUniqId($siteUniqId);
        
        $showSecure = false;
        
        if(isset($_SESSION[$site['FriendlyId'].'.UserId'])){
	        $showSecure = true;
        }
       
	    $results = SearchIndex::Search($siteUniqId, $language, $term, $showSecure);
	            
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'application/json';
        $response->body = json_encode($results);

        return $response;
    }

}

?>