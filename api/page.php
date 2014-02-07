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
            $response->contentType = 'applicaton/json';
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

            $page = Page::GetByPageUniqId($pageUniqId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
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
           
            Page::EditSettings($pageUniqId, $name, $friendlyId, $description, $keywords, $callout, 
            	$beginDate, $endDate, $timeZone,
            	$location, $latitude, $longitude,
            	$rss, $layout, $stylesheet, $authUser->UserId);
            
            // add categories to the page (if set)
            if(isset($request['categories'])){
            
            	$page = Page::GetByPageUniqId($pageUniqId);
            
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
        	
        	if($page['SiteId']==$site['SiteId']){ // make sure page is part of the site
        	
        		$file = '../sites/'.$site['FriendlyId'].'/'.$page['FriendlyId'].'.php';
        	
	        	if($page['PageTypeId']!=-1){
			        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			        $file = '../sites/'.$site['FriendlyId'].'/'.$pageType['FriendlyId'].'/'.$page['FriendlyId'].'.php';
		        }
		        
		        //print $file;
		        
		        // remove page
		        Page::Remove($pageUniqId);
		        
		        // remove file
		        if(file_exists($file)){
		        	unlink($file);
		        }

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

            $page = Page::GetByPageUniqId($pageUniqId);
            $site = Site::GetBySiteId($authUser->SiteId);

            Publish::PublishFragment($site['FriendlyId'], $page['PageUniqId'], $status, $content);
            
            $url = '';
            
			Page::EditTimestamp($page['PageUniqId'], $authUser->UserId);
			
            if($status=='publish'){
            
            	Page::SetIsActive($page['PageUniqId'], 1);
                $url = Publish::PublishPage($page['PageUniqId'], false, true);
                
                if($image!=''){
                    Page::EditImage($page['PageUniqId'], $image, $authUser->UserId);
                }
            }

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

            $page = Page::GetByPageUniqId($pageUniqId);
            $site = Site::GetBySiteId($authUser->SiteId);
            
            Publish::PublishFragment($site['FriendlyId'], $page['PageUniqId'], $status, $content);
            
            $url = Publish::PublishPage($page['PageUniqId'], true); // publish a preview page
            
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

            $page = Page::GetByPageUniqId($pageUniqId);

            Page::SetIsActive($pageUniqId, 1);

            // delete page
            $site = Site::GetBySiteId($page['SiteId']);
            $filename = '../sites/'.$site['FriendlyId'].'/';


            if($page['PageTypeId']!=-1){
                $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
                $filename .= strtolower($pageType['FriendlyId']).'/';
            }

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
                    
                $pages[$row['PageUniqId']] = $row;
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
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

                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
                }

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
            $response->contentType = 'applicaton/json';
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

                $page['Thumb'] = $thumbUrl;

                $url = $page['FriendlyId'];

                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
                }

                $page['Url'] = $url;
                    
                $pages[$row['PageUniqId']] = $page;
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($pages);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}


/**
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /page/published/list
 */
class PageListResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        parse_str($this->request->data, $request); // parse request
        $siteUniqId = $request['siteUniqId'];
        $pageTypeUniqId = $request['pageTypeUniqId'];
        $pageSize = $request['pageSize'];
        $orderBy = $request['orderBy'];
        $page = $request['page'];
        
        // get a categoryUniqId (if set)
        $categoryUniqId = '-1';
        
        if(isset($request['category'])){
        	$categoryUniqId = $request['category'];
        }
        
        // get language
        $language = 'en';
        
        if(isset($request['language'])){
        	$language = $request['language'];
		}

		// set order
        if($orderBy=='Created'){
            $orderBy = $orderBy.' DESC';
        }
        else{
            $orderBy = $orderBy.' ASC';
        }

        if($pageSize==''){
            $pageSize = 10;
        }

        $site = Site::GetBySiteUniqId($siteUniqId);
        $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);


		// set language to the domain for the site
    	$domain = '../sites/'.$site['FriendlyId'].'/locale';
		
		Utilities::SetLanguage($language, $domain);

		// set destination
        $dest = 'sites/'.$site['FriendlyId'];
        
        // Get all pages
        $hasCategory = false;
        
        // if category is set, try to get pages by Category
        if($categoryUniqId != '-1'){
	        $category = Category::GetByCategoryUniqId($categoryUniqId);
	        
	        if(isset($category['CategoryId'])){
	        	$hasCategory = true;
	        	$list = Page::GetPagesByCategory($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, $category['CategoryId'], true);
	        }
        }
        
        // if the category did not work or is not set, just get a list by the other params
        if($hasCategory == false){
	        $list = Page::GetPages($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, true);
        }
        
        $pages = array();
        
        foreach ($list as $row){

            $page = Page::GetByPageId($row['PageId']);

            $name = $row['FirstName'].' '.$row['LastName'];
            
            // get image url
            $thumbUrl = '';
            $imageUrl = '';
            $hasImage = false;
            
            if($page['Image']!=''){
                $hasImage = true;
                $thumbUrl = 'files/'.$page['Image'];
                $imageUrl = 'files/'.substr($page['Image'], 2);
            }
            
            $hasCallout = false;
            
            if($page['Callout']!=''){
                $hasCallout = true;
            }

            $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
            
            $item = array(
                    'PageUniqId'  => $page['PageUniqId'],
                    'Name' => _($page['Name']),	// get a translation for name, description, and callout
                    'Description' => _($page['Description']),
                    'Callout' => _($page['Callout']),
                    'HasCallout' => $hasCallout,
                    'Url' => $url,
                    'Image' => $imageUrl,
                    'Thumb' => $thumbUrl,
                    'HasImage' => $hasImage,
                    'LastModified' => $page['LastModifiedDate'],
                    'Author' => $name
                );
            
            array_push($pages, $item);
        }

        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'applicaton/json';
        $response->body = json_encode($pages);

        return $response;

        return new Tonic\Response(Tonic\Response::CREATED);
    }

}

