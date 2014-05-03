<?php 

class Publish
{

	// publishes the entire site
	public static function PublishSite($siteUniqId, $root = '../'){
		
		// publish sitemap
		Publish::PublishSiteMap($siteUniqId, $root);
		
		// publish all CSS
		Publish::PublishAllCSS($siteUniqId, $root);	

		// publish all pages
		Publish::PublishAllPages($siteUniqId, $root);

		// publish rss for page types
		Publish::PublishRssForPageTypes($siteUniqId, $root);
		
		// publish menu
		Publish::PublishMenu($siteUniqId, $root);
		
		// publish common js
		Publish::PublishCommonJS($siteUniqId, $root);
		
		// publish common css
		Publish::PublishCommonCSS($siteUniqId, $root);
		
		// publish controller
		Publish::PublishCommon($siteUniqId, $root);

		// publish plugins
		Publish::PublishPlugins($siteUniqId, $root);
		
	}
	
	// publishes common site files
	public static function PublishCommon($siteUniqId, $root = '../'){
        
        $site = Site::GetBySiteUniqId($siteUniqId);
        
        // copy the .htaccess
		$src = $root.'sites/common/.htaccess';
		$dest = $root.'sites/'.$site['FriendlyId'].'/.htaccess';
		
		copy($src, $dest);
		
		// copy site.php
		$src = $root.'sites/common/site.php';
		$dest = $root.'sites/'.$site['FriendlyId'].'/site.php';
		
		copy($src, $dest);
		
		// copy logout.php
		$src = $root.'sites/common/logout.php';
		$dest = $root.'sites/'.$site['FriendlyId'].'/logout.php';
		
		copy($src, $dest);
		
		// copy libs
		$libs_src = $root.'sites/common/libs/';
		$libs_dir = $root.'sites/'.$site['FriendlyId'].'/libs';
		
		// create libs directory if it does not exist
		if(!file_exists($libs_dir)){
			mkdir($libs_dir, 0755, true);	
		}
		
		// copy libs directory
		if(file_exists($libs_dir)){
			Utilities::CopyDirectory($libs_src, $libs_dir);
		}
				
		// create directory for api
		$api_src = $root.'sites/common/api/';
		$api_dir = $root.'sites/'.$site['FriendlyId'].'/api';
		
		// create api directory
		if(!file_exists($api_dir)){
			mkdir($api_dir, 0755, true);	
		}
		
		// copy api directory
		if(file_exists($api_src)){
			Utilities::CopyDirectory($api_src, $api_dir);
		}
		
		$dispatch_file = $root.'sites/'.$site['FriendlyId'].'/api/dispatch.php';
		
		// update dispatch with site ids
		if(file_exists($dispatch_file)){
            $content = file_get_contents($dispatch_file);
            
            // replace {{placeholder}} with id
            $content = str_replace('{{siteId}}', $site['SiteId'], $content);
            $content = str_replace('{{siteUniqId}}', $site['SiteUniqId'], $content);
            $content = str_replace('{{siteFriendlyId}}', $site['FriendlyId'], $content);
            
            // save file
            file_put_contents($dispatch_file, $content);
        }
		
		// copy emails directory
		$emails_src = $root.'sites/common/emails/';
		$emails_dir = $root.'sites/'.$site['FriendlyId'].'/emails';
		
		// create emails directory if it does not exist
		if(!file_exists($emails_dir)){
			mkdir($emails_dir, 0755, true);	
		}
		
		// copy emails directory
		if(file_exists($emails_dir)){
			Utilities::CopyDirectory($emails_src, $emails_dir);
		}
		
		// deny access to draft
		$dir = $root.'sites/'.$site['FriendlyId'].'/fragments/draft/';
		Publish::CreateDeny($dir);
		
		// deny access to publish
		$dir = $root.'sites/'.$site['FriendlyId'].'/fragments/publish/';
		Publish::CreateDeny($dir);
		
		// deny access to render
		$dir = $root.'sites/'.$site['FriendlyId'].'/fragments/render/';
		Publish::CreateDeny($dir);
		
		// deny access to render
		$dir = $root.'sites/'.$site['FriendlyId'].'/fragments/snippets/';
		Publish::CreateDeny($dir);
		
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

	// publishes plugins
	public static function PublishPlugins($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		// create plugin directory
		$dest = $root.'sites/'.$site['FriendlyId'].'/plugins';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
		
		$json = file_get_contents('../plugins/plugins.json');
		$data = json_decode($json, true);

		foreach($data as &$item) {
			$type = $item['type'];

			$p_src = $root.'plugins/'.$type.'/deploy';

			if(file_exists($p_src)){

				$p_dest = $root.'sites/'.$site['FriendlyId'].'/plugins/'.$type;

				if(!file_exists($p_dest)){
					mkdir($p_dest, 0755, true);	
				}

				Utilities::CopyDirectory($p_src, $p_dest);
			}

		}
		
	}

	// publishes a theme
	public static function PublishTheme($site, $theme, $root='../'){

		$theme_dir = $root.'sites/'.$site['FriendlyId'].'/themes/';
		
		// create themes
		if(!file_exists($theme_dir)){
			mkdir($theme_dir, 0755, true);	
		}
		
		// create directory for theme
		$theme_dir .= $theme .'/';
		
		if(!file_exists($theme_dir)){
			mkdir($theme_dir, 0755, true);	
		}
		
		// create directory for layouts
		$layouts_dir = $theme_dir.'/layouts/';
		
		if(!file_exists($layouts_dir)){
			mkdir($layouts_dir, 0755, true);	
		}
		
		// create directory for styles
		$styles_dir = $theme_dir.'/styles/';
		
		if(!file_exists($styles_dir)){
			mkdir($styles_dir, 0755, true);	
		}
		
		// create directory for resources
		$res_dir = $theme_dir.'/resources/';
		
		if(!file_exists($res_dir)){
			mkdir($res_dir, 0755, true);	
		}
		
		// create directory for snippets
		$snp_dir = $root.'sites/'.$site['FriendlyId'].'/fragments/snippets/';
		
		if(!file_exists($snp_dir)){
			mkdir($snp_dir, 0755, true);	
		}

		// copy layouts
		$layouts_src = $root.'themes/'.$theme.'/layouts/';
		
		if(file_exists($layouts_src)){
			$layouts_dest = $root.'sites/'.$site['FriendlyId'].'/themes/'.$theme.'/layouts/';

			Utilities::CopyDirectory($layouts_src, $layouts_dest);
		}
		
		// copy styles
		$styles_src = $root.'themes/'.$theme.'/styles/';
		
		if(file_exists($styles_src)){
			$styles_dest = $root.'sites/'.$site['FriendlyId'].'/themes/'.$theme.'/styles/';
		
			Utilities::CopyDirectory($styles_src, $styles_dest);
		}
		
		// copy files
		$files_src = $root.'themes/'.$theme.'/files/';
		
		if(file_exists($files_src)){
			$files_dest = $root.'sites/'.$site['FriendlyId'].'/files/';

			Utilities::CopyDirectory($files_src, $files_dest);
		}
		
		// copy resources
		$res_src = $root.'themes/'.$theme.'/resources/';
		
		if(file_exists($res_src)){
			$res_dest = $root.'sites/'.$site['FriendlyId'].'/themes/'.$theme.'/resources/';
		
			Utilities::CopyDirectory($res_src, $res_dest);
		}
		
		// copy snippets
		$snp_src = $root.'themes/'.$theme.'/snippets/';
		
		if(file_exists($snp_src)){
			$snp_dest = $root.'sites/'.$site['FriendlyId'].'/fragments/snippets/';
		
			Utilities::CopyDirectory($snp_src, $snp_dest);
		}
	}
	
	// publishes common js
	public static function PublishCommonJS($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$src = $root.'sites/common/js';
		$dest = $root.'sites/'.$site['FriendlyId'].'/js';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
	}
	
	// publishes common css
	public static function PublishCommonCSS($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$src = $root.'sites/common/css';
		$dest = $root.'sites/'.$site['FriendlyId'].'/css';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0755, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
	}
	
	// publishes all the pages in the site
	public static function PublishAllPages($siteUniqId, $root = '../'){
	
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		// Get all pages
		$list = Page::GetPagesForSite($site['SiteId']);
		
		foreach ($list as $row){
		
			Publish::PublishPage($row['PageUniqId'], false, false, $root);
		}
	}
	
	// publish menu
	public static function PublishMenu($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$list = MenuItem::GetMenuItems($site['SiteId']);
		
		$menu = array();
		$count = 0;
		
		foreach ($list as $row){

			if($row['PageId']!=-1){
			
				$page = Page::GetByPageId($row['PageId']);

				if($page != null){
					$pageUniqId = $page['PageUniqId'];
				}
				else{
					$pageUniqId = -1;
				}
			}
			else{
				$pageUniqId = -1;
			}

			$item = array(
					'MenuItemUniqId' => $row['MenuItemUniqId'],
				    'Name'  => $row['Name'],
				    'CssClass'  => $row['CssClass'],
				    'Type' => $row['Type'],
					'Url' => $row['Url'],
					'PageUniqId' => $pageUniqId
				);
			$menu[$count] = $item;	
			$count = $count + 1;
		}
		
		// encode to json
		$encoded = json_encode($menu);

		$dest = $root.'sites/'.$site['FriendlyId'].'/data/';
		
		Utilities::SaveContent($dest, 'menu.json', $encoded);
	}
		
	// publish rss for all page types
	public static function PublishRssForPageTypes($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$list = PageType::GetPageTypes($site['SiteId']);
		
		foreach ($list as $row){
			Publish::PublishRssForPageType($siteUniqId, $row['PageTypeId'], $root);
		}
	}
	
	// publish rss for pages
	public static function PublishRssForPageType($siteUniqId, $pageTypeId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$dest = $root.'sites/'.$site['FriendlyId'];
		
		$pageType = PageType::GetByPageTypeId($pageTypeId);
		
		// generate rss
		$rss = Utilities::GenerateRSS($site, $pageType);
		
		Utilities::SaveContent($dest.'/data/', strtolower($pageType['TypeP']).'.xml', $rss);
	}
	
	// publish sitemap
	public static function PublishSiteMap($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$dest = $root.'sites/'.$site['FriendlyId'];
		
		// generate default site map
		$content = Utilities::GenerateSiteMap($site);
		
		Utilities::SaveContent($dest.'/', 'sitemap.xml', $content);
	}
	
	// publishes a specific css file
	public static function PublishCSS($site, $name, $root = '../'){
	
		// get references to file
	    $lessDir = $root.'sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
	    $cssDir = $root.'sites/'.$site['FriendlyId'].'/css/';

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
			  $less->compileFile($lessFile, $cssFile);

			  return true;
			} 
			catch(exception $e){
			  return false;
			}
    	}
    	else{
    		return false;
    	}

	}

	// publishes all css
	public static function PublishAllCSS($siteUniqId, $root = '../'){

		$site = Site::GetBySiteUniqId($siteUniqId); // test for now

		$lessDir = $root.'sites/'.$site['FriendlyId'].'/themes/'.$site['Theme'].'/styles/';
		
		//get all image files with a .less ext
		$files = glob($lessDir . "*.less");

		//print each file name
		foreach($files as $file){
			$f_arr = explode("/",$file);
			$count = count($f_arr);
			$filename = $f_arr[$count-1];
			$name = str_replace('.less', '', $filename);

			Publish::PublishCSS($site, $name, $root);
		}

	}

	// publishes a fragment
	public static function PublishFragment($siteFriendlyId, $pageUniqId, $status, $content, $root = '../'){

		// clean content
		$content = str_replace( "&nbsp;", ' ', $content);

		$dir = $root.'sites/'.$siteFriendlyId.'/fragments/'.$status.'/';
		
		if(!file_exists($dir)){
			mkdir($dir, 0755, true);	
		}
		
		// create fragment
		$fragment = $root.'sites/'.$siteFriendlyId.'/fragments/'.$status.'/'.$pageUniqId.'.html';
		file_put_contents($fragment, $content); // save to file
	}
	
	// publishes a rendered version of the content
	public static function PublishRender($site, $page, $root = '../'){
	
		// create dir if need be
		$dir = $root.'sites/'.$site['FriendlyId'].'/fragments/render/';

		if(!file_exists($dir)){
			mkdir($dir, 0755, true);	
		}
		
		// get content from published fragment
		$content = '';
		$fragment = $root.'sites/'.$site['FriendlyId'].'/fragments/publish/'.$page['PageUniqId'].'.html';
    
        if(file_exists($fragment)){
          $content = file_get_contents($fragment);
        }
        
        $preview = false;
		
		// run the content through the parser
		$html = Utilities::ParseHTML($site, $page, $content, $preview, $root);
		
		// create fragment
		$fragment = $root.'sites/'.$site['FriendlyId'].'/fragments/render/'.$page['PageUniqId'].'.php';
		file_put_contents($fragment, $html); // save to file
	}
	
	// creates a search index for the page
	public static function BuildSearchIndex($site, $page, $root = '../'){
		
		// get content from published fragment
		$content = '';
		$fragment = $root.'sites/'.$site['FriendlyId'].'/fragments/publish/'.$page['PageUniqId'].'.html';
    
        if(file_exists($fragment)){
          $content = file_get_contents($fragment);
        }
        
        // remove existing index
        SearchIndex::Remove($page['PageUniqId']);
        
        // build the search index for the page in the default language
        $isDefaultLanguage = true;
        Utilities::BuildSearchIndex($site, $page, $site['Language'], $isDefaultLanguage, $content, $root);
		
		// get a list of other languages
		$rootPrefix = $root.'sites/'.$site['FriendlyId'].'/';
		
		// build index for non-default languages
		$languages = Utilities::GetSupportedLanguages($rootPrefix);
		$isDefaultLanguage = false;
		
		foreach($languages as $language){
		
			if($language != $site['Language']){
				Utilities::BuildSearchIndex($site, $page, $language, $isDefaultLanguage, $content, $root);
			}
		
		}
		
	}

	// publishes a page
	public static function PublishPage($pageUniqId, $preview = false, $remove_draft = false, $root = '../'){
	
		$page = Page::GetByPageUniqId($pageUniqId);
        
		if($page!=null){
			
			$site = Site::GetBySiteId($page['SiteId']); // test for now
			$dest = $root.'sites/'.$site['FriendlyId'].'/';
			$imageurl = $dest.'files/';
			$siteurl = 'http://'.$site['Domain'].'/';
			
			$friendlyId = $page['FriendlyId'];
			
			$url = '';
			$file = '';
            
            if($preview==true){
                $previewId = uniqid();
                
                $file = $page['FriendlyId'].'-'.$previewId.'-preview.php';
            }   
            else{
	 	  	    $file = $page['FriendlyId'].'.php';
            }
            
			// create a nice path to store the file
			if($page['PageTypeId']==-1){
				$url = $page['FriendlyId'].'.php';
				$path = '';
			}
			else{
				$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
				
				$path = 'uncategorized/';
				
				if($pageType!=null){
					$path = strtolower($pageType['FriendlyId']).'/';
				}
	
			}
		
			// generate default
			$html = Utilities::GeneratePage($site, $page, $siteurl, $imageurl, $preview, $root);
			
			// remove any drafts associated with the page
			if($remove_draft==true){
			
				$draft = $root.'sites/'.$site['FriendlyId'].'/fragments/draft/'.$page['PageUniqId'].'.html';
					
				if(file_exists($draft)){
					unlink($draft);
				}
			}
			
            if($preview == true){
                 $s_dest = $dest.'preview/';
            }
            else{
			    $s_dest = $dest.$path;
            }
            
			// save the content to the published file
			Utilities::SaveContent($s_dest, $file, $html);
            
            // publish a rendered fragment
            Publish::PublishRender($site, $page, $root);
            
            // build the search index for the page
            Publish::BuildSearchIndex($site, $page, $root);
            
            return $s_dest.$file;
		}
	}
}

?>