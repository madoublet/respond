<?php 

class Publish
{

	// publishes the entire site
	public static function PublishSite($siteId){
		
		// repbulish Content
		Publish::PublishContent($siteId);
		
		// repbulish engine
		Publish::PublishEngine($siteId);
		
	}
	
	// publishes the content for the site (Pages, Current Theme CSS, Menu JSON, Sitemap, RSS)
	public static function PublishContent($siteId){
	
		$site = Site::GetBySiteId($siteId);
		
		// inject site settings
		Publish::InjectSiteSettings($site);
	
		// publish all pages
		Publish::PublishAllPages($site);
		
		// publish menu JSON
		Publish::PublishMenuJSON($site);
		
		// publish CSS
		Publish::PublishAllCSS($site);
		
		// publish sitemap
		Publish::PublishSiteMap($site);
		
		// publish RSS
		Publish::PublishRssForPageTypes($site);
	
	}
	
	// publishes the engine for the site (JS libs, CSS libs, Plugins, Locales, Htaccess)
	public static function PublishEngine($siteId){
		
		$site = Site::GetBySiteId($siteId);
		
		// publish common JS (libs)
		Publish::PublishCommonJS($site);
		
		// publish common css (libs)
		Publish::PublishCommonCSS($site);
		
		// publish plugins
		Publish::PublishPlugins($site);
		
		// publish locales
		Publish::PublishLocales($site);
		
		// setup htaccess
		Publish::SetupHtaccess($site);
		
		// update version
		Site::EditVersion($site['SiteId'], VERSION);
		
	}
	
	// publishes locales for the site
	public static function PublishLocales($site){
        
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
					
		$contents = 'Options -Indexes'.PHP_EOL.
			'<IfModule mod_rewrite.c>'.PHP_EOL.
			'RewriteEngine On'.PHP_EOL.
			'RewriteCond %{REQUEST_FILENAME} !-f'.PHP_EOL.
			'RewriteRule ^([^\.]+)$ $1.html [NC,L]'.PHP_EOL.
			'ErrorDocument 404 /page/error'.PHP_EOL.
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
				$includeOnly = 0;
				
				// set includeOnly (if specified in default)
				if(isset($value['includeOnly'])){
					if($value['includeOnly'] == true){
						$includeOnly = 1;
					}
				}
				
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
					
					// set include only
					Page::SetIncludeOnly($page['PageId'], $includeOnly);
					
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
		
		// copy files locally
		$files_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/files/';
		
		if(file_exists($files_src)){
			$files_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/files/';

			Utilities::CopyDirectory($files_src, $files_dest);
		}
		
		// copy resources
		$res_src = APP_LOCATION.THEMES_FOLDER.'/'.$theme.'/resources/';
		
		if(file_exists($res_src)){
			$res_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/themes/'.$theme.'/resources/';
		
			Utilities::CopyDirectory($res_src, $res_dest);
		}
		
	}
	
	// publishes common js
	public static function PublishCommonJS($site, $env = 'local'){
		
		$src = APP_LOCATION.'/site/js';
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/js';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
		
		// inject site information
		Publish::InjectSiteSettings($site);
		
	}
	
