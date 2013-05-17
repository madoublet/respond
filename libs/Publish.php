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
		
		// publish common images
		Publish::PublishCommonImages($siteUniqId, $root);
		
		// publish template images
		Publish::PublishTemplateImages($siteUniqId, $root);
		
		// publish controller
		Publish::PublishHtaccess($siteUniqId, $root);

		// publish plugins
		Publish::PublishPlugins($siteUniqId, $root);
	}
	
	// publishes the controller
	public static function PublishHtaccess($siteUniqId, $root = '../'){
        
        $site = Site::GetBySiteUniqId($siteUniqId);
        
		$src = $root.'sites/common/.htaccess';
		$dest = $root.'sites/'.$site['FriendlyId'].'/.htaccess';
		
		copy($src, $dest); // copy the controller
	}

	// publishes plugins
	public static function PublishPlugins($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		// create plugin directory
		$dest = $root.'sites/'.$site['FriendlyId'].'/plugins';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0777, true);	
		}
		
		$json = file_get_contents('../plugins/plugins.json');
		$data = json_decode($json, true);

		foreach($data as &$item) {
			$type = $item['type'];

			$p_src = 'plugins/'.$type.'/deploy';

			if(file_exists($p_src)){

				$p_dest = $root.'sites/'.$site['FriendlyId'].'/plugins/'.$type;

				if(!file_exists($p_dest)){
					mkdir($p_dest, 0777, true);	
				}

				Utilities::CopyDirectory($p_src, $p_dest);
			}

		}
		
	}

	// publishes a template
	public static function PublishTemplate($site, $template, $root='../'){

		$template_dir = $root.'sites/'.$site['FriendlyId'].'/templates/';
		$src = $root.'templates/'.$template.'/';
		$dest = $root.'sites/'.$site['FriendlyId'].'/templates/'.$template.'/';

		if(!file_exists($template_dir)){
			mkdir($template_dir, 0777, true);	
		}

		Utilities::CopyDirectory($src, $dest);
	}
	
	// publishes common folder (during enrollment)
	public static function PublishCommonForEnrollment($siteUniqId, $root='../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		// publish files
		$src = $root.'templates/common/files';
		$dest = $root.'sites/'.$site['FriendlyId'].'/files';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0777, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
		
	}
	
	// publishes common js
	public static function PublishCommonJS($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$src = $root.'sites/common/js';
		$dest = $root.'sites/'.$site['FriendlyId'].'/js';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0777, true);	
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
			mkdir($dest, 0777, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
	}
	
	// publishes common images
	public static function PublishCommonImages($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$src = $root.'sites/common/images';
		$dest = $root.'sites/'.$site['FriendlyId'].'/images';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0777, true);	
		}
		
		// copies a directory
		Utilities::CopyDirectory($src, $dest);
		
	}
	
	// publishes template images
	public static function PublishTemplateImages($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$src = $root.'templates/'.$site['Template'].'/images';
		$dest = $root.'sites/'.$site['FriendlyId'].'/images';
		
		// create dir if it doesn't exist
		if(!file_exists($dest)){
			mkdir($dest, 0777, true);	
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
			Publish::PublishPage($row['PageUniqId'], false, $root);
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
		$rss = Generator::GenerateRSS($site, $pageType);
		
		Utilities::SaveContent($dest.'/data/', strtolower($pageType['TypeP']).'.xml', $rss);
	}
	
	// publish sitemap
	public static function PublishSiteMap($siteUniqId, $root = '../'){
		
		$site = Site::GetBySiteUniqId($siteUniqId);
		
		$dest = $root.'sites/'.$site['FriendlyId'];
		
		// generate default site map
		$content = Generator::GenerateSiteMap($site);
		
		Utilities::SaveContent($dest.'/', 'sitemap.xml', $content);
	}
	
	// publishes a specific css file
	public static function PublishCSS($site, $name, $root = '../'){
	
		// get references to file
	    $lessDir = $root.'sites/'.$site['FriendlyId'].'/templates/'.$site['Template'].'/less/';
	    $cssDir = $root.'sites/'.$site['FriendlyId'].'/css/';

	    $lessFile = $lessDir.$name.'.less';
	    $cssFile = $cssDir.$name.'.css';

	    // create css directory (if needed)
	    if(!file_exists($cssDir)){
			mkdir($cssDir, 0777, true);	
		}

	    if(file_exists($lessFile)){
	    	$content = file_get_contents($lessFile);

	    	$less = new lessc;

	    	try{
			  $less->checkedCompile($lessFile, $cssFile);

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

		$lessDir = $root.'sites/'.$site['FriendlyId'].'/templates/'.$site['Template'].'/less/';
		
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
		$content = str_replace( "&nbsp;", '', $content);

		$dir = $root.'sites/'.$siteFriendlyId.'/fragments/'.$status.'/';

		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}

		// create fragment
		$fragment = $root.'sites/'.$siteFriendlyId.'/fragments/'.$status.'/'.$pageUniqId.'.html';
		file_put_contents($fragment, $content); // save to file
	}

	// publishes a page
	public static function PublishPage($pageUniqId, $preview = false, $root = '../'){
	
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
			$html = Generator::GeneratePage($site, $page, $siteurl, $imageurl, $preview, $root);
            
            if($preview == true){
                 $s_dest = $dest.'preview/';
            }
            else{
			    $s_dest = $dest.$path;
            }
        
			Utilities::SaveContent($s_dest, $file, $html);
            
            return $s_dest.$file;
		}
	}
}

?>