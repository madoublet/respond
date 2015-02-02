<?php 

class Publish
{

	// publishes the entire site
	public static function PublishSite($siteId){
		
		// publish sitemap
		Publish::PublishSiteMap($siteId);
		
		// publish all pages
		Publish::PublishAllPages($siteId);

		// publish rss for page types
		Publish::PublishRssForPageTypes($siteId);
		
		// publish menu
		Publish::PublishMenuJSON($siteId);
		
		// publish site json
		Publish::PublishSiteJSON($siteId);
		
		// publish common js (also combines JS and publishes plugins)
		Publish::PublishCommonJS($siteId);
		
		// publish common css
		Publish::PublishCommonCSS($siteId);
		
		// publish controller
		Publish::PublishCommon($siteId);
		
		// publish all CSS
		Publish::PublishAllCSS($siteId);
		
		// publish locales
		Publish::PublishLocales($siteId);
		
	}
	
	// publishes common site files
	public static function PublishCommon($siteId){
        
        $site = Site::GetBySiteId($siteId);
      	
		// copy templates/respond
		$templates_src = APP_LOCATION.'/site/templates/respond';
		$templates_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/templates/respond';
		
		// create libs directory if it does not exist
		if(!file_exists($templates_dest)){
			mkdir($templates_dest, 0755, true);	
		}
		
		// copy libs directory
		if(file_exists($templates_dest)){
			Utilities::CopyDirectory($templates_src, $templates_dest);
		}
		
		// setup htaccess
		Publish::SetupHtaccess($site);
		
	}
	
	// publishes locales for the site
	public static function PublishLocales($siteId){
        
        $site = Site::GetBySiteId($siteId);
      	
		// copy templates/respond
		$locales_src = APP_LOCATION.'/site/locales';
		$locales_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/locales';
		
		// create libs directory if it does not exist
		if(!file_exists($locales_dest)){
			mkdir($locales_dest, 0755, true);	
			
			Utilities::CopyDirectory($locales_src, $locales_dest);
		}
		
	}
	
	// creates .htaccess to deny access to a specific directory
	public static function CreateDeny($dir){
		
		// create dir if needed
		if(!file_exists($dir)){
			mkdir($dir, 0755, true);	
		}
		
		// create .htaccess to deny access
		$deny = $dir.'.htaccess';

		file_put_contents($deny, 'Deny from all'); // save to file	
		
	}
	
	// creates .htaccess for html5 sites
	public static function SetupHtaccess($site){
	
		$htaccess = SITES_LOCATION.'/'.$site['FriendlyId'].'/.htaccess';
	
		if($site['UrlMode'] == 'html5'){
			
			$contents = 'Options -Indexes'.PHP_EOL.
				'RewriteEngine On'.PHP_EOL.
				'RewriteCond %{REQUEST_FILENAME} !-f'.PHP_EOL.
				'RewriteCond %{REQUEST_FILENAME} !-d'.PHP_EOL.
				'RewriteCond %{REQUEST_URI} !.*\.(css¦js|html|png)'.PHP_EOL.
				'RewriteRule (.*) index.html [L]';
			

			file_put_contents($htaccess, $contents); // save to file			
		}
		else if($site['UrlMode'] == 'static'){
						
			$contents = 'Options -Indexes'.PHP_EOL.
				'<IfModule mod_rewrite.c>'.PHP_EOL.
				'RewriteEngine On'.PHP_EOL.
				'RewriteCond %{REQUEST_FILENAME} !-f'.PHP_EOL.
				'RewriteRule ^([^\.]+)$ $1.html [NC,L]'.PHP_EOL.
				'</IfModule>'.PHP_EOL.
				'<IfModule mod_expires.c>'.PHP_EOL.
				'ExpiresActive On '.PHP_EOL.
				'ExpiresDefault "access plus 1 month"'.PHP_EOL.
				'ExpiresByType image/x-icon "access plus 1 year"'.PHP_EOL.
				'ExpiresByType image/gif "access plus 1 month"'.PHP_EOL.
				'ExpiresByType image/png "access plus 1 month"'.PHP_EOL.
				'ExpiresByType image/jpg "access plus 1 month"'.PHP_EOL.
				'ExpiresByType image/jpeg "access plus 1 month"'.PHP_EOL.
				'ExpiresByType text/css "access 1 month"'.PHP_EOL.
				'ExpiresByType application/javascript "access plus 1 year"'.PHP_EOL.
				'</IfModule>';	
			
			file_put_contents($htaccess, $contents); // save to file
		}
		
	}
	
