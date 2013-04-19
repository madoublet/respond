<?php
	
class Utilities
{
	// gets a query string
	public static function GetQueryString($field){
		
		if(array_key_exists($field, $_GET)){
			$value = $_GET[$field];
			$value = trim($value);
	    	$value = stripslashes($value);
	    	$value = htmlspecialchars($value);
			
	    	return $value;
		}
		else{
			return "";
		} 
		
	}

	// uses curl to execute and retrieve the response from a URL
	public static function GetJsonData($url, $assoc){
		$ch = curl_init();

	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($ch, CURLOPT_URL, $url);

	    $data = curl_exec($ch);
	    $resultCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	    curl_close($ch);

	    if ($resultCode == 200) {
	        return json_decode($data, $assoc);
	    } else {
	        return false;
	    }
	}
	
	// copies a directory
	public static function CopyDirectory($src, $dst){ 
	    $dir = opendir($src); 
	    @mkdir($dst); 
	    while(false !== ( $file = readdir($dir)) ) { 
	        if (( $file != '.' ) && ( $file != '..' )) { 
	            if ( is_dir($src . '/' . $file) ) { 
	                Utilities::CopyDirectory($src . '/' . $file,$dst . '/' . $file); 
	            } 
	            else { 
	                copy($src . '/' . $file,$dst . '/' . $file); 
	            } 
	        } 
	    } 
	    closedir($dir); 
	} 
	
	
	// saves specified content to a file
	public static function SaveContent($dir, $filename, $content){
		$full = $dir.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		$fp = @fopen($full, 'w'); // Generate a new cache file  
		@fwrite($fp, $content); // save the contents of output buffer to the file
		@fclose($fp); 
	}
	
	// saves a file
	public static function SaveFile($dir, $filename, $file){
		$full = $dir.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		if(move_uploaded_file($file, $full)) {
			return true;
		} 
		else{
		    return false;
		}
	}
	
	// saves a image
	public static function SaveImage($dir, $filename, $image){
		$full = $dir.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		$parts = explode(".", $filename); 
		$ext = end($parts); // get extension
		$ext = strtolower($ext); // convert to lowercase
		
		if($ext=='png'){ // save image
			imagepng($image, $full);
		}
		else if($ext=='jpg'){
			imagejpeg($image, $full, 100);
		}
		else if($ext=='gif'){
			imagegif($image, $full);
		}
		
	}
	
	// adapted from mobiforge, http://mobiforge.com/developing/story/lightweight-device-detection-php
	public static function IsMobileDevice(){
		
		$mobile_browser = '0';
 
 		if(isset($_SERVER['HTTP_USER_AGENT'])){
			if(preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
			    $mobile_browser++;
			}
		}
		
		if(isset($_SERVER['HTTP_ACCEPT'])){ 
			if((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml')>0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) {
			    $mobile_browser++;
			}    
		}
		
		if(isset($_SERVER['HTTP_USER_AGENT'])){  
			$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'],0,4));
			$mobile_agents = array(
			    'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
			    'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
			    'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
			    'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
			    'newt','noki','oper','palm','pana','pant','phil','play','port','prox',
			    'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
			    'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
			    'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
			    'wapr','webc','winw','winw','xda','xda-');
			 
			if(in_array($mobile_ua,$mobile_agents)) {
			    $mobile_browser++;
			}
		}
		
		if(isset($_SERVER['ALL_HTTP'])){  
			if (strpos(strtolower($_SERVER['ALL_HTTP']),'OperaMini')>0) {
			    $mobile_browser++;
			}
		}
		
		if(isset($_SERVER['HTTP_USER_AGENT'])){ 
			if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'windows')>0) {
			    $mobile_browser=0;
			}
		}
		
		if(isset($_SERVER['HTTP_USER_AGENT'])){ 
			if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'windows phone os')>0) {
			    $mobile_browser=1;
			}
		}
		 
		if($mobile_browser>0) {
		   return true;
		}
		else {
		   return false;
		}   
		
	}
	
	// get a date in a format JavaScript can understand, YYYY-MM-DD hours:minutes:seconds
	public static function GetDateForJavaScript($date, $timezone){
		// get offset
		$offset = 0;
		
		if($timezone=='EST'){
			$offset = -5 * (60 * 60);
		}
		else if($timezone=='CST'){
			$offset = -6 * (60 * 60);
		}
		else if($timezone=='MST'){
			$offset = -7 * (60 * 60);
		}
		else if($timezone=='PST'){
			$offset = -8 * (60 * 60);
		}
		
		if($date!=''){
			$unixDate = (strtotime($date)+$offset);
			$jsfriendly = date('Y-m-d G:i:s ', $unixDate);
			// $jsfriendly = date('F j, Y G:i:s ', $unixDate);
			
			return $jsfriendly;
		}
		else{
			return '';
		}
		
	}
	
	// get readable time
	public static function GetReadable($date, $timezone){
		// get offset
		$offset = 0;
		
		if($timezone=='EST'){
			$offset = -5 * (60 * 60);
		}
		else if($timezone=='CST'){
			$offset = -6 * (60 * 60);
		}
		else if($timezone=='MST'){
			$offset = -7 * (60 * 60);
		}
		else if($timezone=='PST'){
			$offset = -8 * (60 * 60);
		}
		
		if($date!=''){
			$unixDate = (strtotime($date)+$offset);
			$readable = date('M d', $unixDate).' at '.date('g:i A', $unixDate);
			
			return $readable;
		}
		else{
			return '';
		}
	}
}
	
?>