<?php

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /theme
 */
class ThemeResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        $json = '{';
        $first = true;
        
        // open themes direcotry
        if($handle = opendir('../themes')){
        
		    $blacklist = array('.', '..');
		    
		    // walk through directories
		    while (false !== ($file = readdir($handle))) {
		    
		        if (!in_array($file, $blacklist)) {
		            $dir = $file;
		            
		            //$json.='"yup":"'.$dir.'"';
		            
		            $config = '../themes/'.$dir.'/theme.json';
		            
		            if(file_exists($config)){
		            
		            	$theme_json = file_get_contents($config);
		            	
		            	// add commas for following json objects
		            	if($first == false){
			            	$json .= ',';
		            	}
		            	
		            	// use the dir as the id
		            	$theme_json = preg_replace('/{/', '{"id":"'.$dir.'",', $theme_json, 1);
		            	
						$json .= '"'.$dir.'":'.$theme_json;
						
						$first = false;
		            }
		            
		            
		        }
		        
		    }
		    
		    closedir($handle);
		}
        
        $json .= '}';
        
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'application/json';
        $response->body = $json;

        return $response;
        
    }
}

/**
 * A protected API call to apply a themes
 * @uri /theme/apply/{theme}
 */
class ThemeApplyResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function apply($theme) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteUniqId($authUser->SiteUniqId);
        
            // edits the theme for the site
    		Site::EditTheme($authUser->SiteUniqId, $theme);
    		
    		// publishes a theme for a site
    		Publish::PublishTheme($site, $theme);
    		
    		// republish site with the new theme
    		Publish::PublishSite($site['SiteUniqId']);
            
            // return a json response
            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to reset a theme
 * @uri /theme/reset/{theme}
 */
class ThemeResetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post($theme) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $site = Site::GetBySiteUniqId($authUser->SiteUniqId);
        
        	// publishes a theme for a site
    		Publish::PublishTheme($site, $theme);
    		
    		// republish site with the new theme
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


/**
 * A protected API call to get content from a page
 * @uri /theme/page/content
 */
class ThemePageContentResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            parse_str($this->request->data, $request); // parse request

			$location = '../'.$request['location'];
			$content = '';
			
			if(file_exists($location)){
    			$content = file_get_contents($location);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$authUser->SiteFriendlyId, $content);
    		}
    		else{
	    		return new Tonic\Response(Tonic\Response::BADREQUEST, $location.' not found');
    		}
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
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
 * A protected API call to retrieve a list of pages for a theme
 * @uri /theme/pages/list
 */
class ThemePagesListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $arr = array();
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../themes/'.$site['Theme'].'/pages/';
            
            //get files with a .html ext
            $files = glob($directory . "*.html");

            $arr = array();
            
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                
                $name = str_replace('-', ' ', $filename);
                $name = str_replace('.html', '', $name);
                $name = ucfirst($name);
              
                $file = array(
                	'name' => $name,
                    'fileName' => $filename,
                    'location' => 'themes/'.$site['Theme'].'/pages/'.$filename
                );
                
                array_push($arr, $file); 

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