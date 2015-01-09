<?php

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /snippet
 */
class SnippetResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        $json = '{';
        $first = true;
        
        // open themes direcotry
        if($handle = opendir(APP_LOCATION.'snippets/')){
        
		    $blacklist = array('.', '..');
		    
		    // walk through directories
		    while (false !== ($file = readdir($handle))) {
		    
		        if (!in_array($file, $blacklist)) {
		            $dir = $file;
		            
		            $config = APP_LOCATION.'snippets/'.$dir.'/snippet.json';
		            
		            if(file_exists($config)){
		            
		            	$snippet_json = file_get_contents($config);
		            	
		            	// add commas for following json objects
		            	if($first == false){
			            	$json .= ',';
		            	}
		            	
		            	// use the dir as the id
		            	$snippet_json = preg_replace('/{/', '{"id":"'.$dir.'",', $snippet_json, 1);
		            	
						$json .= '"'.$dir.'":'.$snippet_json;
						
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
 * A protected API call to get content from a snippet
 * @uri /snippet/content
 */
class SnippetContentResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
            
        parse_str($this->request->data, $request); // parse request

		$location = APP_LOCATION.'snippets/'.$request['snippet'].'/snippet.html';
		$content = '';
		
		if(file_exists($location)){
			$content = file_get_contents($location);
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
}

?>