	// publishes default content for a theme
	public static function PublishDefaultContent($site, $theme, $userId){
		
		// read the defaults file
        $default_json_file = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/default.json';
        
        // set $siteId
        $siteId = $site['SiteId'];
        
        // check to make sure the defaults.json exists
        if(file_exists($default_json_file)){
			
			// get json from the file
			$json_text = file_get_contents($default_json_file);
			
			// decode json
			$json = json_decode($json_text, true);
			
			// pagetypes
			$pagetypes = array();
			
			// menu counts
			$primaryMenuCount = 0;
			$footerMenuCount = 0;
			
			// clear default types
			MenuItem::RemoveForType('primary', $siteId);
			MenuItem::RemoveForType('footer', $siteId);
			
			// walk through defaults array
			foreach($json as &$value){
			
				// get values from array
				$url = $value['url'];
				$source = $value['source'];
				$name = $value['name'];
				$description = $value['description'];
				$layout = $value['layout'];
				$stylesheet = $value['stylesheet'];
				$primaryMenu = $value['primaryMenu'];
				$footerMenu = $value['footerMenu'];
				
				// initialize PT
				$pageType = NULL;
				
				if(strpos($url, '/') !== false){ // the url has a pagetype
					$arr = explode('/', $url);
					
					// get friendly ids from $url
					$pageTypeFriendlyId = $arr[0];
					$pageFriendlyId = $arr[1];
					
					$pageTypeId = -1;
					
					$pageType = PageType::GetByFriendlyId($pageTypeFriendlyId, $siteId);
					
					// create a new pagetype
					if($pageType == NULL){
						$pageType = PageType::Add($pageTypeFriendlyId, $layout, $stylesheet, 0, $siteId, $userId);
					}
					
					// get newly minted page type
					$pageTypeId = $pageType['PageTypeId'];
				
				}
				else{ // root, no pagetype
					$pageFriendlyId = $url;
					$pageTypeId = -1;
				}
				
				// determine if page is unique
				$isUnique = Page::IsFriendlyIdUnique($pageFriendlyId, $pageTypeId, $site['SiteId']);
				
				// initialize page
				$page = NULL;
				
				// if page has not been created, create a page
				if($isUnique == true){
				
					// create a page
					$page = Page::Add($pageFriendlyId, $name, $description, 
										$layout, $stylesheet, $pageTypeId, $site['SiteId'], $userId);
										
				}
				else{
					
					// get the page
					$page = Page::GetByFriendlyId($pageFriendlyId, $pageTypeId, $site['SiteId']);
					
				}						
			
				// quick check
				if($page != NULL){
			
					// set the page to active							
					Page::SetIsActive($page['PageId'], 1);
					
					// build the content file
					$filename = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/'.$source;
					$content = '';
					
					// get the content for the page
					if(file_exists($filename)){
		    			$content = file_get_contents($filename);
		    			
		    			// fix images
		    			$content = str_replace('{{site-dir}}', $site['Domain'], $content);
		    		}
					
					// edit the page content
					Page::EditContent($page['PageId'], $content, $userId);
					
					// build the primary menu
					if($primaryMenu == true){
						MenuItem::Add($name, '', 'primary', $url, $page['PageId'], 
										$primaryMenuCount, $site['SiteId'], $userId);
										
						$primaryMenuCount++;
						
					}
					
					// build the footer menu
					if($footerMenu == true){
						MenuItem::Add($name, '', 'footer', $url, $page['PageId'], 
										$footerMenuCount, $site['SiteId'], $userId);
										
						$footerMenuCount++;
					}
					
				}
			
			}
		
		}
		
		
	}

	// publishes a theme
	public static function PublishTheme($site, $theme){

		$theme_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/';
		
		// create theme directory
		if(!file_exists($theme_dir)){
			mkdir($theme_dir, 0755, true);	
		}
		
		// create directory for theme
		$theme_dir .= $theme .'/';
		
		if(!file_exists($theme_dir)){
			mkdir($theme_dir, 0755, true);	
		}
		
		// create directory for layouts
		$layouts_dir = $theme_dir.'layouts/';
		
		if(!file_exists($layouts_dir)){
			mkdir($layouts_dir, 0755, true);	
		}
		
		// create directory for styles
		$styles_dir = $theme_dir.'styles/';
		
		if(!file_exists($styles_dir)){
			mkdir($styles_dir, 0755, true);	
		}
		
		// create directory for resources
		$res_dir = $theme_dir.'resources/';
		
		if(!file_exists($res_dir)){
			mkdir($res_dir, 0755, true);	
		}
		
		// copy layouts
		$layouts_src = APP_LOCATION.'/'.THEMES_FOLDER.'/'.$theme.'/layouts/';
		
		if(file_exists($layouts_src)){
			$layouts_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$theme.'/layouts/';

			Utilities::CopyDirectory($layouts_src, $layouts_dest);
		}
		
		
		// copy the index from the layouts
		$index_src = $theme_dir.'/layouts/index.html';
		$index_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/index.html';
		
		if(file_exists($index_src)){
			copy($index_src, $index_dest);
		}
		
		// copy styles
		$styles_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/styles/';
		
		if(file_exists($styles_src)){
			$styles_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$theme.'/styles/';
		
			Utilities::CopyDirectory($styles_src, $styles_dest);
		}
		
		// copy the configure.json file
		$configure_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/configure.json';
		$configure_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$theme.'/configure.json';
		
		if(file_exists($configure_src)){
			copy($configure_src, $configure_dest);
		}
		
		// copy files
		if(FILES_ON_S3 == true){  // copy files to S3
		
			$files_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/files';
			
			// deploy directory to S3
			S3::DeployDirectory($site, $files_src, 'files/');
		
		}
		else{ // copy files locally
			$files_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/files/';
			
			if(file_exists($files_src)){
				$files_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/files/';
	
				Utilities::CopyDirectory($files_src, $files_dest);
			}
		}
		
		// copy resources
		$res_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/resources/';
		
		if(file_exists($res_src)){
			$res_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$theme.'/resources/';
		
			Utilities::CopyDirectory($res_src, $res_dest);
		}
		
	}
	
	// publishes common js
	public static function PublishCommonJS($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		$src = APP_LOCATION.'/site/js';
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/js';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
		
		if($site['UrlMode'] == 'static'){
		
			// get static version of respond.site.js
			$src_file = APP_LOCATION.'/site/js/static/respond.site.js';
			$dest_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/respond.site.js';
			
			$content = file_get_contents($src_file);
            
            // get language
            $language = $site['Language'];
            
            // set language
            $content = str_replace('{{language}}', $language, $content);

			// update site file
			file_put_contents($dest_file, $content);
		
			// inject controllers
			Publish::InjectControllers($site);
		}
		else{
			// inject states
			Publish::InjectStates($site);
		}
		
		// publish plugins
		Publish::PublishPlugins($site);
		
		// combine JS
		Publish::CombineJS($site);
		
	}
	
