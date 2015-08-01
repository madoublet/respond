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
        if($handle = opendir(APP_LOCATION.THEMES_FOLDER)){
        
		    $blacklist = array('.', '..');
		    
		    // walk through directories
		    while (false !== ($file = readdir($handle))) {
		    
		        if (!in_array($file, $blacklist)) {
		            $dir = $file;
		            
		            $config = APP_LOCATION.THEMES_FOLDER.'/'.$dir.'/theme.json';
		            
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
 * @uri /theme/apply
 */
class ThemeApplyResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            parse_str($this->request->data, $request); // parse request
		          
			$theme = $request['theme'];
			
			// convert string to a boolean
			$replaceContent = ($request['replaceContent'] === 'true');
            
            $site = Site::GetBySiteId($token->SiteId);
            
            // edits the theme for the site
    		Site::EditTheme($token->SiteId, $theme);
    		
    		// publishes a theme for a site
    		Publish::PublishTheme($site, $theme);
    		
    		// publish default content for the theme
    		if($replaceContent == true){
	    		echo 'publish default content, $replaceContent='.$replaceContent;
	    		Publish::PublishDefaultContent($site, $theme, $token->UserId);
    		}
    		
    		// republish site with the new theme
    		Publish::PublishSite($site['SiteId']);
            
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
 * @uri /theme/reset
 */
class ThemeResetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            $site = Site::GetBySiteId($token->SiteId);
            
            parse_str($this->request->data, $request); // parse request
		          
			$theme = $request['theme'];
        
        	// publishes a theme for a site
    		Publish::PublishTheme($site, $theme);
    		
    		// republish site with the new theme
    		Publish::PublishSite($site['SiteId']);
            
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

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	$site = Site::GetBySiteId($token->SiteId);
            
            parse_str($this->request->data, $request); // parse request

			$location = APP_LOCATION.'/'.$request['location'];
			$content = '';
			
			if(file_exists($location)){
    			$content = file_get_contents($location);
    			
    			// fix images
    			$content = str_replace('{{site-dir}}', 'sites/'.$site['SiteFriendlyId'], $content);
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
        
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            $arr = array();
            
            $site = Site::GetBySiteId($token->SiteId);

            $directory = APP_LOCATION.THEMES_FOLDER.'/'.$site['Theme'].'/pages/';
            
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
                    'location' => THEMES_FOLDER.'/'.$site['Theme'].'/pages/'.$filename
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

/**
 * A protected API call to retrieve a list of pages for a theme
 * @uri /theme/configurations/list
 */
class ThemeConfigurationsListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            $arr = array();
            
            $site = Site::GetBySiteId($token->SiteId);

			// get configuration
            $file = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/configure.json';
 
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = file_get_contents($file);

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
 * @uri /theme/configurations/apply
 */
class ThemeConfigurationsApplyResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
        
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
            
            parse_str($this->request->data, $request); // parse request
		          
			$configurations = $request['configurations'];
            
            $site = Site::GetBySiteId($token->SiteId);

			// get configuration
            $configure_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/configure.json';
            
            // put contents
            file_put_contents($configure_file, $configurations);
            
            // republish css
            Publish::PublishAllCSS($site);
            
            // get index
            $page = Page::GetByFriendlyId('index', '-1', $token->SiteId);
            
            // republish home page
            Publish::PublishPage($page['PageId']);
 
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