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

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            //$json = file_get_contents('../templates/templates.json');
            
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
 * A protected API call to reset a theme
 * @uri /theme/reset/{theme}
 */
class ThemeResetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function resets($theme) {

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


?>