	// combines JS files
	public static function CombineJS($site){
		
		// combine JS
		$js_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';
		
		//get all image files with a .less ext
		$files = glob($js_dir . "*.js");
		
		// combined js
		$combined_js = '';

		// walk through file names
		foreach($files as $file){
		
			if(strpos($file, 'respond.min') === FALSE){
			 	if(file_exists($file)){
			    	$content = file_get_contents($file);
			    
			    	$combined_js .= $content;	
				}
			}
		   
		}
		
		// remove comments
		$pattern = '/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/';
		$combined_js = preg_replace($pattern, '', $combined_js);
		
		// remove whitespace
		//$combined_js = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $combined_js);
		$combined_js = str_replace(array("\t", '  ', '    ', '    '), '', $combined_js);

		// publish combined js
	    $combined_js_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/respond.min.js';
	    
	    // put combined js
	    file_put_contents($combined_js_file, $combined_js);
		
	}
	
	// publishes plugins for the site
	public static function PublishPlugins($site){
		
		// open plugins direcotry
        if($handle = opendir(APP_LOCATION.'plugins')){
        
		    $blacklist = array('.', '..');
		    
		    // holds all directives to be added
		    $directives = '';
		    
		    // holds all css to be included
		    $css = '';
		    
		    // walk through directories
		    while (false !== ($file = readdir($handle))) {
		    
		        if (!in_array($file, $blacklist)) {
		            $dir = $file;
		            
		            // get directives to be added
		            $directive = APP_LOCATION.'plugins/'.$dir.'/publish/directive.js';
		            
		            if(file_exists($directive)){
		            	$content = file_get_contents($directive);
		            	$directives .= $content;
		            }
		            
		            // get css to be added
		            $styles = APP_LOCATION.'plugins/'.$dir.'/publish/styles.css';
		            
		            if(file_exists($styles)){
		            	$content = file_get_contents($styles);
		            	$css .= $content;
		            }
		            
		            // source templates directory
		            $src_dir = APP_LOCATION.'plugins/'.$dir.'/publish/templates';
		            
		            // add templates
		            if(file_exists($src_dir)){
		            
		            	// destination templates directory
		            	$dest_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/templates/'.$dir;
		            
						// create template directory
						if(!file_exists($dest_dir)){
							mkdir($dest_dir, 0755, true);	
						}
						
						// copies a directory
						Utilities::CopyDirectory($src_dir, $dest_dir);
		            }
		            
		            // source resources directory
		            $src_rsc_dir = APP_LOCATION.'plugins/'.$dir.'/publish/resources';
		            
		            // add templates
		            if(file_exists($src_dir)){
		            
		            	// destination templates directory
		            	$dest_rsc_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/plugins';
		            
						// create plugins directory
						if(!file_exists($dest_rsc_dir)){
							mkdir($dest_rsc_dir, 0755, true);	
						}
						
						$dest_rsc_dir = $dest_rsc_dir.'/'.$dir;
						
						// create plugin directory
						if(!file_exists($dest_rsc_dir)){
							mkdir($dest_rsc_dir, 0755, true);	
						}
						
						// copies a directory
						Utilities::CopyDirectory($src_rsc_dir, $dest_rsc_dir);
		            }
		            
		            
		        }
		        
		    }
		    
		    closedir($handle);
		}
		
		// replace directives
		if($directives != ''){
		
			// get directive
			$directive_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/respond.site.directives.js';
			
			if(file_exists($directive_file)){
			
				// get directives
				$content = file_get_contents($directive_file);
				
				// add new directives
				$content = str_replace('// #published-directives', $directives, $content);
				
				// update file
				file_put_contents($directive_file, $content);
				
			}
			
		}
		
		// add styles
		if($css != ''){
		
			// get plugins
			$plugins_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/css/plugins.css';
			
			// update file
			file_put_contents($plugins_file, $css);
			
		}
				
	}
	