/**
 * This is a public API call that shows you the list of pages for the specified parameters in blog format
 * @uri /page/published/blog
 */
class PageBlogResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        parse_str($this->request->data, $request); // parse request
        $siteUniqId = $request['siteUniqId'];
        $pageTypeUniqId = $request['pageTypeUniqId'];
        $pageSize = $request['pageSize'];
        $orderBy = $request['orderBy'];
        $page = $request['page'];
        $prefix = $request['prefix'];
        
        // get a categoryUniqId (if set)
        $categoryUniqId = '-1';
        
        if(isset($request['category'])){
        	$categoryUniqId = $request['category'];
        }
        
        // get language
        $language = 'en';
        
        if(isset($request['language'])){
        	$language = $request['language'];
		}

        if($orderBy=='Created'){ // need to check these to prevent SQL injections
            $orderBy = 'Pages.Created DESC';
        }
        else{
            $orderBy = 'Pages.Name ASC';
        }

        if($pageSize==''){
            $pageSize = 10;
        }

        $site = Site::GetBySiteUniqId($siteUniqId);
        $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);


        $dest = 'sites/'.$site['FriendlyId'];
        
         // Get all pages
        $hasCategory = false;
        
        // if category is set, try to get pages by Category
        if($categoryUniqId != '-1'){
	        $category = Category::GetByCategoryUniqId($categoryUniqId);
	        
	        if(isset($category['CategoryId'])){
	        	$hasCategory = true;
	        	$list = Page::GetPagesByCategory($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, $category['CategoryId'], true);
	        }
        }
        
        // if the category did not work or is not set, just get a list by the other params
        if($hasCategory == false){
	        $list = Page::GetPages($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, true);
        }
        
        $pages = array();
        
        foreach ($list as $row){

            $page = Page::GetByPageId($row['PageId']);

            $name = $row['FirstName'].' '.$row['LastName'];
            
            // get image url
            $thumbUrl = '';
            $imageUrl = '';
            $mImageUrl = '';
            
            $url = 'http://'.$site['Domain'].'/'.strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
            
            // create a readable date
            $date = DateTime::createFromFormat('Y-m-d H:i:s', $page['LastModifiedDate']);
            $local = new DateTimeZone($site['TimeZone']);
			$date->setTimezone($local);
			$readable = $date->format('D, M d y h:i a');
			
            $item = array(
                    'PageUniqId'  => $page['PageUniqId'],
                    'Name' => $page['Name'],
                    'Description' => $page['Description'],
                    'Callout' => $page['Callout'],
                    'Url' => $url,
                    'Image' => $imageUrl,
                    'Thumb' => $thumbUrl,
                    'LastModified' => $page['LastModifiedDate'],
                    'LastModifiedReadable' => $readable,
                    'Author' => $name
                );
                
            $fragment = '../sites/'.$site['FriendlyId'].'/fragments/render/'.$page['PageUniqId'].'.php';

            if(file_exists($fragment)){
            
            	// set language to the domain for the site
            	$domain = '../sites/'.$site['FriendlyId'].'/locale';
				
				Utilities::SetLanguage($language, $domain);
				
            	ob_start(); // start output buffer
            	
				textdomain($domain);

			    include $fragment;
			    $content = ob_get_contents(); // get contents of buffer
			    
			    ob_end_clean();
			    
                //$content = file_get_contents($fragment); #old
            }
            else{
                $content = 'Not found';
            }

			// fix nested, relative URLs if displayed in the root
			if($prefix == ''){
				$content = str_replace('src="../', 'src="', $content);
				$content = str_replace('href="../', 'href="', $content);	
			}
			
			// update images with sites/[name] to a relative URL
			$content = str_replace('src="sites/'.$site['FriendlyId'].'/', 'src="'.$prefix, $content);
			
            $item['Content'] = $content;
            
            array_push($pages, $item);
        }

        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'applicaton/json';
        $response->body = json_encode($pages);

        return $response;
    }

}

/**
 * This is a public API call that shows the total # of published pages for your site
 * @uri /page/published/total
 */
class PageTotalResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        parse_str($this->request->data, $request); // parse request
        $siteUniqId = $request['siteUniqId'];
        $pageTypeUniqId = $request['pageTypeUniqId'];

        $site = Site::GetBySiteUniqId($siteUniqId);
        $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);

        // Get all pages
        $total = Page::GetPagesCount($site['SiteId'], $pageType['PageTypeId'], true);
        
        $json = '{"total":"'.$total.'"}';

        header('Content-type: application/json');
        
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'applicaton/json';
        $response->body = $json;

        return $response;
    }

}

?>