<?php

/**
 * A protected API call to add a page
 * @uri /page/add
 */
class PageAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            parse_str($this->request->data, $request); // parse request
            
            // get the page type (if applicable)
            $pageTypeId = -1;
            $pageTypeUniqId = $request['pageTypeUniqId']; // get page type
            
			// check permissions
			if(Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanCreate) == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
            
            // default layout and stylesheet is content
            $layout = 'content';
            $stylesheet = 'content';
            
            if($pageTypeUniqId != '-1'){
                $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);
            
                if($pageType != null){
                    $pageTypeId = $pageType['PageTypeId'];
                    $layout = $pageType['Layout'];
                    $stylesheet = $pageType['Stylesheet'];
                }
            }

            $name = $request['name'];
            $friendlyId = $request['friendlyId'];
            $description = $request['description'];

            $page = Page::Add($friendlyId, $name, $description, $layout, $stylesheet, $pageTypeId, $authUser->SiteId, $authUser->UserId);
            
            // add categories to the page (if set)
            if(isset($request['categories'])){
	            
	            $categories = $request['categories'];
	            
	            $arr = explode(',', $categories);
	            
				foreach($arr as $categoryUniqId) { 
				
					$category = Category::GetByCategoryUniqId($categoryUniqId);
				   
					if($category != NULL){
						Page::AddCategory($page['PageId'], $category['CategoryId']);
					}
				}
	            
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($page);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to edit, delete an existing page
 * @uri /page/{pageUniqId}
 */
class PageResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($pageUniqId) {
    
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			// get page
            $page = Page::GetByPageUniqId($pageUniqId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($authUser->IsSuperAdmin == false && $authUser->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // url
            $page['Url'] = $page['FriendlyId'];
            
            // default permissions
			$canEdit = false;
			$canPublish = false;
			$canRemove = false;

			// get the page type            
            if($page['PageTypeId']!=-1){
	            $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	            $page['Url'] = $pageType['FriendlyId'].'/'.$page['FriendlyId'];
	            
				// get permissions for the page
	            $canEdit = Utilities::CanPerformAction($pageType['PageTypeUniqId'], $authUser->CanEdit);
	            $canPublish = Utilities::CanPerformAction($pageType['PageTypeUniqId'], $authUser->CanPublish);
	            $canRemove = Utilities::CanPerformAction($pageType['PageTypeUniqId'], $authUser->CanRemove);
	        }
            else{
                // get permissions for the page
	            $canEdit = Utilities::CanPerformAction('root', $authUser->CanEdit);
	            $canPublish = Utilities::CanPerformAction('root', $authUser->CanPublish);
	            $canRemove = Utilities::CanPerformAction('root', $authUser->CanRemove);
            }
            
            $page['CanEdit'] = $canEdit;
            $page['CanPublish'] = $canPublish;
            $page['CanRemove'] = $canRemove;


            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($page);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

    /**
     * @method POST
     */
    function update($pageUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

			// get request params
            $name = $request['name'];
            $friendlyId = $request['friendlyId'];
            $description = $request['description'];
            $keywords = $request['keywords'];
            $callout = $request['callout'];
            $rss = $request['rss'];
            $layout = $request['layout'];
            $stylesheet = $request['stylesheet'];
            $beginDate = $request['beginDate'];
            $endDate = $request['endDate'];
            $timeZone = $request['timeZone'];
            $location = $request['location'];
            $latitude = $request['latitude'];
            $longitude = $request['longitude'];
            
            // default is a root element
            $pageTypeUniqId = -1;
            
            // get a reference to a page
            $page = Page::GetByPageUniqId($pageUniqId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($authUser->IsSuperAdmin == false && $authUser->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // get a pagetypeuniqid
            if($page['PageTypeId']!=-1){
	            $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	            $pageTypeUniqId = $pageType['PageTypeUniqId'];
	        }
            
            // get permissions (both publishers and editors can save settings)
            $canEdit = Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanEdit);
            $canPublish = Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanPublish);
            
            // check permissions
			if($canEdit == false && $canPublish == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
            
			// edits settings
            Page::EditSettings($pageUniqId, $name, $friendlyId, $description, $keywords, $callout, 
            	$beginDate, $endDate, $timeZone,
            	$location, $latitude, $longitude,
            	$rss, $layout, $stylesheet, $authUser->UserId);
            
            // add categories to the page (if set)
            if(isset($request['categories'])){
            
            	// remove categories
            	Page::RemoveCategories($page['PageId']);
	            
	            $categories = $request['categories'];
	            
	            $arr = explode(',', $categories);
	            
				foreach($arr as $categoryUniqId) { 
				
					$category = Category::GetByCategoryUniqId($categoryUniqId);
				   
					if($category != NULL){
						Page::AddCategory($page['PageId'], $category['CategoryId']);
					}
				}
	            
            }

            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

    /**
     * @method DELETE
     */
    function remove($pageUniqId) {
    
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	$site = Site::GetBySiteId($authUser->SiteId);
        	$page = Page::GetByPageUniqId($pageUniqId);
        	
        	// make sure the user is part of the site (or is a superadmin)
            if($authUser->IsSuperAdmin == false && $authUser->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
        	// make sure page is part of the site
        	if($page['SiteId']==$site['SiteId']){ 
        	
        		// get file location
        		$path = '../sites/'.$site['FriendlyId'].'/';
        		
        		// set draft, publish, render locations
        		$draft = $path .'fragments/draft/'.$page['PageUniqId'].'.html';
        		$publish = $path .'fragments/publish/'.$page['PageUniqId'].'.html';
        		$render = $path .'fragments/render/'.$page['PageUniqId'].'.php';
        		
        		// default is root
        		$pageTypeUniqId = -1;
        		
        		// determine if file is in sub-direcotry
	        	if($page['PageTypeId']!=-1){
			        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			        $path = '../sites/'.$site['FriendlyId'].'/'.$pageType['FriendlyId'].'/';
			        
			        // set page type
			        $pageTypeUniqId = $pageType['PageTypeUniqId'];
		        }
		        
		        // check permissions
				if(Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanRemove) == false){
					return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
				}
		        
		        // set file
		        $file = $path.$page['FriendlyId'].'.php';
		        
		        // remove file
		        if(file_exists($file)){
		        	unlink($file);
		        }
		        
		        // remove draft
		        if(file_exists($draft)){
		        	unlink($draft);
		        }
		        
				// remove publish
		        if(file_exists($publish)){
		        	unlink($publish);
		        }
		        
		        // remove render
		        if(file_exists($render)){
		        	unlink($render);
		        }
		        
		        // remove page from the DB
		        Page::Remove($pageUniqId);
		        
				return new Tonic\Response(Tonic\Response::OK);
			
	        }
	        else{
		        return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
	        }

        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call to get and save content for a page
 * @uri /page/content/{pageUniqId}
 */
class PageContentResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($pageUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            $site = Site::GetBySiteId($authUser->SiteId);
         
			$draft = '../sites/'.$site['FriendlyId'].'/fragments/draft/'.$pageUniqId.'.html';
            $publish = '../sites/'.$site['FriendlyId'].'/fragments/publish/'.$pageUniqId.'.html';
            
            $content = '';
            
			// (1) try to get a draft, (2) else get a published version
            if(file_exists($draft)){
              $content = file_get_contents($draft);
            }
            else if(file_exists($publish)){
              $content = file_get_contents($publish);
            }
            else{ // create default content for the page
                $page = Page::GetByPageUniqId($pageUniqId); 
                $content = '<div id="block-1" class="block row"><div class="col col-md-12"><h1>'.strip_tags(html_entity_decode($page['Name'])).'</h1><p>'.strip_tags(html_entity_decode($page['Description'])).'</p></div></div>';
            }

            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
            $response->body = $content;

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

    /**
     * @method POST
     */
    function save($pageUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $content = $request['content'];
            $status = $request['status']; // draft or publish
            $image = $request['image'];

			// get page and site
            $page = Page::GetByPageUniqId($pageUniqId);
            $site = Site::GetBySiteId($authUser->SiteId);
            
            // default is root
    		$pageTypeUniqId = -1;
    		
    		// determine if file is in sub-direcotry
        	if($page['PageTypeId']!=-1){
		        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
		        
		        // set page type
		        $pageTypeUniqId = $pageType['PageTypeUniqId'];
	        }

			// get permissions
            $canEdit = Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanEdit);
            $canPublish = Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanPublish);
            
            // check permissions
			if($canEdit == false && $canPublish == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}

			// publish fragment
            Publish::PublishFragment($site['FriendlyId'], $page['PageUniqId'], $status, $content);
            
            $url = '';
            
            // edit timestamp
			Page::EditTimestamp($page['PageUniqId'], $authUser->UserId);
			
			// publish if status is set to publish and the user can publish
            if($status=='publish' && $canPublish == true){
            
            	Page::SetIsActive($page['PageUniqId'], 1);
                $url = Publish::PublishPage($page['PageUniqId'], false, true);
                
                Page::EditImage($page['PageUniqId'], $image, $authUser->UserId);
            }

			// return successful response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
            $response->body = $url;

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to remove files in the preview folder
 * @uri /page/content/preview/remove
 */
class PagePreviewRemoveResource extends Tonic\Resource {

    /**
     * @method DELETE
     */
    function remove() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	// only can remove preview files from own site
            $site = Site::GetBySiteId($authUser->SiteId);
           
            if($site){
                $dir = '../sites/'.$site['FriendlyId'].'/preview/*';
                
                $files = glob($dir); // get all file names
                
                foreach($files as $file){ // iterate files
                  if(is_file($file))
                    unlink($file); // delete file
                }
            }
           
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to generate a preview
 * @uri /page/content/preview/{pageUniqId}
 */
class PagePreviewSaveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function save($pageUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request
            
            $content = $request['content']; // get page type
            $status = 'draft';

			// get page and site
            $page = Page::GetByPageUniqId($pageUniqId);
            $site = Site::GetBySiteId($authUser->SiteId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($authUser->IsSuperAdmin == false && $authUser->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // default is root
    		$pageTypeUniqId = -1;
    		
    		// determine if file is in sub-direcotry
        	if($page['PageTypeId']!=-1){
		        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
		        
		        // set page type
		        $pageTypeUniqId = $pageType['PageTypeUniqId'];
	        }
            
            // get permissions
            $canEdit = Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanEdit);
            $canPublish = Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanPublish);
            
            // check permissions to save a draft
			if($canEdit == true || $canPublish == true){
				Publish::PublishFragment($site['FriendlyId'], $page['PageUniqId'], $status, $content);
			}
           
            // create a preview
            $url = Publish::PublishPage($page['PageUniqId'], true);
            
            // strip leading '../' from string
            $url = str_replace('../', '', $url);

            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
            $response->body = $url;

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}


/**
 * A protected API call to get and save content for a page
 * @uri /page/image/swap
 */
class PageImageResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function save() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $fromUrl = $request['fromUrl']; // get page type
            $toUrl = $request['toUrl']; // draft or publish

            $image_data = file_get_contents($fromUrl);
            file_put_contents($toUrl, $image_data);

            return new Tonic\Response(Tonic\Response::OK);
        
        }
    }
}


/**
 * A protected API call to publish a page
 * @uri /page/publish/{pageUniqId}
 */
class PagePublishResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function publish($pageUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	// get page
        	$page = Page::GetByPageUniqId($pageUniqId);
			
			// make sure the user is part of the site (or is a superadmin)
            if($authUser->IsSuperAdmin == false && $authUser->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }

			// default is root
    		$pageTypeUniqId = -1;
    		
    		// determine if file is in sub-direcotry
        	if($page['PageTypeId']!=-1){
		        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
		        
		        // set page type
		        $pageTypeUniqId = $pageType['PageTypeUniqId'];
	        }
	        
	        // check permissions
			if(Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanPublish) == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}

			// set the page to active
            Page::SetIsActive($pageUniqId, 1);

            // publish the page
            Publish::PublishPage($pageUniqId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call to un-publish a page
 * @uri /page/unpublish/{pageUniqId}
 */
class PageUnPublishResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function unpublish($pageUniqId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			// get page
            $page = Page::GetByPageUniqId($pageUniqId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($authUser->IsSuperAdmin == false && $authUser->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // delete page
            $site = Site::GetBySiteId($page['SiteId']);
            $filename = '../sites/'.$site['FriendlyId'].'/';


			// default is root
			$pageTypeUniqId = -1;

			// get $pageTypeUniqId
            if($page['PageTypeId']!=-1){
                $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
                $filename .= strtolower($pageType['FriendlyId']).'/';
                
                $pageTypeUniqId = $pageType['PageTypeUniqId'];
            }
            
            // check permissions
            if(Utilities::CanPerformAction($pageTypeUniqId, $authUser->CanPublish) == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}

            // set active
            Page::SetIsActive($pageUniqId, 0);
            
            // remove file
            $filename = $filename.$page['FriendlyId'].'.php';
            
            if(file_exists($filename)){
                unlink($filename);
            }
        
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call that shows all pages
 * @uri /page/list/all
 */
class PageListAll extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            // get pages
            $list = Page::GetPagesForSite($authUser->SiteId, true);
            
            $pages = array();
            
            foreach ($list as $row){

                $page = Page::GetByPageId($row['PageId']);

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $row['LastModifiedFullName'] = $fullName;

                $imageUrl = '';
                $thumbUrl = '';


                $row['Image'] = $imageUrl;
                $row['Thumb'] = $thumbUrl;

                $url = $page['FriendlyId'];
                
                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
                }

                $row['Url'] = $url;
                
                // permissions are not applicable to this API call
	            $row['CanEdit'] = '';
	            $row['CanPublish'] = '';
	            $row['CanRemove'] = '';
                    
                $pages[$row['PageUniqId']] = $row;
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($pages);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

/**
 * A protected API call that shows all pages for a given PageType.FriendlyId
 * @uri /page/list/sorted
 */
class PageListSortedResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	parse_str($this->request->data, $request); // parse request
            
            $friendlyId = $request['friendlyId']; // get page type
            $sort = $request['sort'];
            
            $categoryId = -1;
            
            if(isset($request['categoryUniqId'])){
	            $categoryUniqId = $request['categoryUniqId'];
	            $category = Category::GetByCategoryUniqId($request['categoryUniqId']);
	            $categoryId = $category['CategoryId'];
            }
        
			// default
			$orderBy = 'LastModifiedDate DESC';
        
			// don't pass directly to DB
			if($sort=='date desc'){
				$orderBy = 'LastModifiedDate DESC';
			}
			
			if($sort=='date asc'){
				$orderBy = 'LastModified ASC';
			}
			
			if($sort=='name desc'){
				$orderBy = 'Name DESC';
			}
			
			if($sort=='name asc'){
				$orderBy = 'Name ASC';
			}
        
            $siteId = $authUser->SiteId;
            $pageSize = 100;
            
            $page = 0;

            $pageTypeId = -1;
            $dir = '/';

            if($friendlyId!='root'){ // get pagetype
                $pageType = PageType::GetByFriendlyId($friendlyId, $siteId);
                $pageTypeId = $pageType['PageTypeId'];
                $dir = strtolower($pageType['TypeS']).'/';
            }
            
            // get site url
            $site = Site::GetBySiteId($authUser->SiteId);

            $dir = 'sites/'.$site['FriendlyId'].'/files/';

            // get pages
            if($categoryId == -1){
            	$list = Page::GetPages($siteId, $pageTypeId, $pageSize, $page, $orderBy);
            }
            else{
	            $list = Page::GetPagesByCategory($siteId, $pageTypeId, $pageSize, $page, $orderBy, $categoryId);
            }
            
            $pages = array();
            
            foreach ($list as $row){

                $page = Page::GetByPageId($row['PageId']);

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $page['LastModifiedFullName'] = $fullName;

                $thumbUrl = '';

                if($page['Image']!=''){
                
                	if (strpos($page['Image'],'t-') !== false) {
					    $thumbUrl = $dir.$page['Image'];
					}
					else{
                   		$thumbUrl = $dir.'t-'.$page['Image'];
                    }
                    
                }

                $page['Thumb'] = $thumbUrl;

                $url = $page['FriendlyId'];

				// default permissions
				$canEdit = false;
				$canPublish = false;
				$canRemove = false;

                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
                    
                    // set edit permissions
					if($authUser->CanEdit=='All' || strpos($authUser->CanEdit, $pageType['PageTypeUniqId']) !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($authUser->CanPublish=='All' || strpos($authUser->CanPublish, $pageType['PageTypeUniqId']) !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($authUser->CanRemove=='All' || strpos($authUser->CanRemove, $pageType['PageTypeUniqId']) !== FALSE){
						$canRemove = true;
					}
					
                }
                else{
	                
	                // set edit permissions
					if($authUser->CanEdit=='All' || strpos($authUser->CanEdit, 'root') !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($authUser->CanPublish=='All' || strpos($authUser->CanPublish, 'root') !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($authUser->CanRemove=='All' || strpos($authUser->CanRemove, 'root') !== FALSE){
						$canRemove = true;
					}
	                
                }
                
                $page['CanEdit'] = $canEdit;
                $page['CanPublish'] = $canPublish;
                $page['CanRemove'] = $canRemove;

                $page['Url'] = $url;
                
                // determine if the page has a draft
                $draft = '../sites/'.$site['FriendlyId'].'/fragments/draft/'.$page['PageUniqId'].'.html';
                
                $hasDraft = false;
                
                if(file_exists($draft)){
                	$hasDraft = true;
                }
                
                $page['HasDraft'] = $hasDraft;
                
                $pages[$row['PageUniqId']] = $page;
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($pages);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

/**
 * A protected API call that shows all pages for a given PageType.FriendlyId
 * @uri /page/list/{friendlyId}
 */
class PageListFriendlyResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($friendlyId) {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            $siteId = $authUser->SiteId;
            $pageSize = 100;
            $orderBy = 'Created DESC';
            $page = 0;

            $pageTypeId = -1;
            $dir = '/';

            if($friendlyId!='root'){ // get pagetype
                $pageType = PageType::GetByFriendlyId($friendlyId, $siteId);
                $pageTypeId = $pageType['PageTypeId'];
                $dir = strtolower($pageType['TypeS']).'/';
            }
            
            // get site url
            $site = Site::GetBySiteId($authUser->SiteId);

            $dir = 'sites/'.$site['FriendlyId'].'/files/';

            // get pages
            $list = Page::GetPages($siteId, $pageTypeId, $pageSize, $page, $orderBy);
            
            $pages = array();
            
            foreach ($list as $row){

                $page = Page::GetByPageId($row['PageId']);

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $page['LastModifiedFullName'] = $fullName;

                $thumbUrl = '';

                if($page['Image']!=''){
                
                	if (strpos($page['Image'],'t-') !== false) {
					    $thumbUrl = $dir.$page['Image'];
					}
					else{
                   		$thumbUrl = $dir.'t-'.$page['Image'];
                    }
                    
                }
                
                // set thumb
                $page['Thumb'] = $thumbUrl;

                $url = $page['FriendlyId'];

                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
                }

				// set url
                $page['Url'] = $url;
                
                // permissions are not applicable to this API call
	            $page['CanEdit'] = '';
	            $page['CanPublish'] = '';
	            $page['CanRemove'] = '';

                    
                $pages[$row['PageUniqId']] = $page;
            }
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($pages);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

?>