	// injects states into sites/js/respond.site.js
	public static function InjectStates($site){
		
		// inject routes
		$pages = Page::GetPagesForSite($site['SiteId'], true);
		$states = '';
		
		// walk through pages
		foreach($pages as $page){
		
			$state = $page['FriendlyId'];
			$isSecure = 'false';
		
			// defaults
			$url = '/'.$page['FriendlyId'];
			$templateUrl = 'themes/'.$site['Theme'].'/layouts/'.$page['Layout'].'.html';
			
			// check for page type
			if($page['PageTypeId'] != -1){
				$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
				
				if($pageType != NULL){
					$state = $pageType['FriendlyId'].'/'.$page['FriendlyId'];
					$url = '/'.$pageType['FriendlyId'].'/'.$page['FriendlyId'];
					
					if($pageType['IsSecure'] == 1){
						$isSecure = 'true';
					}
				}
			}
			
			// strip the first / for the pageUrl
			$pageUrl = ltrim($url,'/');
			
			// build fullStylesheet
			$fullStylesheetUrl = 'css/'.$page['Stylesheet'].'.css';
			
			// setup state 
			if($url != ''){
				$state = '.state("'.$state.'", {'.PHP_EOL
						      .'url: "'.$url.'",'.PHP_EOL
						      .'templateUrl: "'.$templateUrl.'",'.PHP_EOL
						      .'resolve:{'.PHP_EOL
						      	.'pageMeta:  function(){'.PHP_EOL
						        .'    	return {'.PHP_EOL
						        .'			PageId: \''.$page['PageId'].'\','.PHP_EOL
						        .'			PageTypeId: \''.$page['PageTypeId'].'\','.PHP_EOL
						        .'			FriendlyId: \''.$page['FriendlyId'].'\','.PHP_EOL
						        .'			Url: \''.$pageUrl.'\','.PHP_EOL
						        .'			Name: \''.htmlentities($page['Name'], ENT_QUOTES).'\','.PHP_EOL
						        .'			Description: \''.htmlentities($page['Description'], ENT_QUOTES).'\','.PHP_EOL
						        .'			Keywords: \''.htmlentities($page['Keywords'], ENT_QUOTES).'\','.PHP_EOL
						        .'			Callout: \''.htmlentities($page['Callout'], ENT_QUOTES).'\','.PHP_EOL
						        .'			IsSecure: '.$isSecure.','.PHP_EOL
						        .'			BeginDate: \''.$page['BeginDate'].'\','.PHP_EOL
						        .'			EndDate: \''.$page['EndDate'].'\','.PHP_EOL
						        .'			Location: \''.htmlentities($page['Location'], ENT_QUOTES).'\','.PHP_EOL
						        .'			LatLong: \''.$page['LatLong'].'\','.PHP_EOL
						        .'			Layout: \''.$page['Layout'].'\','.PHP_EOL
						        .'			FullStylesheetUrl: \''.$fullStylesheetUrl.'\','.PHP_EOL
						        .'			Stylesheet: \''.$page['Stylesheet'].'\','.PHP_EOL
						        .'			Image: \''.$page['Image'].'\','.PHP_EOL
						        .'			LastModifiedDate: \''.$page['LastModifiedDate'].'\','.PHP_EOL
						        .'			FirstName: \''.$page['FirstName'].'\','.PHP_EOL
						        .'			LastName: \''.$page['LastName'].'\','.PHP_EOL
						        .'			LastModifiedBy: \''.$page['FirstName'].' '.$page['LastName'].'\','.PHP_EOL
						        .'			PhotoUrl: \''.$page['PhotoUrl'].'\''.PHP_EOL
						        .'		};'.PHP_EOL
						        .'},'.PHP_EOL
						        
						        .'siteMeta:  function($http){'.PHP_EOL
						        .'    	return $http({method: \'GET\', url: \'data/site.json\'});'.PHP_EOL
						        .'}'.PHP_EOL
				
						      .'},'.PHP_EOL
						      .'controller: "PageCtrl"'.PHP_EOL
						    .'})'.PHP_EOL;
			}
			
			// set states
			$states .= $state;
		
		}
		
		// template file
		$template_file = APP_LOCATION.'/site/js/respond.site.js';
		
		// site file
        $js_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';
        $app_filename = 'respond.site.js';
		$app_file = $js_dir.$app_filename;
		
		// init content
		$content = '';
		
		// update states
		if(file_exists($template_file)){
            $content = file_get_contents($template_file);
            
            $language = $site['Language'];
            
            // set to the correct format for i18next (ll-LL)
            if(strpos($language, '-') !== FALSE){
				$arr = explode('-', $language);
				$language = strtolower($arr[0]).'-'.strtoupper($arr[1]);
			}
			
			$urlMode = $site['UrlMode'];
			$html5mode = '';
			
			// set $html5mode
			if($urlMode == 'html5'){
				$html5mode = '$locationProvider.html5Mode(true);';
			}
			else if($urlMode == 'hashbang'){
				$html5mode = "$locationProvider.html5Mode(true).hashPrefix('!');";
			}
			
            // set html5mode, language, and states
            $content = str_replace('{{html5mode}}', $html5mode, $content);
            $content = str_replace('{{language}}', $site['Language'], $content);
            $content = str_replace('{{direction}}', $site['Direction'], $content);
            $content = str_replace('{{states}}', $states, $content);
        }
        
        // save content
        Utilities::SaveContent($js_dir, $app_filename, $content);
		
	}
	
