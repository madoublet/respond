<?php

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
        $siteUniqId = SITE_UNIQ_ID;
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

		// set order
        if($orderBy=='Created' or $orderBy=='BeginDate'){
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
    	$domain = '../locale';
		
		Utilities::SetLanguage($language, $domain);

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
                $thumbUrl = 'files/t-'.$page['Image'];
                $imageUrl = 'files/'.substr($page['Image'], 2);
            }
            
            // check for callout
            $hasCallout = false;
            
            if($page['Callout']!=''){
                $hasCallout = true;
            }

			// get photo
            $hasPhoto = false;
            $photo = '';
            
            if($row['PhotoUrl'] != null && $row['PhotoUrl'] != ''){
	            $hasPhoto = true;
	            $photo = 'files/'.$row['PhotoUrl'];
            }

			// build URL
            $url = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
            
            $item = array(
                    'PageUniqId'  => $page['PageUniqId'],
                    'Name' => _($page['Name']),	// get a translation for name, description, and callout
                    'Description' => _($page['Description']),
                    'Callout' => _($page['Callout']),
                    'Location' => $page['Location'],
                    'LatLong' => $page['LatLong'],
                    'HasCallout' => $hasCallout,
                    'Url' => $url,
                    'Image' => $imageUrl,
                    'Thumb' => $thumbUrl,
                    'HasImage' => $hasImage,
                    'LastModified' => $page['LastModifiedDate'],
                    'Author' => $name,
                    'HasPhoto' => $hasPhoto,
                    'Photo' => $photo
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
        $siteUniqId = SITE_UNIQ_ID;
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

        if($orderBy=='Created' or $orderBy=='BeginDate'){// need to check these to prevent SQL injections
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

			// get name
            $name = $row['FirstName'].' '.$row['LastName'];
            
            // get photo
            $hasPhoto = false;
            $photo = '';
            
            if($row['PhotoUrl'] != null && $row['PhotoUrl'] != ''){
	            $hasPhoto = true;
	            $photo = 'files/'.$row['PhotoUrl'];
            }
            
            // get image url
            $thumbUrl = '';
            $imageUrl = '';
            $mImageUrl = '';
            
            $url = 'http://'.$site['Domain'].'/'.strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
            
			$local = new DateTimeZone($site['TimeZone']);
            // create a readable date
            $date = DateTime::createFromFormat('Y-m-d H:i:s', $page['LastModifiedDate']);
			$date->setTimezone($local);
			$readable = $date->format('D, M d y h:i a');
			
			// create a readable event date
			$readableEventBeginDate = $readable;
			$eventBeginDate = DateTime::createFromFormat('Y-m-d H:i:s', $page['BeginDate']);
			if($eventBeginDate!=null)
			{
				$eventBeginDate->setTimezone($local);
				$readableEventBeginDate = $eventBeginDate->format('D, M d y h:i a');
			}
			
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
					'BeginDateReadable' => $readableEventBeginDate,
                    'Author' => $name,
                    'HasPhoto' => $hasPhoto,
                    'Photo' => $photo
                );
                
            $fragment = '../fragments/render/'.$page['PageUniqId'].'.php';

            if(file_exists($fragment)){
            
            	// set language to the domain for the site
            	$domain = '../locale';
				
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
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /page/published/calendar
 */
class PageCalendarResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        parse_str($this->request->data, $request); // parse request
        $siteUniqId = SITE_UNIQ_ID;
        $pageTypeUniqId = $request['pageTypeUniqId'];
        $pageSize = $request['pageSize'];
        $orderBy = $request['orderBy'];
        $page = $request['page'];
        $prefix = $request['prefix'];
        
        // get begin and end
        $beginDate = $request['beginDate'];
        $endDate = $request['endDate'];
        
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
        $orderBy = 'BeginDate ASC';

        if($pageSize==''){
            $pageSize = 10;
        }

        $site = Site::GetBySiteUniqId($siteUniqId);
        $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);

		// set language to the domain for the site
    	$domain = '../locale';
		
		Utilities::SetLanguage($language, $domain);

        // Get all pages
        $hasCategory = false;
        
        // if category is set, try to get pages by Category
        if($categoryUniqId != '-1'){
	        $category = Category::GetByCategoryUniqId($categoryUniqId);
	        
	        if(isset($category['CategoryId'])){
	        	$hasCategory = true;
	        	$list = Page::GetPagesByCategoryForDates($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, $category['CategoryId'], true, $beginDate, $endDate);
	        }
        }
        
        // if the category did not work or is not set, just get a list by the other params
        if($hasCategory == false){
	        $list = Page::GetPagesForDates($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, true, $beginDate, $endDate);
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
                $thumbUrl = 'files/t-'.$page['Image'];
                $imageUrl = 'files/'.substr($page['Image'], 2);
            }
            
            // check for callout
            $hasCallout = false;
            
            if($page['Callout']!=''){
                $hasCallout = true;
            }
            
            // get photo
            $hasPhoto = false;
            $photo = '';
            
            if($row['PhotoUrl'] != null && $row['PhotoUrl'] != ''){
	            $hasPhoto = true;
	            $photo = 'files/'.$row['PhotoUrl'];
            }

            $url = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
            
            // create a readable begin date
            $begin = DateTime::createFromFormat('Y-m-d H:i:s', $page['BeginDate']);
            $local = new DateTimeZone($site['TimeZone']);
			$begin->setTimezone($local);
			$beginReadable = $begin->format('D, M d y h:i a');
			
			// create a readable end date
            $end = DateTime::createFromFormat('Y-m-d H:i:s', $page['EndDate']);
            $local = new DateTimeZone($site['TimeZone']);
			$end->setTimezone($local);
			$endReadable = $end->format('D, M d y h:i a');
			
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
                    'BeginDate' => $begin->format('Y-m-d H:i:s'),
                    'BeginDateReadable' => $beginReadable,
                    'EndDate' => $end->format('Y-m-d H:i:s'),
                    'EndDateReadable' => $endReadable,
                    'LastModified' => $page['LastModifiedDate'],
                    'Author' => $name,
                    'HasPhoto' => $hasPhoto,
                    'Photo' => $photo
                );
            
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
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /page/published/featured
 */
class PageFeaturedResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function get() {

        parse_str($this->request->data, $request); // parse request
        $siteUniqId = SITE_UNIQ_ID;
        
        $pageUniqId = $request['pageUniqId'];
        $prefix = $request['prefix'];
        
        // handle reverse lookup
        if(strpos($pageUniqId, 'lookup:') !== FALSE){
	    	
	    	$url = str_replace('lookup:', '', $pageUniqId);
	    	
	    	$page = Page::GetByUrl($url, SITE_ID);
	    	
	    	if($page != NULL){
		    	$pageUniqId = $page['PageUniqId'];
	    	}
	    	    
        }
        
        // get language
        $language = 'en';
        
        if(isset($request['language'])){
        	$language = $request['language'];
		}
        
        $site = Site::GetBySiteUniqId($siteUniqId);
        
		// get fragment
		$fragment = '../fragments/render/'.$pageUniqId.'.php';

        if(file_exists($fragment)){
        
        	// set language to the domain for the site
        	$domain = '../locale';
			
			Utilities::SetLanguage($language, $domain);
			
        	ob_start(); // start output buffer
        	
			textdomain($domain);

		    include $fragment;
		    $content = ob_get_contents(); // get contents of buffer
		    
		    ob_end_clean();
		    
		    // fix nested, relative URLs if displayed in the root
			if($prefix == ''){
				$content = str_replace('src="../', 'src="', $content);
				$content = str_replace('href="../', 'href="', $content);	
			}
			
			// update images with sites/[name] to a relative URL
			$content = str_replace('src="sites/'.$site['FriendlyId'].'/', 'src="'.$prefix, $content);
		    
            // return html response
	        $response = new Tonic\Response(Tonic\Response::OK);
	        $response->contentType = 'text/html';
	        $response->body = $content;
	        
	        return $response;
        }
        else{
	       	return new Tonic\Response(Tonic\Response::NOTFOUND);
        }
        
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
        $siteUniqId = SITE_UNIQ_ID;
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
