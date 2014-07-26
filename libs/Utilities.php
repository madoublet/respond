<?php
	
class Utilities
{
	// sets a language for the app
	public static function SetLanguage($language, $directory = 'locale'){
	
		// convert language to PHP format, if needed (e.g. en-gb -> en_GB)
		if(strpos($language, '-') !== FALSE){
			$arr = explode('-', $language);
			$language = strtolower($arr[0]).'_'.strtoupper($arr[1]);
		}
	
		$domain = 'messages';
	
		putenv('LANG='.$language); 
		setlocale(LC_ALL, $language.'.UTF-8', $language, 'en');  // first we try UTF-8, if not, normal language code
		
		// set text domain
		bindtextdomain($domain, $directory); 
		bind_textdomain_codeset($domain, 'UTF-8');
		
		textdomain($domain);
	}
	
	// determines the user's preferred language, ref: http://www.php.net/manual/en/function.http-negotiate-language.php
	public static function GetPreferredLanguage($available_languages, $default_language = 'en') { 
	
		if(count($available_languages) == 0){
			return $default_language;
		}
    	
    	// if $http_accept_language was left out, read it from the HTTP-Header 
	    $http_accept_language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : ''; 


	    preg_match_all("/([[:alpha:]]{1,8})(-([[:alpha:]|-]{1,8}))?" . 
	                   "(\s*;\s*q\s*=\s*(1\.0{0,3}|0\.\d{0,3}))?\s*(,|$)/i", 
	                   $http_accept_language, $hits, PREG_SET_ORDER); 
	
	    // default language (in case of no hits) is the first in the array 
	    $bestlang = $available_languages[0]; 
	    $bestqval = 0; 
	
	    foreach ($hits as $arr) { 
	        // read data from the array of this hit 
	        $langprefix = strtolower ($arr[1]); 
	        if (!empty($arr[3])) { 
	            $langrange = strtolower ($arr[3]); 
	            $language = $langprefix . "-" . $langrange; 
	        } 
	        else $language = $langprefix; 
	        $qvalue = 1.0; 
	        if (!empty($arr[5])) $qvalue = floatval($arr[5]); 
	      
	        // find q-maximal language  
	        if (in_array($language,$available_languages) && ($qvalue > $bestqval)) { 
	            $bestlang = $language; 
	            $bestqval = $qvalue; 
	        } 
	        // if no direct hit, try the prefix only but decrease q-value by 10% (as http_negotiate_language does) 
	        else if (in_array($langprefix,$available_languages) && (($qvalue*0.9) > $bestqval)) { 
	            $bestlang = $langprefix; 
	            $bestqval = $qvalue*0.9; 
	        } 
	    } 

		// returns the bestlang
	    return $bestlang;    
	} 
	
	// determines the user's preferred language,
	public static function GetSupportedLanguages($rootPrefix){
		
		$directories = glob($rootPrefix.'locale/*' , GLOB_ONLYDIR);
		$languages = array();
		
		if(is_array($directories)){
		
			foreach ($directories as &$value) {
			    $language = str_replace($rootPrefix.'locale/', '', $value);
			    $language = str_replace('_', '-', $language);
			    $language = strtolower($language);
			    
			    array_push($languages, $language);
			}
			
		}
		
		return $languages;
	}

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
              '<title>'.$site['Name'].' - '.$pageType['TypeP'].'</title>'.
              '<link>http://'.$site['Domain'].'</link>'.
              '<description></description>'.
              '<language>en-us</language>'.
              '<copyright>Copyright (C) '.date('Y').' '.$site['Domain'].'</copyright>';
        
        foreach ($list as $row){
            
            $u = (strtotime($row['Created'])+$offset);
          
            $rss = $rss.'<item>'.
                   '<title>'.$row['Name'].'</title>'.
                   '<description><![CDATA['.$row['Description'].']]></description>'.
                   '<link>http://'.$site['Domain'].'/'.strtolower($pageType['FriendlyId']).'/'.strtolower($row['FriendlyId']).'</link>'.
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
          
          if($row['PageTypeId']==-1){
            
            $xml = $xml.'<url>'.
                       '<loc>http://'.$site['Domain'].'/</loc>'.
                       '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                     '<priority>1.0</priority>'.
                       '</url>';
            
          }
          else{
            $xml = $xml.'<url>'.
                       '<loc>http://'.$site['Domain'].'/'.strtolower($pageType['FriendlyId']).'/'.strtolower($row['FriendlyId']).'</loc>'.
                       '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                     '<priority>0.5</priority>'.
                       '</url>';
          }
        }
        
        $xml = $xml.'</urlset>';
        