	// injects controllers into site/js/static/respond.site.controllers.js
	public static function InjectControllers($site){
	
		// create site json
		$arr = Publish::CreateSiteJSON($site);
		
		// encode to json
		$site_json = json_encode($arr).';';		
		
		// inject routes
		$pages = Page::GetPagesForSite($site['SiteId'], true);
		
		// a list of controllers for the app
		$ctrls = '';
		
		// init pages JSON
		$pages_json = '{';
		
		// walk through pages
		foreach($pages as $page){
		
			$isSecure = 'false';
			
			// create a controller name
			$ctrl = ucfirst($page['FriendlyId']);
			$ctrl = str_replace('-', '', $ctrl);
		
			// defaults
			$url = '/'.$page['FriendlyId'];
			$templateUrl = 'themes/'.$site['Theme'].'/layouts/'.$page['Layout'].'.html';
			
			// check for page type
			if($page['PageTypeId'] != -1){
				$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
				
				if($pageType != NULL){
					$state = $pageType['FriendlyId'].'/'.$page['FriendlyId'];
					$url = '/'.$pageType['FriendlyId'].'/'.$page['FriendlyId'];
					
					$ctrl = ucfirst($pageType['FriendlyId']).$ctrl;
					$ctrl = str_replace('-', '', $ctrl);
					
					if($pageType['IsSecure'] == 1){
						$isSecure = 'true';
					}
				}
			}
			
			// strip the first / for the pageUrl
			$pageUrl = ltrim($url,'/');
			
			// build fullStylesheet
			$fullStylesheetUrl = 'css/'.$page['Stylesheet'].'.css';
			
			// setup state 
			if($url != ''){
				$page_json = '"'.$page['PageId'].'":{'
						        .'"PageId": "'.$page['PageId'].'",'
						        .'"PageTypeId": "'.$page['PageTypeId'].'",'
						        .'"FriendlyId": "'.$page['FriendlyId'].'",'
						        .'"Url": "'.$pageUrl.'",'
						        .'"Name": "'.htmlentities($page['Name'], ENT_QUOTES).'",'
						        .'"Description": "'.htmlentities($page['Description'], ENT_QUOTES).'",'
						        .'"Keywords": "'.htmlentities($page['Keywords'], ENT_QUOTES).'",'
						        .'"Callout": "'.htmlentities($page['Callout'], ENT_QUOTES).'",'
						        .'"IsSecure": '.$isSecure.','
						        .'"BeginDate": "'.$page['BeginDate'].'",'
						        .'"EndDate": "'.$page['EndDate'].'",'
						        .'"Location": "'.htmlentities($page['Location'], ENT_QUOTES).'",'
						        .'"LatLong": "'.$page['LatLong'].'",'
						        .'"Layout": "'.$page['Layout'].'",'
						        .'"FullStylesheetUrl": "'.$fullStylesheetUrl.'",'
						        .'"Stylesheet": "'.$page['Stylesheet'].'",'
						        .'"Image": "'.$page['Image'].'",'
						        .'"LastModifiedDate": "'.$page['LastModifiedDate'].'",'
						        .'"FirstName": "'.$page['FirstName'].'",'
						        .'"LastName": "'.$page['LastName'].'",'
						        .'"LastModifiedBy": "'.$page['FirstName'].' '.$page['LastName'].'",'
						        .'"PhotoUrl": "'.$page['PhotoUrl'].'"'
						        .'},';
			}
			
			$pages_json .= $page_json;
			
		}
		
		// remove trailing comma
		$pages_json = rtrim($pages_json, ',');
		
		// create json for pages
		$pages_json = $pages_json.'}';
		
		// controller file
		$ctrl_file = APP_LOCATION.'/site/js/static/respond.site.controller.js';
	
		// get controller file
		if(file_exists($ctrl_file)){
			$content = file_get_contents($ctrl_file);
			
			// replace pages, site
			$content = str_replace('{{pages}}', $pages_json, $content);
			$content = str_replace('{{site}}', $site_json, $content);
			
			// add controller to the list
			$ctrls .= $content.PHP_EOL;
		}
		
		
		// site file
        $js_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/';
        $app_filename = 'respond.site.controllers.js';
		$app_file = $js_dir.$app_filename;
		
		// init content
		$content = '';
		
		// controllers file
		$ctrls_file = APP_LOCATION.'/site/js/static/respond.site.controllers.js';
		
		// update states
		if(file_exists($ctrls_file)){
            $content = file_get_contents($ctrls_file);
          			
            // set contorllers
            $content = str_replace('{{controllers}}', $ctrls, $content);
        }
        
        // save content
        Utilities::SaveContent($js_dir, $app_filename, $content);
		
	}
	
	// creates site JSON
	public static function CreateSiteJSON($site, $env = 'local'){
		
		// set logoUrl
		$logoUrl = '';
		
		if($site['LogoUrl'] != ''){
			$logoUrl = 'files/'.$site['LogoUrl'];
		}
		
		// set imagesURL
		if($env == 'local'){  // if it is locally deployed
		
			$imagesURL = $site['Domain'].'/';
			
			// if files are stored on S3
			if(FILES_ON_S3 == true){
				$bucket = $site['Bucket'];
				$imagesURL = str_replace('{{bucket}}', $bucket, S3_URL).'/';
				$imagesURL = str_replace('{{site}}', $site['FriendlyId'], $imagesURL);
			}
			
		}
		else{ // if the deployment is on S3
			$imagesURL = '/';
		}
		
		// set iconUrl
		$iconUrl = '';
		
		if($site['IconUrl'] != ''){
			$iconUrl = $imagesURL.'files/'.$site['IconUrl'];
		}
		
		// set display
		$showCart = false;
		$showSettings = false;
		$showLanguages = false;
		$showLogin = false;
		
		if($site['ShowCart'] == 1){
			$showCart = true;
		}
		
		if($site['ShowSettings'] == 1){
			$showSettings = true;
		}
		
		if($site['ShowLanguages'] == 1){
			$showLanguages = true;
		}
		
		if($site['ShowLogin'] == 1){
			$showLogin = true;
		}
		
		// setup sites array
		return array(
			'SiteId' => $site['SiteId'],
			'Domain' => $site['Domain'],
			'API' => API_URL,
			'Name' => $site['Name'],
			'ImagesUrl' => $imagesURL,
			'UrlMode' => $site['UrlMode'],
			'LogoUrl' => $logoUrl,
			'IconUrl' => $iconUrl,
			'IconBg' => $site['IconBg'],
			'Theme' => $site['Theme'],
			'PrimaryEmail' => $site['PrimaryEmail'],
			'Language' => $site['Language'],
			'Direction' => $site['Direction'],
			'ShowCart' => $showCart,
			'ShowSettings' => $showSettings,
			'ShowLanguages' => $showLanguages,
			'ShowLogin' => $showLogin,
			'Currency' => $site['Currency'],
			'WeightUnit' => $site['WeightUnit'],
			'ShippingCalculation' => $site['ShippingCalculation'],
			'ShippingRate' => $site['ShippingRate'],
			'ShippingTiers' => $site['ShippingTiers'],
			'TaxRate' => $site['TaxRate'],
			'PayPalId' => $site['PayPalId'],
			'PayPalUseSandbox' => $site['PayPalUseSandbox'],
			'FormPublicId' => $site['FormPublicId']
		);
		
	}
	
