<?php 
    
/**
 * A protected API call to retrieve images from the site
 * @uri /image/list/all
 */
class ImageListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $arr = array();
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/files/';
            
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
                
                // is thumb
                $is_thumb = false;
                
                if(substr($filename, 0, 2)=='t-'){
                    $is_thumb = true;
                }
                
                if($is_thumb==false && $is_image==true){
                    
                    list($width, $height, $type, $attr) = Image::getImageInfo($directory.$filename);
                    
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => 'sites/'.$site['FriendlyId'].'/files/'.$filename,
                        'thumbUrl' => 'sites/'.$site['FriendlyId'].'/files/t-'.$filename,
                        'extension' => $ext,
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
 * @uri /file/post
 */
class FilePostResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            parse_str($this->request->data, $request); // parse request
            
            $overwrite = NULL;
            
            if(isset($_REQUEST['overwrite'])){
	            $overwrite = $_REQUEST['overwrite'];
            }
            
            $arr = array();
            
            $site = Site::GetBySiteId($authUser->SiteId);
            
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
            $directory = '../sites/'.$site['FriendlyId'].'/files/';
            
            // allowed filetypes
            $allowed = explode(',', ALLOWED_FILETYPES);
         
         	// trim and lowercase all items in the aray   
			$allowed = array_map('trim', $allowed);
			$allowed = array_map('strtolower', $allowed);
        
            // save image
            if($ext=='png' || $ext=='jpg' || $ext=='gif' || $ext == 'svg'){ // upload image
            
    			$size = Image::SaveImageWithThumb($directory, $filename, $file);
    			
    			$width = 0;
    			$height = 0;
    			
    			// try to get width and height
    			try{
    				list($width, $height, $type, $attr) = Image::getImageInfo($directory.$filename); // get width and height
                }
                catch(Exception $e){}
                
                $arr = array(
                        'filename' => $filename,
                        'fullUrl' => 'sites/'.$site['FriendlyId'].'/files/'.$filename,
                        'thumbUrl' => 'sites/'.$site['FriendlyId'].'/files/t-'.$filename,
                        'extension' => $ext,
                        'isImage' => true,
                        'width' => $width,
                        'height' => $height
                    );
                    
    		}
    		else if(in_array($ext, $allowed)){ // save file if it is allowed

    			// upload file
    			Utilities::SaveFile($directory, $filename, $file);
                
                $arr = array(
                    'filename' => $filename,
                    'fullUrl' => 'sites/'.$site['FriendlyId'].'/files/'.$filename,
                    'thumbUrl' => 'sites/'.$site['FriendlyId'].'/files/t-'.$filename,
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
 * A protected API call to retrieve the current site
 * @uri /file/list/all
 */
class FileListAllResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            $arr = array();
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $directory = '../sites/'.$site['FriendlyId'].'/files/';
            
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
                
                // is thumb
                $is_thumb = false;
                
                if(substr($filename, 0, 2)=='t-'){
                    $is_thumb = true;
                }
                
                if($is_thumb==false && $is_image==true){
                    
                    $width = 0;
                    $height = 0;
                    
                    try{
                    	list($width, $height, $type, $attr) = Image::getImageInfo($directory.$filename);
                    }
					catch(Exception $e){}
					
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => 'sites/'.$site['FriendlyId'].'/files/'.$filename,
                        'thumbUrl' => 'sites/'.$site['FriendlyId'].'/files/t-'.$filename,
                        'extension' => $ext,
                        'isImage' => $is_image,
                        'width' => $width,
                        'height' => $height
                    );
                    
                    array_push($arr, $file); 
                }
                else if($is_thumb==false){
                    $file = array(
                        'filename' => $filename,
                        'fullUrl' => 'sites/'.$site['FriendlyId'].'/files/'.$filename,
                        'thumbUrl' => 'n/a',
                        'extension' => $ext,
                        'isImage' => $is_image,
                        'width' => -1,
                        'height' => -1
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
 * @uri /file/remove
 */
class FileRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
            
            parse_str($this->request->data, $request); // parse request
            
            $filename = $request['filename'];
            
            $site = Site::GetBySiteId($authUser->SiteId);

            $full_path = '../sites/'.$site['FriendlyId'].'/files/'.$filename;
            
            $success = unlink($full_path);
            
            if($success==true){
	            return new Tonic\Response(Tonic\Response::OK);
            }
            else{
	            $response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = 'File could not be removed';
				return $response;
            }
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
}

?>