        return $xml;
    }
      
    // generates a page
    public static function GeneratePage($site, $page, $siteurl, $imageurl, $preview, $root = '../'){
        
        $pageTypeId = $page['PageTypeId'];
        $path = '/';
        
        $pageType = null;
        $type = 'preview';
        $isSecure = false;
        
        $pageurl = 'http://'.$site['Domain'];
        
        if($page['PageTypeId']!=-1){
	        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	        $pageurl .= '/'.$pageType['FriendlyId'].'/'.$page['FriendlyId'];
	        
	        // set whether a page is secured based on page type
	        if($pageType['IsSecure']==1){
		        $isSecure = true;
	        }
        }
        else{
	        $pageurl .= '/'.$page['FriendlyId'];
        }
        
        if($page['PageTypeId']!=-1){
            $pageType = PageType::GetByPageTypeId($pageTypeId);
            $type = $pageType['FriendlyId'];
        }
        
        $rootloc = '';
        $commonloc = '../common/';
        $default_url = '';
      
        if($page['PageTypeId']!=-1 || $preview==true){
            $rootloc = '../';
            $commonloc = '../../common/';
            $path = '/'.strtolower($type).'/'.strtolower($page['FriendlyId']);
            $default_url = $path;
        }
        else{
	        $path = '/'.strtolower($page['FriendlyId']);
        }
                  
        $siteId = $site['SiteId'];
        $timezone = $site['TimeZone'];
        $siteUniqId = $site['SiteUniqId'];
        
        $siteName = $site['Name'];
        $theme = $site['Theme'];
        $analyticsId = $site['AnalyticsId'];
 
        $htmlDir = $root.'sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/';
        $htmlFile = $htmlDir.$page['Layout'].'.html';
        $content = '{{content}}';
    
        if(file_exists($htmlFile)){
            $content = file_get_contents($htmlFile);
            
            if($content==''){
                $content = '{{content}}';
            }
        }
    
		// translations
		$content = str_replace('{{t}}', '<?php print _("', $content);
		$content = str_replace('{{/t}}', '"); ?>', $content);
    
        // global constants
        $content = str_replace('{{root}}', $rootloc, $content);
        $content = str_replace('{{site}}', $site['Name'], $content);
        $content = str_replace('{{site-url}}', '//'.$site['Domain'], $content);
        $content = str_replace('{{page-url}}', $pageurl, $content);
        $content = str_replace('{{logo}}', $rootloc.'files/'.$site['LogoUrl'], $content);
        $content = str_replace('{{resources}}', $rootloc.'themes/'.$site['Theme'].'/resources/', $content);
        
        // icons
        $relative_icon_url = $rootloc.'files/'.$site['IconUrl'];
        $abs_icon_url = 'http://'.$site['Domain'].'/files/'.$site['IconUrl'];
        
        // icon urls
        $content = str_replace('{{icon}}', $relative_icon_url, $content);
        $content = str_replace('{{icon-abs}}', $abs_icon_url, $content);
        
        // favicon
        $content = str_replace('{{favicon}}', '<link rel="icon" href="'.$relative_icon_url.'">', $content);
        
        // tile
        $tile_html = '<meta name="msapplication-TileColor" content="'.$site['IconBg'].'">'.PHP_EOL.
        			 '<meta name="msapplication-TileImage" content="'.$relative_icon_url.'">';
        			 
        $content = str_replace('{{tileicon}}', $tile_html, $content);
        
        // touch icon
        $content = str_replace('{{touchicon}}', '<link rel="apple-touch-icon" href="'.$relative_icon_url.'">', $content);
        
        // replace with constants
        $content = str_replace('{{id}}', $page['FriendlyId'], $content);
        $content = str_replace('{{type}}', $type, $content);
        $content = str_replace('{{name}}', $page['Name'], $content);
        $content = str_replace('{{description}}', $page['Description'], $content);
        $content = str_replace('{{synopsis}}', substr(strip_tags(html_entity_decode($page['Description'])), 0, 200), $content);
        $content = str_replace('{{keywords}}', $page['Keywords'], $content);
        $content = str_replace('{{callout}}', $page['Callout'], $content);
        
        // facebook
        $content = str_replace('{{facebook-appid}}', $site['FacebookAppId'], $content);
        $content = str_replace('{{facebook-meta-appid}}', '<meta property="fb:app_id" content="'.$site['FacebookAppId'].'">', $content);
        
        // replace with php
        $content = str_replace('{{language}}', '<?php print $language; ?>', $content);
        
        $local = new DateTimeZone($site['TimeZone']);
		// create a friendly date
        $date = DateTime::createFromFormat('Y-m-d H:i:s', $page['LastModifiedDate']);
		$date->setTimezone($local);
		$readable = $date->format('D, M d y h:i a');
		
		$content = str_replace('{{date}}', $readable, $content);
		
        // create a friendly event date
        $eventBeginDate = DateTime::createFromFormat('Y-m-d H:i:s', $page['BeginDate']);
		if($eventBeginDate!=null)
		{
			$eventBeginDate->setTimezone($local);
			$readable = $eventBeginDate->format('D, M d y h:i a');
			
			$content = str_replace('{{event-begin-date}}', $readable, $content);		
		}
		
		// get the author
		$user = User::GetByUserId($page['LastModifiedBy']);
		$author = '';
		$photo = '';
		
		if($user!=null){
			$author = $user['FirstName'].' '.$user['LastName'];
			
			if($user['PhotoUrl'] != NULL && $user['PhotoUrl']!= ''){
				$photo = '<span class="photo" style="background-image: url('.$rootloc.'files/'.$user['PhotoUrl'].')"></span>';
			}
		}
		
		$content = str_replace('{{author}}', $author, $content);
		$content = str_replace('{{photo}}', $photo, $content);
        
        // menus
        $delimiter = '#';
		$startTag = '{{menu-';
		$endTag = '}}';
		$regex = $delimiter . preg_quote($startTag, $delimiter) 
		                    . '(.*?)' 
		                    . preg_quote($endTag, $delimiter) 
		                    . $delimiter 
		                    . 's';
		
		preg_match_all($regex, $content, $matches);
		
		foreach($matches[1] as &$value) {
		    
		    $menuItems = MenuItem::GetMenuItemsForType($site['SiteId'], $value);
		    $menu = '';
		    $i = 0;
		    $parent_flag = false;
		    $new_parent = true;
		    
		    foreach($menuItems as $menuItem){
		    	$url = $menuItem['Url'];
		    	$name = $menuItem['Name'];
		    	$css = '';
		    	$cssClass = '';
		    	$active = '';
		    	
		    	if($page['PageId']==$menuItem['PageId']){
			    	$css = 'active';
		    	}
		    
			    $css .= ' '.$menuItem['CssClass'];
		    
				if(trim($css)!=''){
					$cssClass = ' class="'.$css.'"';
				}
			
				// check for new parent
				if(isset($menuItems[$i+1])){
					if($menuItems[$i+1]['IsNested'] == 1 && $new_parent==true){
						$parent_flag = true;
					}
				}
			
				$menu_root = $rootloc;
				
				// check for external links
				if(strpos($url,'http') !== false) {
				    $menu_root = '';
				}
		
				if($new_parent == true && $parent_flag == true){
					$menu .= '<li class="dropdown">';
					$menu .= '<a href="'.$menu_root.$url.'" class="dropdown-toggle" data-toggle="dropdown">'.$menuItem['Name'].' <b class="caret"></b></a>';
					$menu .= '<ul class="dropdown-menu">';
					$new_parent = false;
				}
				else{
			    	$menu .= '<li'.$cssClass.'>';
					$menu .= '<a href="'.$menu_root.$url.'">'.$menuItem['Name'].'</a>';
					$menu .= '</li>';
			    }
			    
			    // end parent
			    if(isset($menuItems[$i+1])){
					if($menuItems[$i+1]['IsNested'] == 0 && $parent_flag==true){
						$menu .= '</ul></li>'; // end parent if next item is not nested
						$parent_flag = false;
						$new_parent = true;
					}
				}
				else{
					if($parent_flag == true){
						$menu .= '</ul></li>'; // end parent if next menu item is null
						$parent_flag = false;
						$new_parent = true;
					}
				}
				
				$i = $i+1;
				
			    
			    
		    }
		    
		    $content = str_replace('{{menu-'.$value.'}}', $menu, $content);
		    
		}
		
		// welcome
		$welcomeFile = $root.'sites/common/modules/welcome.php';
		
		if(file_exists($welcomeFile)){
            $welcome = file_get_contents($welcomeFile);
            
            $content = str_replace('{{welcome}}', $welcome, $content);
        }
		
		// snippets
        $delimiter = '#';
		$startTag = '{{snippet-';
		$endTag = '}}';
		$regex = $delimiter . preg_quote($startTag, $delimiter) 
		                    . '(.*?)' 
		                    . preg_quote($endTag, $delimiter) 
		                    . $delimiter 
		                    . 's';
		
		preg_match_all($regex, $content, $matches);
		
		foreach($matches[1] as &$value) {
		
			if(substr($value, -3)==='-rt'){
		
				$value = substr($value, 0, -3);
		
				$snippet_content = '<?php include "'.$rootloc.'fragments/snippets/'.$value.'.php"; ?>';
				
				$content = str_replace('{{snippet-'.$value.'-rt}}', $snippet_content, $content);
			}
			else{
			    // get snippet
			    $snippet = $root.'sites/'.$site['FriendlyId'].'/fragments/snippets/'.$value.'.php';
			    $snippet_content = '';
			    
			    if(file_exists($snippet)){
		            $snippet_content = file_get_contents($snippet);
		        }
			    
			    $content = str_replace('{{snippet-'.$value.'}}', $snippet_content, $content);
		    }
		    
		}
		
		// custom scripts
        $delimiter = '#';
		$startTag = '{{script-';
		$endTag = '}}';
		$regex = $delimiter . preg_quote($startTag, $delimiter) 
		                    . '(.*?)' 
		                    . preg_quote($endTag, $delimiter) 
		                    . $delimiter 
		                    . 's';
		
		preg_match_all($regex, $content, $matches);
		
		foreach($matches[1] as &$value) {
		    
		    // get snippet
		    $script_url = $rootloc.'js/custom/'.$value.'.js';
		    $script_content = '<script type="text/javascript" src="'.$script_url.'"></script>';
		    
		    $content = str_replace('{{script-'.$value.'}}', $script_content, $content);
		}
		
		// cart
		$cartFile = $root.'sites/common/modules/cart.php';
		$cart = '';
		
		if(file_exists($cartFile)){
            $cart = file_get_contents($cartFile);
            
            $payPalLogoUrl = '';
            
            if($site['PayPalLogoUrl'] != NULL && $site['PayPalLogoUrl'] != ''){
            	$payPalLogoUrl = 'http://'.$site['Domain'].'/files/'.$site['PayPalLogoUrl'];
            }
            
            // fill in the blanks
            $cart = str_replace('{{payPalId}}', $site['PayPalId'], $cart);
            $cart = str_replace('{{payPalLogoUrl}}', $payPalLogoUrl, $cart);
            $cart = str_replace('{{payPalUseSandbox}}', $site['PayPalUseSandbox'], $cart);
            $cart = str_replace('{{currency}}', $site['Currency'], $cart);
            $cart = str_replace('{{weightUnit}}', $site['WeightUnit'], $cart);
            $cart = str_replace('{{taxRate}}', $site['TaxRate'], $cart);
            $cart = str_replace('{{shippingCalculation}}', $site['ShippingCalculation'], $cart);
            $cart = str_replace('{{shippingRate}}', $site['ShippingRate'], $cart);
            $cart = str_replace('{{shippingTiers}}', htmlentities($site['ShippingTiers']), $cart);
		}
		
		$content = str_replace('{{cart}}', $cart, $content);
		$content = str_replace('{{email}}', $site['PrimaryEmail'], $content);
		
		// search
		$searchFile = $root.'sites/common/modules/search.php';
		$search = '';
		
		if(file_exists($searchFile)){
            $search = file_get_contents($searchFile);
		}
		
		// custom scripts
        $delimiter = '#';
		$startTag = '{{search-';
		$endTag = '}}';
		$regex = $delimiter . preg_quote($startTag, $delimiter) 
		                    . '(.*?)' 
		                    . preg_quote($endTag, $delimiter) 
		                    . $delimiter 
		                    . 's';
		
		preg_match_all($regex, $content, $matches);
		
		foreach($matches[1] as &$value) {
		    
		    $search = str_replace('{{id}}', $value, $search);
		    
		    $content = str_replace('{{search-'.$value.'}}', $search, $content);
		}
		
		
		// css
		$css = '';
        
        $stylesheet = $rootloc.'css/'.$page['Stylesheet'].'.css';
        
        ob_start();
        include $root.'sites/common/modules/css.php'; // loads the module
        $css = ob_get_contents(); // get content from module
        ob_end_clean();
		
		$content = str_replace('{{css}}', $css, $content);
        
        // css-bootstrap
        $css = '<link href="'.BOOTSTRAP_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap}}', $css, $content);
        
        // css-bootstrap-amelia
        $css = '<link href="'.BOOTSTRAP_AMELIA_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-amelia}}', $css, $content);
        
        // css-bootstrap-cerulean
        $css = '<link href="'.BOOTSTRAP_CERULEAN_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-cerulean}}', $css, $content);
        
        // css-bootstrap-cosmo
        $css = '<link href="'.BOOTSTRAP_COSMO_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-cosmo}}', $css, $content);
        
        // css-bootstrap-cyborg
        $css = '<link href="'.BOOTSTRAP_CYBORG_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-cyborg}}', $css, $content);
        
        // css-bootstrap-flatly
        $css = '<link href="'.BOOTSTRAP_FLATLY_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-flatly}}', $css, $content);
        
        // css-bootstrap-journal
        $css = '<link href="'.BOOTSTRAP_JOURNAL_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-journal}}', $css, $content);
        
        // css-bootstrap-lumen
        $css = '<link href="'.BOOTSTRAP_LUMEN_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-lumen}}', $css, $content);
        
        // css-bootstrap-readable
        $css = '<link href="'.BOOTSTRAP_READABLE_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-readable}}', $css, $content);
        
        // css-bootstrap-simplex
        $css = '<link href="'.BOOTSTRAP_SIMPLEX_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-simplex}}', $css, $content);
        
        // css-bootstrap-slate
        $css = '<link href="'.BOOTSTRAP_SLATE_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-slate}}', $css, $content);
        
        // css-bootstrap-spacelab
        $css = '<link href="'.BOOTSTRAP_SPACELAB_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-spacelab}}', $css, $content);
        
        // css-bootstrap-superhero
        $css = '<link href="'.BOOTSTRAP_SUPERHERO_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-superhero}}', $css, $content);
        
        // css-bootstrap-united
        $css = '<link href="'.BOOTSTRAP_UNITED_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-united}}', $css, $content);
        
        // css-bootstrap-yeti
        $css = '<link href="'.BOOTSTRAP_YETI_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-yeti}}', $css, $content);
        
        // css-bootstrap-yeti
        $css = '<link href="'.BOOTSTRAP_DARKLY_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-bootstrap-darkly}}', $css, $content);
        
        // css-fontawesome
        $css = '<link href="'.FONTAWESOME_CSS.'" rel="stylesheet">'.PHP_EOL;
        $content = str_replace('{{css-fontawesome}}', $css, $content);
        
        // css-prettify
        $css = '<link href="'.$rootloc.'css/prettify.css" type="text/css" rel="stylesheet" media="screen">';
        $content = str_replace('{{css-prettify}}', $css, $content);
        
        // js
        $js = '';
        
        ob_start();
        include $root.'sites/common/modules/js.php'; // loads the module
        $js = ob_get_contents(); // get content from module
        ob_end_clean();
		
		$content = str_replace('{{js}}', $js, $content);
		
		$js_cart = '<script type="text/javascript" src="'.$rootloc.'js/cartModel.js"></script>'.PHP_EOL;
		
		$content = str_replace('{{js-cart}}', $js_cart, $content);
		
		// analytics
		$analytics = '';
		
		if($site['AnalyticsId']!=''){
			$analytics = '<script type="text/javascript">'.PHP_EOL.
				'var _gaq = _gaq || [];'.PHP_EOL.
				'_gaq.push([\'_setAccount\', \''.$site['AnalyticsId'].'\']);'.PHP_EOL.
				(empty($site['AnalyticsSubdomain']) ? '' : "_gaq.push(['_setDomainName', '".$site['AnalyticsDomain']."']);".PHP_EOL).
				(empty($site['AnalyticsMultidomain']) ? '' : "_gaq.push(['_setAllowLinker', true]);".PHP_EOL).
				'_gaq.push([\'_trackPageview\']);'.PHP_EOL.
				'(function() {'.PHP_EOL.
				'var ga = document.createElement(\'script\'); ga.type = \'text/javascript\'; ga.async = true;'.PHP_EOL.
				'ga.src = (\'https:\' == document.location.protocol ? \'https://ssl\' : \'http://www\') + \'.google-analytics.com/ga.js\';'.PHP_EOL.
				'var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(ga, s);'.PHP_EOL.
				'})();'.PHP_EOL.
				'</script>';
		}
		
		$content = str_replace('{{analytics}}', $analytics, $content);
		
		// rss
		$rss = '';
		
		if($page['Rss']!=''){
		
			$rss_arr = explode(',', $page['Rss']);
		
			$count = count($rss_arr);
	
			for($x=0; $x<$count; $x++){
				$rss_pageType = PageType::GetByFriendlyId($rss_arr[$x], $site['SiteId']);
				if($rss_pageType!=null){
					$rss .= '<link rel="alternate" type="application/rss+xml" title="'.$site['Name'].' - '.$rss_pageType['TypeP'].' RSS Feed" href="'.$rootloc.'data/'.strtolower($rss_pageType['TypeP']).'.xml">'.PHP_EOL;
				}
				
			}
		}
		
		$content = str_replace('{{rss}}', $rss, $content);
		
		// preview content
        $p_content = '';
        $status = 'publish';
    
        if($preview==true){
            $status = 'draft';
        }
    
        $fragment = $root.'sites/'.$site['FriendlyId'].'/fragments/'.$status.'/'.$page['PageUniqId'].'.html';
        
        if(file_exists($fragment)){
          $p_content = file_get_contents($fragment);
        }

		// update images with sites/[name] to a relative URL
        $p_content = str_replace('src="sites/'.$site['FriendlyId'].'/', 'src="'.$rootloc, $p_content);
        
        //content and synopsis
        $content = str_replace('{{content}}', $p_content, $content);
          
        // parses the template to get the html  
        $html = Utilities::ParseHTML($site, $page, $content, $preview, $root);
        
        $pageTypeUniqId = '-1';
    
        if($pageType){
            $pageTypeUniqId = $pageType['PageTypeUniqId'];
        }
        
        if($preview==true){
            $pageTypeUniqId = 'preview';
        }
        
        $pageUrl = ltrim($path,'/');
        
        // setup php header
        $header = '<?php '.PHP_EOL.
        	'$rootPrefix="'.$rootloc.'";'.PHP_EOL.
        	'$formPublicId="'.$site['FormPublicId'].'";'.PHP_EOL.
        	'$pageUrl="'.$pageUrl.'";'.PHP_EOL.
        	'$isSecure='.(($isSecure) ? 'true' : 'false').';'.PHP_EOL.
            '$siteUniqId="'.$site['SiteUniqId'].'";'.PHP_EOL.
            '$siteFriendlyId="'.$site['FriendlyId'].'";'.PHP_EOL.
            '$pageUniqId="'.$page['PageUniqId'].'";'.PHP_EOL.
            '$pageFriendlyId="'.$page['FriendlyId'].'";'.PHP_EOL.
            '$pageTypeUniqId="'.$pageTypeUniqId.'";'.PHP_EOL.
            '$language="'.$site['Language'].'";'.PHP_EOL.
            'include \'../../'.$rootloc.'libs/Utilities.php\';'.PHP_EOL.
            'include \''.$rootloc.'libs/SiteAuthUser.php\';'.PHP_EOL.
            'include \''.$rootloc.'site.php\';'.PHP_EOL;
        
        $header .= '?>';
            
		$api = APP_URL;
        
        $inject = '<body data-siteuniqid="'.$site['SiteUniqId'].'" data-sitefriendlyid="'.$site['FriendlyId'].
        			'" data-domain="'.$site['Domain'].
        			'" data-pageuniqid="'.$page['PageUniqId'].'" data-pagefriendlyid="'.$page['FriendlyId'].
        			'" data-pagetypeuniqid="'.$pageTypeUniqId.'" data-api="'.$api.'"';
        
        $html = str_replace('<body', $inject, $html);
        $html = str_replace('{root}', $rootloc, $html);
        
        return $header.$html;
        
    }
    
    // generates gettext for multi-lingual support for sites
    public static function GenerateGettext($html){
	    $html = str_replace('"', '\\"', $html);
	    
	    if($html == ''){
		    return '';
	    }
	    else{
			return '<?php print _("'.$html.'"); ?>';   
		}
    }
    
    // strips gettext
    public static function StripGettext($html){
	    
	    // remove start php tag
		$html = str_replace('<?php print _("', '', $html);
		
		// remove end php tag
		$html = str_replace('"); ?>', '', $html);
		
		// remove escaped double quotes
		$html = str_replace('\"', '"', $html);
		
		return $html;
	    
    }
    
    // parses the html  
    public static function ParseHTML($site, $page, $content, $preview, $root='../'){
    
        $html = str_get_html($content, true, true, DEFAULT_TARGET_CHARSET, false, DEFAULT_BR_TEXT);
    
        $mapcount = 0;
        $pageId = $page['PageId'];
        
        $rootloc = '';
        $commonloc = '../common/';
        
        // set page url
        $pageurl = 'http://'.$site['Domain'];
        
        if($page['PageTypeId']!=-1){
	        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	        $pageurl .= '/'.$pageType['FriendlyId'].'/'.$page['FriendlyId'];
        }
        else{
	        $pageurl .= '/'.$page['FriendlyId'];
        }
        
        // set root and common locations
        if($page['PageTypeId']!=-1 || $preview==true){
            $rootloc = '../';
            $commonloc = '../../common/';
        }
        
        $css = $rootloc.'css/'.$page['Stylesheet'].'.css';
    
		if($html == null){
			return '';
		}

		// setup gettext blockquote, h1, h2, h3, p, td, th, li, meta tags for multi-lingual support
		foreach($html->find('#content blockquote') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content h1') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content h2') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content h3') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content p') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content td') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content th') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('#content li') as $el){
			$el->innertext = Utilities::GenerateGettext($el->innertext);
		}
		
		foreach($html->find('meta[name=description]') as $el){
			$content = $el->content;
			$el->content = Utilities::GenerateGettext($content);
		}
		
		foreach($html->find('meta[name=keywords]') as $el){
			$content = $el->content;
			$el->content = Utilities::GenerateGettext($content);
		}
		
		foreach($html->find('meta[name=callout]') as $el){
			$content = $el->content;
			$el->content = Utilities::GenerateGettext($content);
		}
			
		// parse module
        foreach($html->find('module') as $el){
          
            if(isset($el->name)){
                $name = $el->name;
            
                if($name=='styles'){
                    $el->outertext = '<link href="'.$css.'" type="text/css" rel="stylesheet" media="screen">'.
                       '<link href="'.BOOTSTRAP_CSS.'" rel="stylesheet">'.
                       '<link href="'.FONTAWESOME_CSS.'" rel="stylesheet">'.
                       '<link href="'.$rootloc.'css/prettify.css" type="text/css" rel="stylesheet" media="screen">';
                }
                else if($name=='header'){
                    ob_start();
                    include $root.'sites/common/modules/header.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
              
                    $el->outertext= $content;
                }
                else if($name=='scripts'){
                    ob_start();
                    include $root.'sites/common/modules/scripts.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
              
                    $el->outertext= $content;
                }
                else if($name=='analytics'){
                    ob_start();
              
                    $webpropertyid = $site['AnalyticsId'];
              
                    include $root.'sites/common/modules/analytics.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
              
                    $el->outertext= $content;
                }
                else if($name=='rss'){
                    ob_start();
              
                    include $root.'sites/common/modules/rss.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='list'){
                
                	$pageTypeUniqId = '';
              
					if(isset($el->type)){
                    	$pageTypeUniqId = $el->type;
                    }

					// translate a friendlyId to a pageTypeUniqId
					if(isset($el->pagetype)){
						$friendlyId = $el->pagetype;
					
						$pageType = PageType::GetByFriendlyId($friendlyId, $site['SiteId']);
						
						$pageTypeUniqId = $pageType['PageTypeUniqId'];
					}
					
					if($pageTypeUniqId != ''){
	                    $label = $el->label;
	                    $isAjax = false;
	                    $pageNo = 1;
	                    $curr = 0;
	                    $listid = $el->id;
	                    $display = $el->display;
	                    $desclength = $el->desclength;
	                    $length = $el->length;
	                    $orderby = $el->orderby;
	                    $category = $el->category;
	                    $pageresults = $el->pageresults;
	                  
	                    if($el->display == 'blog'){
	                      
	                        $list = '';
	        
					        ob_start();
					        include $root.'sites/common/modules/list-blog.php'; // loads the module
					        $list = ob_get_contents(); // get content from module
					        ob_end_clean();
							
	                    }
	                    else if($el->display == 'list'){
	                        $list = '';
	                        
	                        ob_start();
					        include $root.'sites/common/modules/list.php'; // loads the module
					        $list = ob_get_contents(); // get content from module
					        ob_end_clean();
	                        
	                    }
	                    else if($el->display == 'thumbnails'){
	                        $list = '';
	                        
	                        ob_start();
					        include $root.'sites/common/modules/list-thumbnails.php'; // loads the module
					        $list = ob_get_contents(); // get content from module
					        ob_end_clean();
					        
	                    }
	                    else if($el->display == 'calendar'){
	                    	$list = '';
	                        
	                        ob_start();
					        include $root.'sites/common/modules/list-calendar.php'; // loads the module
					        $list = ob_get_contents(); // get content from module
					        ob_end_clean();
	                    }
	                    else if($el->display == 'map'){
	                    	$list = '';
	                    	
	                    	$id = 'map-' + $mapcount;
	                        $cssClass = '';
	                        $zoom = 'auto';
	                        
	                        ob_start();
					        include $root.'sites/common/modules/list-map.php'; // loads the module
					        $list = ob_get_contents(); // get content from module
					        ob_end_clean();
					        
					        $mapcount++;
	                    }
	                    
	                    $el->outertext = $list;
                    }
              
                }
                else if($name=='featured'){
                
					
                    $id = $el->id;
                    $pageName = $el->pagename;
                    
                    $pageUniqId = '';
              
					if(isset($el->pageuniqid)){
                    	$pageUniqId = $el->pageuniqid;
                    }

					// translate a friendlyId to a pageTypeUniqId
					if(isset($el->url)){
						$url = $el->url;
					
						$page = Page::GetByUrl($url, $site['SiteId']);
						
						$pageUniqId = $page['PageUniqId'];
					}
                    
                    $featured = '<div id="'.$id.'" data-pageuniqid="'.$pageUniqId.'" data-pagename="'.$pageName.'" class="featured-content">'.
                    				'<p class="featured-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>'.
									'</div>';  
                    
                    $el->outertext = $featured	;
              
                }
                else if($name=='secure'){
    
                    if(isset($el->type)){
                        $type = $el->type;
                    }
                    else{
                        $type = 'login';
                    }
                    
                    $el->outertext = '<?php include "'.$commonloc.'modules/'.$type.'.php"; ?>';
              
                }
                else if($name=='menu'){
    
                    if(isset($el->type)){
                        $type = $el->type;
                    }
                    else{
                        $type = 'primary';
                    }
                    
                    $el->outertext = '<?php $type="'.$type.'"; include "'.$commonloc.'modules/menu.php"; ?>';
              
                }
                else if($name=='footer'){
                    ob_start();
                    
                    $copy = $el->innertext;
                    
                    include $root.'sites/common/modules/footer.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='slideshow'){
                    $id = $el->id;
                    
                    $display = 'slideshow';
                    
                    if(isset($el->display)){
	                  $display = $el->display;  
                    }
                    
                    $imgList = $el->innertext;
                    
                    ob_start();
                    
                    if($display=='gallery'){
                    	include $root.'sites/common/modules/gallery.php'; // loads the module
                    }
                    else{
	                    include $root.'sites/common/modules/slideshow.php'; // loads the module
                    }
                    
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='html'){
                	$h = $el->innertext;
               
                    $el->outertext = $h;
                }
                else if($name=='youtube' || $name=='vimeo'){
                    $el->outertext= $el->innertext;
                }
                else if($name=='file'){
                    $file = $el->file;
                    $description = $el->description;
                    ob_start();
                    include $root.'sites/common/modules/file.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='form'){
                
                	$formId = 'form-0';
					
					if(isset($el->id)){
	                	$formId = $el->id;
                	}
                
					$type = 'default';
					
                	if(isset($el->type)){
	                	$type = $el->type;
                	}
                
                	$action = '';
                
                	if(isset($el->action)){
	                	$action = $el->action;
                	}
                	
                	$successMessage = '';
                
                	if(isset($el->success)){
	                	$successMessage = $el->success;
                	}
                	
                	$errorMessage = '';
                
                	if(isset($el->error)){
	                	$errorMessage = $el->error;
                	}
                	
                	$submitText = '';
                
                	if(isset($el->submit)){
	                	$submitText = $el->submit;
                	}
                
                	// place gettext around labels
                	foreach($el->find('label') as $el_label){
                	
                		if(count($el_label->find('input')) > 0){ // generate gettext for radios, checkboxes
                			$input_arr = $el_label->find('input');
							$input_txt = $input_arr[0]->outertext;
                			$text = str_replace($input_txt, '', $el_label->innertext); // replace input text
	                		$el_label->innertext = $input_txt.Utilities::GenerateGettext($text);
                		}
						else{
                			$el_label->innertext = Utilities::GenerateGettext($el_label->innertext);
                		}
					}
					
					// place gettext around spans
                	foreach($el->find('.help-block') as $el_block){
						$el_block->innertext = Utilities::GenerateGettext($el_block->innertext);
					}

					if (strpos($el->innertext, '{{reCaptcha}}')>0) {
						$replace = '<?php require_once(\''.$root.'libs/recaptchalib.php\'); echo recaptcha_get_html("'.$site['FormPublicId'].'");?>';
						$el->innertext = str_replace('{{reCaptcha}}', $replace, $el->innertext);
					}

                    $form = $el->innertext;
                    ob_start();
                    include $root.'sites/common/modules/form.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='map'){
                    $address = $el->address;
                    
                    if(isset($el->zoom)){
                    	$zoom = $el->zoom;
                    }
                    else{
	                    $zoom = 'auto';
                    }
                    
                    if(isset($el->id)){
                    	$id = $el->id;
                    }
                    else{
	                    $id = 'map-' + $mapcount;
                    }
                    
                    if(isset($el->class)){
                    	$cssClass = $el->class;
                    }
                    else{
	                    $cssClass = '';
                    }
                    
                    ob_start();
                    include $root.'sites/common/modules/map.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                    
                    $mapcount++;
                }
                else if($name=='like'){
                    $username = $el->username;
                    ob_start();
                    include $root.'sites/common/modules/like.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='comments'){
                    ob_start();
                    include $root.'sites/common/modules/comments.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='byline'){
                    ob_start();
                    include $root.'sites/common/modules/byline.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
				else if($name=='shelf'){
				
					// place gettext around descripton
                	foreach($el->find('.shelf-description') as $el_label){
						$el_label->innertext = Utilities::GenerateGettext($el_label->innertext);
					}
					
					// place gettext around shipping
                	foreach($el->find('.shelf-shipping') as $el_label){
						$el_label->innertext = Utilities::GenerateGettext($el_label->innertext);
					}
					
					// place gettext around add to cart button
                	foreach($el->find('.btn span') as $el_label){
						$el_label->innertext = Utilities::GenerateGettext($el_label->innertext);
					}
				
					$shelfId = $el->id;
					$shelf = $el->innertext;
					ob_start();
					include $root.'sites/common/modules/shelf.php'; // loads the module
					$content = ob_get_contents(); // holds the content
					ob_end_clean();
					
					$el->outertext= $content;
				}
                
                else{ 
                    // do nothing
                }
            
            }
        }
    
        foreach($html->find('plugin') as $el){
    
            $attrs = $el->attr;
    
            $p_vars = '';
            
            foreach($attrs as $key => &$val){
                ${$key} = $val; // set variable
    
                $p_vars .= '$'.$key.'="'.$val.'";';
            }
    
            $id = $el->id;
            $name = $el->name;
          
            if($render=='publish'){
                ob_start();
                include $root.'plugins/'.$type.'/render.php'; // loads the module
                $content = ob_get_contents(); // holds the content
                ob_end_clean();
                
                $el->outertext= $content;
            }
            else if($render=='runtime'){
                $list = '<?php '.
                    $p_vars.
                    'include "'.$rootloc.'plugins/'.$type.'/render.php"; ?>';
                
                $el->outertext = $list;
            }
    
        }
        
        return $html;
    }
    
    // generate a search index for a language
    public static function BuildSearchIndex($site, $page, $language, $isDefaultLanguage, $content, $root = '../'){
    
        $html = str_get_html($content, true, true, DEFAULT_TARGET_CHARSET, false, DEFAULT_BR_TEXT);
    
		$url = $page['FriendlyId'];
		$isSecure = 0;
		$image = $page['Image'];
        
        if($page['PageTypeId']!=-1){
	        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	        $url = $pageType['FriendlyId'].'/'.$page['FriendlyId'];
	        
	        if($pageType['IsSecure'] == 1){
	        	$isSecure = 1;
	        }
        }
        
        if($isDefaultLanguage == false){
	        // set language to the domain for the site
        	$domain = $root.'sites/'.$site['FriendlyId'].'/locale';
			
			// set the language
			Utilities::SetLanguage($language, $domain);
        }
        
        $name = $page['Name'];
        $text = '';
        $h1s = '';
        $h2s = '';
        $h3s = '';
        $description = $page['Description'];
        
        if($isDefaultLanguage == false){
			$name = _($name);  // get translated version
			$description = _($description);
		}
		
		if($html == null){
			return '';
		}
        
		// setup gettext blockquote, h1, h2, h3, p, td, th, li, meta tags for multi-lingual support
		foreach($html->find('blockquote') as $el){
			if($isDefaultLanguage == false){
				$text .= _($el->innertext).' ';  // get translated version
			}
			else{
				$text .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('h1') as $el){
			if($isDefaultLanguage == false){
				$h1s .= _($el->innertext).' ';  // get translated version
			}
			else{
				$h1s .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('h2') as $el){
			if($isDefaultLanguage == false){
				$h2s .= _($el->innertext).' ';  // get translated version
			}
			else{
				$h2s .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('h3') as $el){
			if($isDefaultLanguage == false){
				$h3s .= _($el->innertext).' ';  // get translated version
			}
			else{
				$h3s .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('p') as $el){
			if($isDefaultLanguage == false){
				$text .= _($el->innertext).' ';  // get translated version
			}
			else{
				$text .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('td') as $el){
			if($isDefaultLanguage == false){
				$text .= _($el->innertext).' ';  // get translated version
			}
			else{
				$text .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('th') as $el){
			if($isDefaultLanguage == false){
				$text .= _($el->innertext).' ';  // get translated version
			}
			else{
				$text .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('li') as $el){
			if($isDefaultLanguage == false){
				$text .= _($el->innertext).' ';  // get translated version
			}
			else{
				$text .= $el->innertext.' ';
			}
		}
		
		foreach($html->find('meta[name=description]') as $el){
			if($isDefaultLanguage == false){
				$description = _($el->innertext);  // get translated version
			}
			else{
				$description = $el->innertext;
			}
		}
		
		// strip any html
		$h1s = strip_tags($h1s);
		$h2s = strip_tags($h2s);
		$h3s = strip_tags($h3s);
		$description = strip_tags($description);
		$text = strip_tags($text);
		
		// add to search index
		SearchIndex::Add($page['PageUniqId'], $site['SiteUniqId'], $language, $url, $name, $image, $isSecure, $h1s, $h2s, $h3s, $description, $text);
		
    }
    
    // send welcome email
    public static function SendEmailFromFile($to, $from, $fromName, $subject, $replace, $file, $root='../'){
    
    
    	$full_file = $root.$file;
	    
	    if(file_exists($full_file)){
            $content = file_get_contents($full_file);
            
            // walk through and replace values in associative array
            foreach ($replace as $key => &$value) {
			    
			    $content = str_replace($key, $value, $content);
			    $subject = str_replace($key, $value, $subject);
			    
			}
			
			Utilities::SendEmail($to, $from, $fromName, $subject, $content);
            
        }
	    
	    
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
		
		}
		
		$mail->From = $from;
		$mail->FromName = $fromName;
		$mail->addAddress($to, '');
		$mail->isHTML(true);
		
		$mail->Subject = $subject;
		$mail->Body    = html_entity_decode($content);
    
		if(!$mail->send()) {
		   return true;
		}
		
		return false;    
		
    }
    
    // searches an associative array for a value
    public static function SearchForId($id, $param, $array){
	   foreach ($array as $key => $val) {
	       if ($val[$param] === $id) {
	           return $key;
	       }
	   }
	   return null;
	}
    
    // checks permissions, $canAction = $canView, $canEdit, $canPublish, $canRemove, $canCreate
    public static function CanPerformAction($pageTypeUniqId, $canAction){
    
    	// trim
    	$canAction = trim($canAction);
	    
	    // set -1 to root (if applicable)
	    if($pageTypeUniqId === '-1' || $pageTypeUniqId === -1){
		    $pageTypeUniqId = 'root';
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
	    if(strpos($canAction, $pageTypeUniqId) !== FALSE){
		    return true;
	    }
	    else{
		    return false;
	    }
	    
	    
    }

}
	
?>