	// publish site
	public static function PublishSiteJSON($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		$arr = Publish::CreateSiteJSON($site);
		
		// encode to json
		$encoded = json_encode($arr);

		$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/data/';
		
		Utilities::SaveContent($dest, 'site.json', $encoded);
	}
	
	// publishes common css
	public static function PublishCommonCSS($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		$src = APP_LOCATION.'/site/css';
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/css';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
	}
	
	// publishes all the pages in the site
	public static function PublishAllPages($siteId){
	
		$site = Site::GetBySiteId($siteId);
		
		// Get all pages
		$list = Page::GetPagesForSite($site['SiteId']);
		
		foreach ($list as $row){
		
			Publish::PublishPage($row['PageId'], false, false);
		}
	}
	
	// publish menu
	public static function PublishMenuJSON($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		$types = MenuType::GetMenuTypes($site['SiteId']);
		
		// create types for primary, footer
		$primary = array(
			'MenuTypeId' => -1,
		    'FriendlyId'  => 'primary'
		);
		
		$footer = array(
			'MenuTypeId' => -1,
		    'FriendlyId'  => 'footer'
		);
		
		// push default types
		array_push($types, $primary);
		array_push($types, $footer);
		
		// walk through types
		foreach($types as $type){
		
			// get items for type
			$list = MenuItem::GetMenuItemsForType($site['SiteId'], $type['FriendlyId']);
			
			// create array for menu
			$menu = array();
			
			// walk through menu items
			foreach($list as $row){
			
				$isInternal = false;
				$state = '';
				$url = '';
	
				// push non nested items onto the array
				if($row['IsNested'] == 0){
					
					// create an array item
					$item = array(
						'MenuItemId' => $row['MenuItemId'],
					    'Name'  => $row['Name'],
					    'CssClass'  => $row['CssClass'],
					    'Url' => $row['Url'],
						'PageId' => $row['PageId'],
						'HasChildren' => false,
						'Children' => array()
					);
					
					// push item onto the array
					array_push($menu, $item);
					
				}
				else{
					
					// create an array item
					$item = array(
						'MenuItemId' => $row['MenuItemId'],
					    'Name'  => $row['Name'],
					    'CssClass'  => $row['CssClass'],
					    'Url' => $row['Url'],
						'PageId' => $row['PageId']
					);
					
					// get a reference to the parent
					$parent = array_pop($menu);
					
					// make sure the parent exists
					if($parent != NULL){
						
						// push item to the children array
						array_push($parent['Children'], $item);
						
						// set that it has children
						$parent['HasChildren'] = true;
						
						// push item onto the array
						array_push($menu, $parent);
						
					}
					
				}
		
			}
			
			// encode to json
			$encoded = json_encode($menu);
	
			$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/data/';
			
			Utilities::SaveContent($dest, 'menu-'.$type['FriendlyId'].'.json', $encoded);
		}
		
	}
		
	// publish rss for all page types
	public static function PublishRssForPageTypes($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		$list = PageType::GetPageTypes($site['SiteId']);
		
		foreach ($list as $row){
			Publish::PublishRssForPageType($siteId, $row['PageTypeId']);
		}
	}
	
	// publish rss for pages
	public static function PublishRssForPageType($siteId, $pageTypeId){
		
		$site = Site::GetBySiteId($siteId);
		
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'];
		
		$pageType = PageType::GetByPageTypeId($pageTypeId);
		
		// generate rss
		$rss = Utilities::GenerateRSS($site, $pageType);
		
		Utilities::SaveContent($dest.'/data/', strtolower($pageType['FriendlyId']).'.xml', $rss);
	}
	
	// publish sitemap
	public static function PublishSiteMap($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'];
		
		// generate default site map
		$content = Utilities::GenerateSiteMap($site);
		
		Utilities::SaveContent($dest.'/', 'sitemap.xml', $content);
	}
	
	// gets errors for teh less files
	public static function GetLESSErrors($site, $name){
	
		// get references to file
	    $lessDir = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
	    $cssDir = SITES_LOCATION.'/'.$site['FriendlyId'].'/css/';
	    
	    // get reference to config file
	    $configFile = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/configure.json';

	    $lessFile = $lessDir.$name.'.less';
	    $cssFile = $cssDir.$name.'.css';

	    // create css directory (if needed)
	    if(!file_exists($cssDir)){
			mkdir($cssDir, 0755, true);	
		}

	    if(file_exists($lessFile)){
	    	$content = file_get_contents($lessFile);

	    	$less = new lessc;
	    	
	    	try{
		    	
		    	$css = $content;
		    	
		    	// set configurations
		    	$css = Publish::SetConfigurations($configFile, $css);
		    	
		    	// compile less to css
		    	$css = $less->compile($css);
		    	
		    	return NULL;
		    	
	    	}
	    	catch(exception $e){
				return $e->getMessage();
			}
			
    	}
    	else{
    		return NULL;
    	}

	}
	
	
	