	// injects site information into the respond.site.js file
	public static function InjectSiteSettings($site, $env = 'local'){
		
		// set logoUrl
		$logoUrl = '';
		
		if($site['LogoUrl'] != ''){
			$logoUrl = 'files/'.$site['LogoUrl'];
		}
		
		// set altLogoUrl
		$altLogoUrl = '';
		
		if($site['AltLogoUrl'] != '' && $site['AltLogoUrl'] != NULL){
			$altLogoUrl = 'files/'.$site['AltLogoUrl'];
		}
		
		// set payPalLogoUrl
		$payPalLogoUrl = '';
		
		if($site['PayPalLogoUrl'] != '' && $site['PayPalLogoUrl'] != NULL){
			$payPalLogoUrl = 'files/'.$site['PayPalLogoUrl'];
		}
		
		// set imagesURL
		$imagesURL = $site['Domain'].'/';
			
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
		$showSearch = false;
		
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
		
		if($site['ShowSearch'] == 1){
			$showSearch = true;
		}
		
		// create settings
		$settings = array(
			'SiteId' => $site['SiteId'],
			'Domain' => $site['Domain'],
			'API' => API_URL,
			'Name' => $site['Name'],
			'ImagesUrl' => $imagesURL,
			'LogoUrl' => $logoUrl,
			'AltLogoUrl' => $altLogoUrl,
			'PayPalLogoUrl' => $payPalLogoUrl,
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
			'ShowSearch' => $showSearch,
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
		
		// settings
		$str_settings = json_encode($settings);
		
		// get site file
		$file = SITES_LOCATION.'/'.$site['FriendlyId'].'/js/respond.site.js';
		
		if(file_exists($file)){
			
			// get contents
			$content = file_get_contents($file);
			
			$start = 'settings: {';
			$end = '}';
			
			// remove { }
			$new = str_replace('{', '', $str_settings);
			$new = str_replace('}', '', $new);
			
			// replace
			$content = preg_replace('#('.preg_quote($start).')(.*?)('.preg_quote($end).')#si', '$1'.$new.'$3', $content);			
			
			// add settings
			//$content = str_replace('settings: {},', 'settings: '.$str_settings.',', $content);
			
			// publish updates
			file_put_contents($file, $content);
			
		}
		
	}
	
	// publishes plugins for the site
	public static function PublishPlugins($site){
		
		// copy polyfills
		$components_src = APP_LOCATION.'/site/components/lib/webcomponentsjs';
		$components_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/components/lib/webcomponentsjs';
		
		// create polyfills directory if it does not exist
		if(!file_exists($components_dest)){
			mkdir($components_dest, 0755, true);	
		}
		
		// copy polyfills directory
		if(file_exists($components_dest)){
			Utilities::CopyDirectory($components_src, $components_dest);
		}
		
		// copy build
		$build_src = APP_LOCATION.'/site/components/respond-build.html';
		$build_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/components/respond-build.html';
		
		if(file_exists($build_src)){
			
			$content = file_get_contents($build_src);
			file_put_contents($build_dest, $content);
			
		}
		
		
		// open plugins direcotry
        if($handle = opendir(APP_LOCATION.'plugins')){
        
		    $blacklist = array('.', '..');
		    
		    // walk through directories
		    while (false !== ($file = readdir($handle))) {
		    
		        if (!in_array($file, $blacklist)) {
		            $dir = $file;
		            
		            // source resources directory
		            $src_dir = APP_LOCATION.'plugins/'.$dir.'/component';
		            
		            // add templates
		            if(file_exists($src_dir)){
		            
		            	// destination templates directory
		            	$dest_dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/components';
		            
						// create destination directory
						if(!file_exists($dest_dir)){
							mkdir($dest_dir, 0755, true);	
						}
					
						// copies the directory
						Utilities::CopyDirectory($src_dir, $dest_dir);
		            }
		            
		            
		        }
		        
		    }
		    
		    closedir($handle);
		}
		
		
				
	}
		
	// publishes common css
	public static function PublishCommonCSS($site){
		
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
	public static function PublishAllPages($site){
	
		// Get all pages
		$list = Page::GetPagesForSite($site['SiteId']);
		
		foreach ($list as $row){
		
			Publish::PublishPage($row['PageId'], false, false);
		}
	}
	
	// publish menu
	public static function PublishMenuJSON($site){
		
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
			
			// encode to json
			$encoded = json_encode($list);
	
			$dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/data/';
			
			Utilities::SaveContent($dest, 'menu-'.$type['FriendlyId'].'.json', $encoded);
		}
		
	}
		
	// publish rss for all page types
	public static function PublishRssForPageTypes($site){
		
		$list = PageType::GetPageTypes($site['SiteId']);
		
		foreach ($list as $row){
			Publish::PublishRssForPageType($site, $row['PageTypeId']);
		}
	}
	
	// publish rss for pages
	public static function PublishRssForPageType($site, $pageTypeId){
		
		$dest = SITES_LOCATION.'/'.$site['FriendlyId'];
		
		$pageType = PageType::GetByPageTypeId($pageTypeId);
		
		// generate rss
		$rss = Utilities::GenerateRSS($site, $pageType);
		
		Utilities::SaveContent($dest.'/data/', strtolower($pageType['FriendlyId']).'.xml', $rss);
	}
	
	// publish sitemap
	public static function PublishSiteMap($site){
		
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
	public static function PublishAllCSS($site){

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
			
			Publish::PublishTemplate($page, $site, $preview, $remove_draft);
				
			// do not publish a static page for include only pages
			if($page['IncludeOnly'] == 0){
				Publish::PublishStaticPage($page, $site, $preview, $remove_draft);
			}
		}
	}
	
	// publishes a template for the page
	public static function PublishTemplate($page, $site, $preview = false, $remove_draft = false){
		
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
				
				$path = str_replace('/', '.', $pageType['FriendlyId']);
				
				$file = strtolower($path).'.'.$file;
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
		
		if($html !== NULL){
		
			// parse the html for menus
			$html = str_get_html($html, true, true, DEFAULT_TARGET_CHARSET, false, DEFAULT_BR_TEXT);
			
			// generate the [render=publish] components
			$html = Publish::GenerateRenderAtPublish($html, $site, $page);
			
			// applies the style attributes to the $html
			$html = Publish::ApplyStyleAttributes($html);
			
			// applies the mustache syntax
			$html = Publish::ApplyMustacheSyntax($html, $site, $page);
		
		}
		else{
			$html = '';
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
			
			// explode friendlyid by '/'
			$parts = explode('/', $pageType['FriendlyId']);
			
			// set base based on the depth
			foreach($parts as $part){
				$base .= '../';
			}
			
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
        	
        	// set class
        	$cssClass = $page['Stylesheet'];
        	
        	// set show-cart, show-settings, show-languages, show-login
        	if($site['ShowCart'] == 1){
	        	$cssClass .= ' show-cart';
        	}
        	
        	if($site['ShowSettings'] == 1){
	        	$cssClass .= ' show-settings';
        	}
        	
        	if($site['ShowLanguages'] == 1){
	        	$cssClass .= ' show-languages';
        	}
        	
        	if($site['ShowLogin'] == 1){
	        	$cssClass .= ' show-login';
        	}
        
			$html = str_replace('<body ui-view></body>', '<body page="'.$page['PageId'].'" class="'.$cssClass.'">'.$layout_html.'</body>', $html);
			$html = str_replace('<body></body>', '<body page="'.$page['PageId'].'" class="'.$cssClass.'">'.$layout_html.'</body>', $html);
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
		
		if($html !== NULL){
			
			// parse the html for menus
			$html = str_get_html($html, true, true, DEFAULT_TARGET_CHARSET, false, DEFAULT_BR_TEXT);
			
			// generate the [render=publish] components
			$html = Publish::GenerateRenderAtPublish($html, $site, $page);
			
			// applies the style attributes to the $html
			$html = Publish::ApplyStyleAttributes($html);
			
			// applies the mustache syntax
			$html = Publish::ApplyMustacheSyntax($html, $site, $page);
		
		}
		else{
			$html = '';
		}
		
		// update base
		$html = str_replace('<base href="/">', '<base href="'.$base.'">', $html);
	
		// save the content to the published file
		Utilities::SaveContent($dest, $file, $html);
		
        return $dest.$file;
        
	}
	
	// generate the [render=publish] components
	public static function GenerateRenderAtPublish($html, $site, $page){
		
		// set images URL
		$imagesURL = $site['Domain'].'/';
		
		// build out the menus where render is set to publish
		foreach($html->find('respond-menu[render=publish]') as $el){
		
			// get the type
			if($el->type){
				
				$type = $el->type;
				
				// init menu
				$menu = '<ul';
				
				// set class if applicable
				if(isset($el->class)){
					$menu .= ' class="'.$el->class.'">';
				}
				else{
					$menu .= '>';
				}
				
				// get items for type
				$menuItems = MenuItem::GetMenuItemsForType($site['SiteId'], $type);
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
						$menu .= '<li class="dropdown">';
						$menu .= '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'.$menuItem['Name'].' <span class="caret"></span></a>';
						$menu .= '<ul class="dropdown-menu">';
						$new_parent = false;
					}
					else{
				    	$menu .= '<li'.$cssClass.'>';
						$menu .= '<a href="'.$url.'">'.$menuItem['Name'].'</a>';
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
				
				$menu .= '</ul>';
					
				$el->outertext = $menu;
						
				
			}
			/* isset */
			
		}
		/* foreach */
		
		// replace content where render is set to publish
		foreach($html->find('respond-content[render=publish]') as $el){
		
			// get the url
			if(isset($el->url)){
			
				$url = $el->url;
				
				// replace the / with a period
				$url = str_replace('/', '.', $url);
				$url .= '.html';
				$content_html = '';
			
				// get the content from the site
				$content_dest = SITES_LOCATION.'/'.$site['FriendlyId'].'/templates/page/'.$url;
				
				if(file_exists($content_dest)){
					$content_html = file_get_contents($content_dest);
				}
				
				// update images url
				$content_html = str_replace('{{site.ImagesUrl}}', $imagesURL, $content_html);
				$content_html = str_replace('{{site.ImagesURL}}', $imagesURL, $content_html);
				
				// set outer text
				if($content_html != ''){
					$el->outertext = $content_html;
				}
			}
			
		}
		/* foreach */
		
		return $html;
		
	}
	
	// applies the style attributes
	public static function ApplyStyleAttributes($html){
		
		// replace background color
		foreach($html->find('[backgroundcolor]') as $el){
			
			// set existing style
			$style = '';
			
			if(isset($el->style)){
				$style = $el->style.' ';
			}
		
			// if it is nested, break
			if(isset($el->{'data-nested'})){
				
				if($el->{'data-nested'} != 'nested'){
					$el->style = $style.'background-color: '.$el->backgroundcolor.';';
				}
				
			}
			else{
				$el->style = $style.'background-color: '.$el->backgroundcolor.';';
			}
			
			
		}
		/* foreach */
		
		
		// replace background image
		foreach($html->find('[backgroundimage]') as $el){
			
			// set existing style
			$style = '';
			
			if(isset($el->style)){
				$style = $el->style.' ';
			}
			
			$backgroundimage = $el->backgroundimage;
			$backgroundstyle = 'cover';
			
			// add site url for files that start with files
			if(substr( $backgroundimage, 0, 5 ) === "files"){
				$backgroundimage = $imagesURL.$el->backgroundimage;
			}
			
			// set background style
			if(isset($el->backgroundstyle)){
				$backgroundstyle = $el->backgroundstyle;
			}
		
			// if it is nested, break
			if(isset($el->{'data-nested'})){
				
				if($el->{'data-nested'} != 'nested'){
				
					if($backgroundstyle == 'parallax'){
						$el->{'data-parallax'} = 'scroll';
						$el->{'data-image-src'} = $backgroundimage;
					}
					else if($backgroundstyle == 'repeat'){
						$el->style = $style.'background-image: url('.$backgroundimage.'); background-repeat: repeat;';
					}
					else{
						$el->style = $style.'background-image: url('.$backgroundimage.'); background-size: cover; background-position: center center;';

					}
				
					
				}
				
			}
			else{
				if($backgroundstyle == 'parallax'){
					$el->{'data-parallax'} = 'scroll';
					$el->{'data-image-src'} = $backgroundimage;
				}
				else if($backgroundstyle == 'repeat'){
					$el->style = $style.'background-image: url('.$backgroundimage.'); background-repeat: repeat;';
				}
				else{
					$el->style = $style.'background-image: url('.$backgroundimage.'); background-size: cover; background-position: center center;';

				}
			}
		
			
		}
		/* foreach */
		
		// replace textcolor
		foreach($html->find('[textcolor]') as $el){
		
			// if it is nested, break
			if(isset($el->style)){
				$el->style = $el->style.' color: '.$el->textcolor.';';
			}
			else{
				$el->style = 'color: '.$el->textcolor.';';
			}
		
		}
		/* foreach */
		
		// replace paddingtop
		foreach($html->find('[paddingtop]') as $el){
		
			// if it is nested, break
			if(isset($el->style)){
				$el->style = $el->style.' padding-top: '.$el->paddingtop.'px;';
			}
			else{
				$el->style = 'padding-top: '.$el->paddingtop.'px;';
			}
		
		}
		/* foreach */
		
		// replace paddingright
		foreach($html->find('[paddingright]') as $el){
		
			// if it is nested, break
			if(isset($el->style)){
				$el->style = $el->style.' padding-right: '.$el->paddingright.'px;';
			}
			else{
				$el->style = 'padding-right: '.$el->paddingright.'px;';
			}
		
		}
		/* foreach */
		
		// replace paddingbottom
		foreach($html->find('[paddingbottom]') as $el){
		
			// if it is nested, break
			if(isset($el->style)){
				$el->style = $el->style.' padding-bottom: '.$el->paddingbottom.'px;';
			}
			else{
				$el->style = 'padding-bottom: '.$el->paddingbottom.'px;';
			}
		
		}
		/* foreach */
		
		// replace paddingleft
		foreach($html->find('[paddingleft]') as $el){
		
			// if it is nested, break
			if(isset($el->style)){
				$el->style = $el->style.' padding-left: '.$el->paddingleft.'px;';
			}
			else{
				$el->style = 'padding-left: '.$el->paddingleft.'px;';
			}
		
		}
		/* foreach */
		
		// replace textshadowcolor
		foreach($html->find('[textshadowcolor]') as $el){
		
		
			$color = $el->textshadowcolor;
			$horizontal = '1px';
			$vertical = '1px';
			$blur = '1px';
			
			if(isset($el->textshadowhorizontal)){
				$horizontal = $el->textshadowhorizontal;
			}
			
			if(isset($el->textshadowvertical)){
				$vertical = $el->textshadowblur;
			}
			
			if(isset($el->textshadowvertical)){
				$blur = $el->textshadowblur;
			}
			
			// build shadow
			$textshadow = $horizontal.' '.$vertical.' '.$blur.' '.$color.';';
		
		
			// if it is nested, break
			if(isset($el->style)){
				$el->style = $el->style.' text-shadow: '.$textshadow;
			}
			else{
				$el->style = 'text-shadow: '.$textshadow;
			}
		
		}
		/* foreach */
		
		// replace textsize
		foreach($html->find('[textsize]') as $el){
		
			$textsize = $el->textsize;
		
			$el->innertext = '<span style="font-size:'.$textsize.'">'.$el->innertext.'</span>';
		
		}
		/* foreach */
		
		return $html;
		
	}
	
	
	// applies the mustache syntax
	public static function ApplyMustacheSyntax($html, $site, $page){
		
		// meta data
		$photo = '';
		$firstName = '';
		$lastName = '';
		$lastModifiedDate = $page['LastModifiedDate'];
		
		// replace last modified
		if($page['LastModifiedBy'] != NULL){
			
			// get user
			$user = User::GetByUserId($page['LastModifiedBy']);
			
			// set user infomration
			if($user != NULL){
				$photo = $user['PhotoUrl'];
				$firstName = $user['FirstName'];
				$lastName = $user['LastName'];
			}
			
		}
		
		// set page information
		$html = str_replace('{{page.PhotoUrl}}', $photo, $html);
		$html = str_replace('{{page.FirstName}}', $firstName, $html);
		$html = str_replace('{{page.LastName}}', $lastName, $html);
		$html = str_replace('{{page.LastModifiedDate}}', $lastModifiedDate, $html);
		
		// replace timestamp
		$html = str_replace('{{timestamp}}', time(), $html);
		
		// replace year
		$html = str_replace('{{year}}', date('Y'), $html);
		
		// set images URL
		$imagesURL = $site['Domain'].'/';
		
		// set iconURL
		$iconURL = '';
		
		if($site['IconUrl'] != ''){
			$iconURL = $imagesURL.'files/'.$site['IconUrl'];
		}
		
		// replace
		$html = str_replace('ng-src', 'src', $html);
		$html = str_replace('{{site.ImagesUrl}}', $imagesURL, $html);
		$html = str_replace('{{site.ImagesURL}}', $imagesURL, $html);
		$html = str_replace('{{site.IconUrl}}', $iconURL, $html);
		
		// set fullLogo
		$html = str_replace('{{fullLogoUrl}}', $imagesURL.'files/'.$site['LogoUrl'], $html);
		
		// set altLogo (defaults to full logo if not available)
		if($site['AltLogoUrl'] != '' && $site['AltLogoUrl'] != NULL){
			$html = str_replace('{{fullAltLogoUrl}}', $imagesURL.'files/'.$site['AltLogoUrl'], $html);
		}
		else{
			$html = str_replace('{{fullAltLogoUrl}}', $imagesURL.'files/'.$site['LogoUrl'], $html);
		}
		
		// set urls
		$relativeURL = $page['FriendlyId'];
		
		if($page['PageTypeId']!=-1){
        	$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			$relativeURL = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
        }
        
        $fullURL = $site['Domain'].'/'.$relativeURL;
		
		
		// replace mustaches syntax {{page.Description}} {{site.Name}}
		$html = str_replace('{{page.Name}}', $page['Name'], $html);
		$html = str_replace('{{page.Description}}', $page['Description'], $html);
		$html = str_replace('{{page.Keywords}}', $page['Keywords'], $html);
		$html = str_replace('{{page.Callout}}', $page['Callout'], $html);
		$html = str_replace('{{site.Name}}', $site['Name'], $html);
		$html = str_replace('{{site.Language}}', $site['Language'], $html);
		$html = str_replace('{{site.Direction}}', $site['Direction'], $html);
		$html = str_replace('{{site.IconBg}}', $site['IconBg'], $html);
		$html = str_replace('{{site.EmbeddedCodeHead}}', $site['EmbeddedCodeHead'], $html);
		$html = str_replace('{{site.EmbeddedCodeBottom}}', $site['EmbeddedCodeBottom'], $html);
		$html = str_replace('{{page.FullStylesheetUrl}}', 'css/'.$page['Stylesheet'].'.css', $html);
		
		// urls
		$html = str_replace('{{page.Url}}', $relativeURL, $html);
		$html = str_replace('{{page.FullUrl}}', $fullURL, $html);
		
		return $html;
		
	}
	
	// removes a draft of the page
	public static function RemoveDraft($pageId){
	
		// remove a draft from the page
		Page::RemoveDraft($pageId);
		
		return false;
	}
		
}

?>