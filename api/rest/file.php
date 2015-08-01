<?php 

/**
 * A protected API call to retrieve the current site
 * @uri /file/post
 */
class FilePostResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
            
            parse_str($this->request->data, $request); // parse request
            
            $overwrite = NULL;
            $folder = 'files';
            
            if(isset($_REQUEST['overwrite'])){
	            $overwrite = $_REQUEST['overwrite'];
            }
            
            if(isset($_REQUEST['folder'])){
	            $folder = $_REQUEST['folder'];
            }
            
            $arr = array();
            
            // Get uploaded file info
        	$filename = $_FILES['file']['name'];  
    		$file = $_FILES['file']['tmp_name'];
    		$contentType = $_FILES['file']['type'];
    		$size = intval($_FILES['file']['size']/1024);
    		
    		// overwrite if applicable
    		if($overwrite != NULL){
	    		$filename = $overwrite;
    		}
    		
    		$parts = explode(".", $filename); 
    		$ext = end($parts); // get extension
    		$ext = strtolower($ext); // convert to lowercase
            
            $thumbnail = 't-'.$filename;
            
            // allowed filetypes
            $allowed = explode(',', ALLOWED_FILETYPES);
         
         	// trim and lowercase all items in the aray   
			$allowed = array_map('trim', $allowed);
			$allowed = array_map('strtolower', $allowed);
			
            // save image
            if($ext=='png' || $ext=='jpg' || $ext=='gif' || $ext == 'svg'){ // upload image
            
    			$arr = Image::SaveImageWithThumb($site, $filename, $file, $folder);
    			
    			// set local URL
    			$url = 	$site['Domain'];
				
    		    // create array
                $arr = array(
                        'filename' => $filename,
                        'fullUrl' => $url.'/'.$folder.'/'.$filename,
                        'thumbUrl' => $site['Domain'].'/'.$folder.'/thumbs/'.$filename,
                        'extension' => $ext,
                        'isImage' => true,
                        'width' => $arr['width'],
                        'height' => $arr['height'],
                    );
                    
    		}
    		else if(in_array($ext, $allowed)){ // save file if it is allowed
    		
    			// save file to directory
    			$directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/'.$folder.'/';
    			
    			// set url
    			$url = 	$site['Domain'];
    			
				// upload file
				Utilities::SaveFile($directory, $filename, $file);
				
                $arr = array(
                    'filename' => $filename,
                    'fullUrl' => $url.'/'.$folder.'/'.$filename,
                    'thumbUrl' => NULL,
                    'extension' => $ext,
                    'isImage' => false,
                    'width' => -1,
                    'height' => -1
                );
    		}
    		else{
                return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
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
 * A protected API call to retrieve images from the site
 * @uri /image/list/all
 */
class ImageListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
            
            $arr = array();
            
            // list files
            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/files/';
            
            //get all image files with a .html ext
            $files = glob($directory . "*.*");

            $arr = array();
            
            $image_exts = array('gif', 'png', 'jpg', 'svg');
            
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                
                // get extension
                $parts = explode(".", $filename); 
            	$ext = end($parts); // get extension
        		$ext = strtolower($ext); // convert to lowercase
                
                // is image
                $is_image = in_array($ext, $image_exts);
                
                if($is_image==true){
                    
                    list($width, $height, $type, $attr) = Image::getImageInfo($directory.$filename);
                    $size = filesize($directory.$filename);
                    
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => $site['Domain'].'/files/'.$filename,
                        'thumbUrl' => $site['Domain'].'/files/thumbs/'.$filename,
                        'extension' => $ext,
                        'size' => number_format($size / 1048576, 2),
						'isImage' => $is_image,
                        'width' => $width,
                        'height' => $height
                    );
                    
                    array_push($arr, $file); 
                }
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
 * A protected API call to retrieve the current site
 * @uri /file/list
 */
class FileListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
    
       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
            
            $arr = array();
            
			// list files
            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/files/';
            
            //get all image files with a .html ext
            $files = glob($directory . "*.*");

            $arr = array();
            
            $image_exts = array('gif', 'png', 'jpg', 'svg');
            
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                
                // get extension
                $parts = explode(".", $filename); 
                $ext = end($parts); // get extension
        		$ext = strtolower($ext); // convert to lowercase
                
                // is image
                $isImage = in_array($ext, $image_exts);
                
				// get size of file
				$size = filesize($file);
             
                if($isImage==true){
                    
                    $width = 0;
                    $height = 0;
                    
                    try{
                    	list($width, $height, $type, $attr) = Image::getImageInfo($directory.$filename);
                    }
					catch(Exception $e){}
					
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => $site['Domain'].'/files/'.$filename,
                        'thumbUrl' => $site['Domain'].'/files/thumbs/'.$filename,
                        'extension' => $ext,
                        'isImage' => $isImage,
                        'width' => $width,
                        'height' => $height,
                        'size' => number_format($size / 1048576, 2)
                    );
                    
                    array_push($arr, $file); 
                }
                else{
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => $site['Domain'].'/files/'.$filename,
                        'thumbUrl' => 'n/a',
                        'extension' => $ext,
                        'isImage' => $isImage,
                        'width' => NULL,
                        'height' => NULL,
                        'size' => number_format($size / 1048576, 2)
                    );
                    
                    array_push($arr, $file); 
                }

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
 * A protected API call to retrieve the current site
 * @uri /download/list
 */
class DownloadListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
    
       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
            
            $arr = array();
            
            // list files
            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/downloads/';
            
            //get all image files with a .html ext
            $files = glob($directory . "*.*");

            $arr = array();
            
            $image_exts = array('gif', 'png', 'jpg', 'svg');
            
            //print each file name
            foreach($files as $file){
                $f_arr = explode("/",$file);
                $count = count($f_arr);
                $filename = $f_arr[$count-1];
                
                // get extension
                $parts = explode(".", $filename); 
                $ext = end($parts); // get extension
        		$ext = strtolower($ext); // convert to lowercase
                
                // is image
                $isImage = in_array($ext, $image_exts);
                
				// get size of file
				$size = filesize($file);
             
                if($isImage==true){
                    
                    $width = 0;
                    $height = 0;
                    
                    try{
                    	list($width, $height, $type, $attr) = Image::getImageInfo($directory.$filename);
                    }
					catch(Exception $e){}
					
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => $site['Domain'].'/downloads/'.$filename,
                        'thumbUrl' => $site['Domain'].'/downloads/thumbs/'.$filename,
                        'extension' => $ext,
                        'isImage' => $isImage,
                        'width' => $width,
                        'height' => $height,
                        'size' => number_format($size / 1048576, 2)
                    );
                    
                    array_push($arr, $file); 
                }
                else if($is_thumb==false){
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => $site['Domain'].'/downloads/'.$filename,
                        'thumbUrl' => $site['Domain'].'/downloads/thumbs/'.$filename,
                        'thumbUrl' => 'n/a',
                        'extension' => $ext,
                        'isImage' => $isImage,
                        'width' => NULL,
                        'height' => NULL,
                        'size' => number_format($size / 1048576, 2)
                    );
                    
                    array_push($arr, $file); 
                }

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
 * A protected API call to retrieve the size in MB of files stored on the site
 * @uri /file/retrieve/size
 */
class FileRetrieveSizeResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
    
       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
            
            $arr = array();
            
            // calculate files
            $directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/files/';
            
            //get all files in the directory
            $files = glob($directory . "*.*");

            $total_size = 0;
            
            //print each file name
            foreach($files as $file){
                
                // get size of file
				$total_size = $total_size + filesize($file);
         
            }
            
            $total_size = round(($total_size / 1024 / 1024), 2);
	      
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
            $response->body = $total_size;

            return $response;
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }
    
}

/**
 * A protected API call to retrieve the current site
 * @uri /file/remove
 */
class FileRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
            
            parse_str($this->request->data, $request); // parse request
            
            $filename = $request['filename'];
            $folder = 'files';
            
            if(isset($_REQUEST['folder'])){
	            $folder = $_REQUEST['folder'];
            }
            
            // remove local file  
			$path = SITES_LOCATION.'/'.$site['FriendlyId'].'/'.$folder.'/'.$filename;
            
            if(file_exists($path)){
            	$path = unlink($path);
            }
            
            // remove thumb
			$path = SITES_LOCATION.'/'.$site['FriendlyId'].'/'.$folder.'/thumbs/'.$filename;
            
            if(file_exists($path)){
            	$path = unlink($path);
            }
            
            return new Tonic\Response(Tonic\Response::OK);
            
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
}

?>