	// publishes a specific css file
	public static function PublishCSS($site, $name){
	
		// get references to file
	    $lessDir = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
	    $cssDir = SITES_LOCATION.'/'.$site['FriendlyId'].'/css/';
	    
	    // get reference to config file
	    $configFile = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/configure.json';

	    $lessFile = $lessDir.$name.'.less';
	    $cssFile = $cssDir.$name.'.css';

	    // create css directory (if needed)
	    if(!file_exists($cssDir)){
			mkdir($cssDir, 0755, true);	
		}

	    if(file_exists($lessFile)){
	    	$content = file_get_contents($lessFile);

	    	$less = new lessc;
	    	
	    	try{
		    	
		    	$css = $content;
		    	
		    	// set configurations
		    	$css = Publish::SetConfigurations($configFile, $css);
		    	
		    	// compile less to css
		    	$css = $less->compile($css);
		    	
		    	// compress css, #ref: http://manas.tungare.name/software/css-compression-in-php/
		    	
		    	// remove comments
				$css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
		    	
		    	// Remove space after colons
				$css = str_replace(': ', ':', $css);
		    	
		    	// Remove whitespace
				$css = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $css);
		    	
		    	// put css into file
		    	file_put_contents($cssFile, $css);
		    	
		    	return $css;
		    	
	    	}
	    	catch(exception $e){
				return NULL;
			}
			
    	}
    	else{
    		return NULL;
    	}

	}
	
	// publish configurations
	public static function SetConfigurations($configFile, $css){
		
		if(file_exists($configFile)){
		
			// get jsontxt
			$json = file_get_contents($configFile);
			
			// decode json file
			$configs = json_decode($json, true);
			
			// walk through configs
			foreach($configs as $config){
			
				$controls = $config['controls'];
			
				// walk through controls
				foreach($controls as $control){
				
					$replace = $control['replace'];
					$selected = $control['selected'];
					$prefix = '';
					$postfix = '';
					
					// set prefix (deprecated)
					if(isset($control['prefix'])){
						$prefix = $control['prefix'];
						
						$selected = $prefix.$selected;
					}
					
					// set postfix
					if(isset($control['postfix'])){
						$postfix = $control['postfix'];
						
						$selected  = $selected.$postfix;
					}
					
					// set format
					if(isset($control['cssFormat'])){
						$cssFormat = $control['cssFormat'];
						
						$selected = str_replace('%1', $selected, $cssFormat);
					}
					
					// replace config with selection
					$css = str_replace($replace, $selected, $css);
				
				}
				
			}
		
		}
		
		return $css;
		
		
	}

	// publishes all css
	public static function PublishAllCSS($siteId){

		$site = Site::GetBySiteId($siteId); // test for now

		$lessDir = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
		
		//get all image files with a .less ext
		$files = glob($lessDir . "*.less");
		
		// combined css
		$combined_css = '';

		//print each file name
		foreach($files as $file){
			$f_arr = explode("/",$file);
			$count = count($f_arr);
			$filename = $f_arr[$count-1];
			$name = str_replace('.less', '', $filename);

			if(strpos($name, 'respond.min') === FALSE){
				$combined_css .= Publish::PublishCSS($site, $name);
			}
		}
		
		// get plugins CSS
		$plugins_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/css/plugins.css';
		
		if(file_exists($plugins_file)){
			$css = file_get_contents($plugins_file);
			
			// remove comments
			$css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
	    	
	    	// Remove space after colons
			$css = str_replace(': ', ':', $css);
	    	
	    	// Remove whitespace
			$css = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $css);
			
			$combined_css .= $css;
		}
		
		// publish combined css
	    $css_file = SITES_LOCATION.'/'.$site['FriendlyId'].'/css/respond.min.css';
	    
	    // put combined css
	    file_put_contents($css_file, $combined_css);
	 
	}

	// publishes a page
	// live 	-> 	/site/{{site.FriendlyId}}/templates/page/{{pageType.FriendlyId}}.{{page.FriendlyId}}.html
	// preview	->  /site/{{site.FriendlyId}}/templates/preview/{{pageType.FriendlyId}}.{{page.FriendlyId}}.html
	public static function PublishPage($pageId, $preview = false, $remove_draft = false){
	
		$page = Page::GetByPageId($pageId);
        
		if($page!=null){
			
			$site = Site::GetBySiteId($page['SiteId']); // test for now
			
			if($site['UrlMode'] == 'static'){ // for sites using static html pages (URL-based routing)
				Publish::PublishDynamicPage($page, $site, $preview, $remove_draft);
				
				// do not publish a static page for include only pages
				if($page['IncludeOnly'] == 0){
					Publish::PublishStaticPage($page, $site, $preview, $remove_draft);
				}
				
				// inject controllers
				Publish::InjectControllers($site);
			}
			else{ // publishes a dynamic version of the page (for sites using UI-ROUTER (html5, hashbang, etc)
				Publish::PublishDynamicPage($page, $site, $preview, $remove_draft);
				
				// inject states
				Publish::InjectStates($site);
			}
			
		}
	}
	
	// publishes a dymanic version of the page
	public static function PublishDynamicPage($page, $site, $preview = false, $remove_draft = false){
		
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/templates/';
		$imageurl = $dest.'files/';
		$siteurl = $site['Domain'].'/';
		
		$friendlyId = $page['FriendlyId'];
		
		$url = '';
		$file = '';
        
        // set full destination
        if($preview==true){
            $dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/templates/preview/';
        }   
        else{
            $dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/templates/page/';
 	  	}
        
        // create directory if it does not exist
        if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
        
        // set friendlyId
        $file = $page['FriendlyId'].'.html';
        
        // initialize PT
        $pageType = NULL;
        
		// create a nice path to store the file
		if($page['PageTypeId'] != -1){
			
			$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			
			// prepend the friendlyId to the fullname
			if($pageType!=null){
				$file = strtolower($pageType['FriendlyId']).'.'.$file;
			}
			else{
				$file = 'uncategorized.'.$file;
			}

		}
	
		// generate default
		$html = '';
		
		if($preview == true){
			$html = $page['Draft'];
		}
		else{
			$html = $page['Content'];
		}
		
		// remove any drafts associated with the page
		if($remove_draft==true){
		
			// remove a draft from the page
			Page::RemoveDraft($page['PageId']);
		
		}

		// save the content to the published file
		Utilities::SaveContent($dest, $file, $html);
		
        return $dest.$file;
        
	}
	
	
	// publishes a static version of the page
	public static function PublishStaticPage($page, $site, $preview = false, $remove_draft = false){
	
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/';
		$imageurl = $dest.'files/';
		$siteurl = $site['Domain'].'/';
		
		$friendlyId = $page['FriendlyId'];
		
		$url = '';
		$file = '';
		
		// created ctrl
		$ctrl = ucfirst($page['FriendlyId']);
		$ctrl = str_replace('-', '', $ctrl);
		
		// set base
		$base = '';
        
 	  	// create a static location for the page
 	  	if($page['PageTypeId'] == -1){
			$url = $page['FriendlyId'].'.html';
			$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/';
		}
		else{
			$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			
			$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/uncategorized/';
			
			if($pageType!=null){
				$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/'.$pageType['FriendlyId'].'/';
				
				// created ctrl
				$ctrl = ucfirst($pageType['FriendlyId']).$ctrl;
				$ctrl = str_replace('-', '', $ctrl);
			}
			
			// set $base to the root of the director
			$base = '../';

		}
        
        // create directory if it does not exist
        if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
        
		// generate default
		$html = '';
		$content = '';
		
		// get index and layout (file_get_contents)
		$index = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/index.html';
		$layout = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/layouts/'.$page['Layout'].'.html';
		
		// get index html
		if(file_exists($index)){
        	$html = file_get_contents($index);
        }

        // get layout html
		if(file_exists($layout)){
        	$layout_html = file_get_contents($layout);
        
			$html = str_replace('<body ui-view></body>', '<body ng-controller="PageCtrl" page="'.$page['PageId'].'" class="'.$page['Stylesheet'].'">'.$layout_html.'</body>', $html);
        }
		
		// get draft/content
		if($preview == true){
			$file = $page['FriendlyId'].'.preview.html';
			$content = $page['Draft'];
		}
		else{
			$file = $page['FriendlyId'].'.html';
			$content = $page['Content'];
		}
		
		// replace respond-content for layout with content
		$html = str_replace('<respond-content id="main-content" url="{{page.Url}}"></respond-content>', $content, $html);
		
		// remove any drafts associated with the page
		if($remove_draft==true){
		
			// remove a draft from the page
			Page::RemoveDraft($page['PageId']);
		
		}

		// replace common Angular calls for SEO, e.g. {{page.Name}} {{page.Description}} {{site.Name}}
		$html = str_replace('{{page.Name}}', $page['Name'], $html);
		$html = str_replace('{{page.Description}}', $page['Description'], $html);
		$html = str_replace('{{page.Keywords}}', $page['Keywords'], $html);
		$html = str_replace('{{page.Callout}}', $page['Callout'], $html);
		$html = str_replace('{{site.Name}}', $site['Name'], $html);
		$html = str_replace('{{site.Language}}', $site['Language'], $html);
		$html = str_replace('{{site.Direction}}', $site['Direction'], $html);
		$html = str_replace('{{page.FullStylesheetUrl}}', 'css/'.$page['Stylesheet'].'.css', $html);
		
		// update base
		$html = str_replace('<base href="/">', '<base href="'.$base.'">', $html);
		
		// add menu links for SEO (<respond-menu type="primary"></respond-menu>)
		$delimiter = '#';
		$startTag = '<respond-menu type="';
		$endTag = '"></respond-menu>';
		
		$regex = $delimiter . preg_quote($startTag, $delimiter) 
		                    . '(.*?)' 
		                    . preg_quote($endTag, $delimiter) 
		                    . $delimiter 
		                    . 's';
		
		// match against html
		preg_match_all($regex, $html, $matches);
		
		// crawl matches
		foreach($matches[1] as &$value){
			
			// init menu
			$menu = '';
			
			// get items for type
			$menuItems = MenuItem::GetMenuItemsForType($site['SiteId'], $value);
		    $i = 0;
		    $parent_flag = false;
		    $new_parent = true;
		    
		    // walk through items
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
			
				$menu_root = '/';
				
				// check for external links
				if(strpos($url,'http') !== false) {
				    $menu_root = '';
				}
		
				if($new_parent == true && $parent_flag == true){
					$menu .= '<li>';
					$menu .= '<a href="'.$menu_root.$url.'">'.$menuItem['Name'].'</a>';
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
			}
				
			$i = $i+1;
				
			// fill menu with string
			$html = str_replace('<respond-menu type="'.$value.'"></respond-menu>', 
					'<respond-menu type="'.$value.'">'.$menu.'</respond-menu>', $html);
			
		}
		
	
		// save the content to the published file
		Utilities::SaveContent($dest, $file, $html);
		
        return $dest.$file;
        
	}
	
	// removes a draft of the page
	public static function RemoveDraft($pageId){
	
		// remove a draft from the page
		Page::RemoveDraft($page['PageId']);
		
		return false;
	}
		
}

?>