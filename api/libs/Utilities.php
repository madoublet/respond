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
	
	// removes a directory and its files
	public static function RemoveDirectory($dir) {
      	
      	$files = glob($dir.'/*'); // get all file names
 		foreach($files as $file){ // iterate files
 		  if(is_file($file))
 		    unlink($file); // delete file
 		}
 		
 		if (is_dir($dir)) {
 		    rmdir($dir);
 		}
      	
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
		
		$timeZone = new DateTimeZone($site['TimeZone']);
        $now = new DateTime("now", $timeZone);
        $offset = $timeZone->getOffset($now);
		
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
	
	// generate rss
    public static function GenerateRSS($site, $pageType){
        
        $list = Page::GetRSS($site['SiteId'], $pageType['PageTypeId']);
        
        $timeZone = new DateTimeZone($site['TimeZone']);
        $now = new DateTime("now", $timeZone);
        $offset = $timeZone->getOffset($now);
        
        $rss = '<?xml version="1.0" encoding="utf-8"?>'.
            '<rss version="2.0">'.
              '<channel>'.
              '<title>'.$site['Name'].' - /'.$pageType['FriendlyId'].'</title>'.
              '<link>'.$site['Domain'].'</link>'.
              '<description></description>'.
              '<language>en-us</language>'.
              '<copyright>Copyright (C) '.date('Y').' '.$site['Domain'].'</copyright>';
        
        foreach ($list as $row){
            
            $u = (strtotime($row['LastModifiedBy'])+$offset);
          
            $rss = $rss.'<item>'.
                   '<title>'.$row['Name'].'</title>'.
                   '<description><![CDATA['.$row['Description'].']]></description>'.
                   '<link>'.$site['Domain'].'/'.strtolower($pageType['FriendlyId']).'/'.strtolower($row['FriendlyId']).'.html</link>'.
                   '<pubDate>'.date('D, d M Y H:i:s T', $u).'</pubDate>'.
                   '</item>';
        }
        
        $rss = $rss.'</channel>';
        $rss = $rss.'</rss>';
        
        return $rss;
    }
      
    // generate site map
    public static function GenerateSiteMap($site){
        
        $list = Page::GetPagesForSite($site['SiteId']);
        
        // get offset for time zone
        $timeZone = new DateTimeZone($site['TimeZone']);
        $now = new DateTime("now", $timeZone);
        $offset = $timeZone->getOffset($now);
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'.
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
               
        date_default_timezone_set('America/Los_Angeles');
    
        foreach ($list as $row){
            
          $u = (strtotime($row['LastModifiedDate'])+$offset);
          
          $pageType = PageType::GetByPageTypeId($row['PageTypeId']);
          
		  if($pageType['IsSecure']==1){
		  	continue;
		  }
		  
		  if($row['IncludeOnly']==1){
			  continue;
		  }
		  
		  // set URL divider based on URL mode
		  $divider = '/';
		  
		  // build url
          if($row['PageTypeId']==-1){
            
            $xml = $xml.'<url>'.
                       '<loc>'.$site['Domain'].$divider.strtolower($row['FriendlyId']).'</loc>'.
                       '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                     '<priority>1.0</priority>'.
                       '</url>';
            
          }
          else{
            $xml = $xml.'<url>'.
                       '<loc>'.$site['Domain'].$divider.
                       strtolower($pageType['FriendlyId']).'/'.strtolower($row['FriendlyId']).'</loc>'.
                       '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                     '<priority>0.5</priority>'.
                       '</url>';
          }
        }
        
        $xml = $xml.'</urlset>';
        
        return $xml;
    }
            
    // send welcome email
    public static function SendEmailFromFile($to, $from, $fromName, $subject, $replace, $file, $site = NULL){
    
    	$full_file = $file;
    	
	    if(file_exists($full_file)){
	    
            $content = file_get_contents($full_file);
            
            // walk through and replace values in associative array
            foreach ($replace as $key => &$value) {
			    
			    $content = str_replace($key, $value, $content);
			    $subject = str_replace($key, $value, $subject);
			    
			}
			
			// send email
			if($site != NULL){
				Utilities::SendSiteEmail($site, $to, $from, $fromName, $subject, $content);
			}
			else{
				Utilities::SendEmail($to, $from, $fromName, $subject, $content);
			}
            
        }
	    
    }
    
    // sends an email
    public static function SendSiteEmail($site, $to, $from, $fromName, $subject, $content){
    
    	$mail = new PHPMailer;

		if($site['IsSMTP'] == 1){
		
			// password and iv
			$password = base64_decode($site['SMTPPassword']);
			$iv = base64_decode($site['SMTPPasswordIV']);
			$encryption_key = SMTPENC_KEY;
			
			// decrypt password
			$decrypted = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $encryption_key, $password, MCRYPT_MODE_CFB, $iv);		
		
			// setup SMTP for the site	
			$mail->isSMTP();                    		// Set mailer to use SMTP
			$mail->Host = $site['SMTPHost'];  			// Specify main and backup server
			$mail->SMTPAuth = $site['SMTPAuth'];        // Enable SMTP authentication
			$mail->Username = $site['SMTPUsername'];    // SMTP username
			$mail->Password = $decrypted;    			// SMTP password
			$mail->SMTPSecure = $site['SMTPSecure'];    // Enable encryption, 'ssl' also accepted
			$mail->CharSet = 'UTF-8';
			
		}
		else{
		
			// setup SMTP		
			if(IS_SMTP == true){
	
				$mail->isSMTP();                    // Set mailer to use SMTP
				$mail->Host = SMTP_HOST;  			// Specify main and backup server
				$mail->SMTPAuth = SMTP_AUTH;        // Enable SMTP authentication
				$mail->Username = SMTP_USERNAME;    // SMTP username
				$mail->Password = SMTP_PASSWORD;    // SMTP password
				$mail->SMTPSecure = SMTP_SECURE;    // Enable encryption, 'ssl' also accepted
			
			}
			
		}
		
		$mail->addReplyTo($from, $fromName); 		// Set Reply-To: header to the primary site email
		$mail->From = EMAILS_FROM; 					// Set From: header to address specified in setup.php
		$mail->FromName = EMAILS_FROM_NAME;
		$mail->addAddress($to, '');
		$mail->isHTML(true);
		
		$mail->Subject = $subject;
		$mail->Body = html_entity_decode($content, ENT_COMPAT, 'UTF-8');
    
		if(!$mail->send()) {
		   return true;
		}
		
		return false;    
		
    }

	// sends an email
    public static function SendEmail($to, $from, $fromName, $subject, $content){
    
    	$mail = new PHPMailer;

		// setup SMTP		
		if(IS_SMTP == true){

			$mail->isSMTP();                    // Set mailer to use SMTP
			$mail->Host = SMTP_HOST;  			// Specify main and backup server
			$mail->SMTPAuth = SMTP_AUTH;        // Enable SMTP authentication
			$mail->Username = SMTP_USERNAME;    // SMTP username
			$mail->Password = SMTP_PASSWORD;    // SMTP password
			$mail->SMTPSecure = SMTP_SECURE;    // Enable encryption, 'ssl' also accepted
			$mail->CharSet = 'UTF-8';
		
		}
		
		$mail->From = $from;
		$mail->FromName = $fromName;
		$mail->addAddress($to, '');
		$mail->isHTML(true);
		
		$mail->Subject = $subject;
		$mail->Body    = html_entity_decode($content, ENT_COMPAT, 'UTF-8');
		
		if(!$mail->send()) {
		   return true;
		}
		
		return false;    
		
    }
    
    // searches an associative array for a value
    public static function SearchForId($id, $param, $array){
	   foreach ($array as $key => $val) {
	       if ($val[$param] == $id) {
	           return $key;
	       }
	   }
	   return null;
	}
	
	// sets permissions
	public static function SetAccess($user){
		
		if($user['Role'] == 'Admin'){
	        $is_auth = true;
	        $canEdit = 'All';
	        $canPublish = 'All';
	        $canRemove = 'All';
	        $canCreate = 'All';
        }
        else if($user['Role'] == 'Contributor'){
        	$is_auth = true;
        	$canEdit = 'All';
	        $canPublish = '';
	        $canRemove = '';
	        $canCreate = '';
        }
        else if($user['Role'] == 'Member'){
        	$is_auth = false;
        }
        else{
	        
	        // try to get a role by its name
			$role = Role::GetByName($user['Role'], $user['SiteId']);
	        
	        if($role!=null){
	        	$canEdit = trim($role['CanEdit']);
				$canPublish = trim($role['CanPublish']);
				$canRemove = trim($role['CanRemove']);
				$canCreate = trim($role['CanCreate']);
	        	
	        	if($canEdit != '' && $canPublish != '' && $canRemove != ''){
		        	$is_auth = true;
	        	}
	        }
	        else{
		        $is_auth = false;
	        }
	        
        }
        
        // set can access
		if($canEdit == 'All' || $canPublish == 'All' || $canRemove == 'All' || $canCreate == 'All'){
			$canAccess = 'All';
		}
		else{
			$canAccess = $canEdit.','.$canPublish.','.$canRemove.','.$canCreate;
		}
        
        return array(
        	'CanEdit' => $canEdit,
		    'CanPublish' => $canPublish,
		    'CanRemove' => $canRemove,
		    'CanCreate' => $canCreate,
		    'CanAccess' => $canAccess
        );
		
	}
	
    
    // checks permissions, $canAction = $canView, $canEdit, $canPublish, $canRemove, $canCreate
    public static function CanPerformAction($pageTypeId, $canAction){
    
    	// trim
    	$canAction = trim($canAction);
	    
	    // set -1 to root (if applicable)
	    if($pageTypeId == '-1' || $pageTypeId == -1){
		    $pageTypeId = 'root';
	    }
	    
	    // return false for blank
	    if($canAction == ''){
		    return false;
	    }
	    
	    // return true if all
	    if($canAction == 'All'){
		    return true;
	    }
	    
	    // check access list
	    if(strpos($canAction, $pageTypeId) === false){
		    return false;
	    }
	    else{
		    return true;
	    }
	   
    }
    
    // create JWT token, #ref: https://github.com/firebase/php-jwt, https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
    public static function CreateJWTToken($userId, $siteId){
	    
	    // create token
		$token = array(
		    'UserId' => $userId,
		    'SiteId' => $siteId,
		    'Expires' => (strtotime('NOW') + (3*60*60)) // expires in an hour
		);
		
		// create JWT token, #ref: https://github.com/firebase/php-jwt
		$jwt_token = JWT::encode($token, JWT_KEY);
		
		// return token
		return $jwt_token;
    }
    
    // validate JWT token
    public static function ValidateJWTToken(){
    
    	$auth = $_SERVER['HTTP_X_AUTH'];

		// locate token
		if(strpos($auth, 'Bearer') !== false){
		
			$jwt = str_replace('Bearer ', '', $auth);
			
			try{
			
				// decode token
				$jwt_decoded = JWT::decode($jwt, JWT_KEY, array('HS256'));
				
				if($jwt_decoded != NULL){
					
					// check to make sure the token has not expired
					if(strtotime('NOW') < $jwt_decoded->Expires){
						return $jwt_decoded;
					}
					else{
						return NULL;
					}
					
				}
				else{
					return NULL;
				}
			
				// return token
				return $jwt_decoded;
			
			} catch(Exception $e){
				return NULL;
			}
						
		}
		else{
			return NULL;
		}
		
		
    }
    
    // gets content type from extensiont
    public static function GetContentTypeFromExtension($ext){
	    
	    // default
	    $default = 'application/octet-stream';   
	    
	    // known
	    $map = array(
            'pdf'   => 'application/pdf',
            'zip'   => 'application/zip',
            'gif'   => 'image/gif',
            'jpg'   => 'image/jpeg',
            'png'   => 'image/png',
            'svg'	=> 'image/svg+xml',
            'css'   => 'text/css',
            'html'  => 'text/html',
            'js'   	=> 'text/javascript',
            'txt'   => 'text/plain',
            'xml'   => 'text/xml',
        );
	    
	    // return content-type
		if(isset($map[$ext])){
            return $map[$ext];
        }
        else{
	        return $default;
        }
	 	
    }
    
    // handles response from the API
    public static function SendHTTPResponse($code, $text = '', $type = 'text/html'){
	    
	    // set response code
	    http_response_code($code);  
	    
	    // set type
     	header($type);
     	
     	// set text if provided
     	if($text != ''){
	     	print $text;
     	}
     	
     	exit();
    }

}
	
?>