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

       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site, user
			$site = Site::GetBySiteId($token->SiteId);
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
        
            parse_str($this->request->data, $request); // parse request
            
            // get request paramters
            $pageTypeId = $request['pageTypeId'];
            $name = $request['name'];
            $friendlyId = $request['friendlyId'];
            $description = $request['description'];
            
            
			// check permissions
			if(Utilities::CanPerformAction($pageTypeId, $access['CanCreate']) == false){
				return new Tonic\Response(Tonic\Response::BADREQUEST);
			}
            
            // default layout and stylesheet is content
            $layout = 'content';
            $stylesheet = 'content';
            
            if($pageTypeId != '-1'){
                $pageType = PageType::GetByPageTypeId($pageTypeId);
            
                if($pageType != null){
                    $pageTypeId = $pageType['PageTypeId'];
                    $layout = $pageType['Layout'];
                    $stylesheet = $pageType['Stylesheet'];
                }
            }

			// add page
            $page = Page::Add($friendlyId, $name, $description, $layout, $stylesheet, $pageTypeId, $token->SiteId, $token->UserId);
            
            // set content (if pageId set)
            if(isset($request['pageId'])){
            	
            	// get existing page
            	$existing_page = Page::GetByPageId($request['pageId']);
            	
            	// set content for page						
				Page::EditContent($page['PageId'], $existing_page['Content'], $token->UserId);
            
            }
            
            
            $fullName = $user['FirstName'].' '.$user['LastName'];
            $row['LastModifiedFullName'] = $fullName;

			// init url
            $url = $page['FriendlyId'];
            
			// init PT
			$pageType = NULL;
            
			// get url, permissions
            if($page['PageTypeId']!=-1){
                $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

				if($pageType != NULL){
	                $url = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
	                
	                // set edit permissions
					if($access['CanEdit']=='All' || strpos($access['CanEdit'], $pageType['PageTypeId']) !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($access['CanPublish']=='All' || strpos($access['CanPublish'], $pageType['PageTypeId']) !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($access['CanRemove']=='All' || strpos($access['CanRemove'], $pageType['PageTypeId']) !== FALSE){
						$canRemove = true;
					}
				}
				
            }
            else{
                
                // set edit permissions
				if($access['CanEdit']=='All' || strpos($access['CanEdit'], 'root') !== FALSE){
					$canEdit = true;
				}
				
				// set publish permissions
				if($access['CanPublish']=='All' || strpos($access['CanPublish'], 'root') !== FALSE){
					$canPublish = true;
				}
				
				// set remove permissions
				if($access['CanRemove']=='All' || strpos($access['CanRemove'], 'root') !== FALSE){
					$canRemove = true;
				}
                
            }
            
            // init
            $imageURL = '';
            $thumbURL = '';
            
			// get thumb url
			if($page['Image']!=''){
			
				// set images URL
				$imagesURL = $site['Domain'];
				$thumbURL = $imagesURL.'/files/thumbs/'.$page['Image'];
				$imageURL = $imagesURL.'/files/'.$page['Image'];
				
            }

            $page['Image'] = $imageURL;
            $page['Thumb'] = $thumbURL;
           
           	// set permissions 
            $page['CanEdit'] = $canEdit;
            $page['CanPublish'] = $canPublish;
            $page['CanRemove'] = $canRemove;

			// set url
            $page['Url'] = $url;
                        
            // no drafts on new page
            $page['HasDraft'] = false;
            
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
 * A protected API call to add a page
 * @uri /page/edit/tags
 */
class PageEditTagsResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
        
            parse_str($this->request->data, $request); // parse request
			$pageId = $request['pageId'];
            $tags = $request['tags'];

			// get page
            $page = Page::GetByPageId($pageId);
            
            // check permissions
			if(Utilities::CanPerformAction($page['PageTypeId'], $access['CanEdit']) == false){
				return new Tonic\Response(Tonic\Response::BADREQUEST);
			}

            $page = Page::EditTags($pageId, $tags, $token->UserId);
  
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
 * A protected API call to remove a page
 * @uri /page/remove
 */
class PageRemoveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			$user = User::GetByUserId($token->UserId);
			$site = Site::GetBySiteId($token->SiteId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
        
        	parse_str($this->request->data, $request); // parse request
			$pageId = $request['pageId'];
        
        	$page = Page::GetByPageId($pageId);
        	
        	// check permissions
			if(Utilities::CanPerformAction($page['PageTypeId'], $access['CanEdit']) == false){
				return new Tonic\Response(Tonic\Response::BADREQUEST);
			}
            
        	// make sure page is part of the site
        	if($page['SiteId']==$site['SiteId']){ 
        	
        		// get file location
        		$path = SITES_LOCATION.'/'.$site['FriendlyId'].'/';
        		$static_path = SITES_LOCATION.'/'.$site['FriendlyId'].'/';
        		
        		// default is root
        		$pageTypeId = -1;
        		
        		// set file
				$file = $page['FriendlyId'].'.html';
				
				// set file
				if($page['PageTypeId'] != -1){
					
					$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			        
					if($pageType != NULL){
						$pageTypeId = $pageType['PageTypeId'];
		    			
		    			$file = $pageType['FriendlyId'].'.'.$page['FriendlyId'].'.html';
		    			$static_path = $static_file.$pageType['FriendlyId'].'/';
		    		}
				}
        		
		        // check permissions
				if(Utilities::CanPerformAction($pageTypeId, $access['CanRemove']) == false){
					return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
				}
		        
		        // set template
				$template = $path.'templates/page/'.$file;
		        
		        // remove template
		        if(file_exists($template)){
		        	unlink($template);
		        }
		        
		        $static_file = $static_path.$file;
		        
		        // remove static file if it exists
		        if(file_exists($static_file)){
		        	unlink($static_file);
		        }
		        
		        // remove page from the DB
		        Page::Remove($pageId);
		        
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
 * A protected API call to publish a page
 * @uri /page/publish
 */
class PagePublishResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function publish() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
        
        	parse_str($this->request->data, $request); // parse request
			$pageId = $request['pageId'];
        
        	// get page
        	$page = Page::GetByPageId($pageId);
			
			// make sure the user is part of the site (or is a superadmin)
            if($token->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }

			// default is root
    		$pageTypeId = -1;
    		
    		// determine if file is in sub-direcotry
        	if($page['PageTypeId']!=-1){
		        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
		        
		        // set page type
		        $pageTypeId = $pageType['PageTypeId'];
	        }
	        
	        // check permissions
			if(Utilities::CanPerformAction($pageTypeId, $access['CanPublish']) == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}

			// set the page to active
            Page::SetIsActive($pageId, 1);

            // publish the page
            Publish::PublishPage($pageId);
            
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}


/**
 * A protected API call to un-publish a page
 * @uri /page/unpublish
 */
class PageUnPublishResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function unpublish() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
        
        	parse_str($this->request->data, $request); // parse request
			$pageId = $request['pageId'];

			// get page
            $page = Page::GetByPageId($pageId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($user['SiteId'] != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // delete page
            $site = Site::GetBySiteId($page['SiteId']);
            $filename = '../sites/'.$site['FriendlyId'].'/';

			// default is root
			$pageTypeId = -1;

			// get $pageTypeId
            if($page['PageTypeId']!=-1){
                $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
                $filename .= strtolower($pageType['FriendlyId']).'/';
                
                $pageTypeId = $pageType['PageTypeId'];
            }
            
            // check permissions
            if(Utilities::CanPerformAction($pageTypeId, $access['CanPublish']) == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}

            // set active
            Page::SetIsActive($pageId, 0);
            
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
 * A protected API call to edit, delete an existing page
 * @uri /page/retrieve
 */
class PageRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
			
			// parse request
			parse_str($this->request->data, $request);

			// get request params
			$pageId = $request['pageId'];

			// get page
            $page = Page::GetByPageId($pageId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($user['SiteId'] != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // get site
            $site = Site::GetBySiteId($page['SiteId']);
            
            // url
            $page['Url'] = $page['FriendlyId'];
            
            // default permissions
			$canEdit = false;
			$canPublish = false;
			$canRemove = false;
			
			// set file
			$file = $page['FriendlyId'];

			// get the page type            
            if($page['PageTypeId']!=-1){
	            $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	            $page['Url'] = $pageType['FriendlyId'].'/'.$page['FriendlyId'];
	            $file = $pageType['FriendlyId'].'.'.$page['FriendlyId'];
	            
				// get permissions for the page
	            $canEdit = Utilities::CanPerformAction($pageType['PageTypeId'], $access['CanEdit']);
	            $canPublish = Utilities::CanPerformAction($pageType['PageTypeId'], $access['CanPublish']);
	            $canRemove = Utilities::CanPerformAction($pageType['PageTypeId'], $access['CanRemove']);
	        }
            else{
                // get permissions for the page
	            $canEdit = Utilities::CanPerformAction('root', $access['CanEdit']);
	            $canPublish = Utilities::CanPerformAction('root', $access['CanPublish']);
	            $canRemove = Utilities::CanPerformAction('root', $access['CanRemove']);
            }
            
            $hasDraft = false;
            
            if($page['Draft'] != NULL){
            	$hasDraft = true;
            }
            
            $page['HasDraft'] = $hasDraft;

			// set permissions            
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
    
}
    
/**
 * A protected API call to get and save content for a page
 * @uri /page/save
 */
class PageSaveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function update() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			$user = User::GetByUserId($token->UserId);
			$site = Site::GetBySiteId($token->SiteId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);

            parse_str($this->request->data, $request); // parse request

			// get request params
			$pageId = $request['pageId'];
            $name = $request['name'];
            $friendlyId = $request['friendlyId'];
            $description = $request['description'];
            $keywords = $request['keywords'];
            $callout = $request['callout'];
            $layout = $request['layout'];
            $stylesheet = $request['stylesheet'];
            $includeOnly = $request['includeOnly'];
            $beginDate = $request['beginDate'];
            $endDate = $request['endDate'];
            $location = $request['location'];
            $latitude = $request['latitude'];
            $longitude = $request['longitude'];
            
            // set timezone
            $timeZone = $site['TimeZone'];
            
            // default is a root element
            $pageTypeId = -1;
            
            // get a reference to a page
            $page = Page::GetByPageId($pageId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($token->SiteId != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // get a pagetypeId
            if($page['PageTypeId']!=-1){
	            $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
	            $pageTypeId = $pageType['PageTypeId'];
	        }
            
            // get permissions (both publishers and editors can save settings)
            $canEdit = Utilities::CanPerformAction($pageTypeId, $access['CanEdit']);
            $canPublish = Utilities::CanPerformAction($pageTypeId, $access['CanPublish']);
            
            // check permissions
			if($canEdit == false && $canPublish == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
            
			// edits settings
            Page::EditSettings($pageId, $name, $friendlyId, $description, $keywords, $callout, 
            	$beginDate, $endDate, $timeZone,
            	$location, $latitude, $longitude,
            	$layout, $stylesheet, $includeOnly, $token->UserId);
            
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

        return new Tonic\Response(Tonic\Response::NOTIMPLEMENTED);
    }

}


/**
 * A protected API call to get and save content for a page
 * @uri /page/content/retrieve
 */
class PageContentRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
            $site = Site::GetBySiteId($token->SiteId);
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
			
			// parse request
			parse_str($this->request->data, $request);

			// get request params
            $pageId = $request['pageId'];
            
            // get page
            $page = Page::GetByPageId($pageId); 
            
            // set file
			$file = $page['FriendlyId'].'.html';
			
			// set file
			if($page['PageTypeId'] != -1){
			
				$pageType = PageType::GetByPageTypeId($page['PageTypeId']);
			
				if($pageType != NULL){
	    			$file = $pageType['FriendlyId'].'.'.$page['FriendlyId'].'.html';
	    		}
			}
			
			// retrieve a draft if available, if not retrieve the content or default content
			$content = '';
			
			if($page['Draft'] != NULL){
				$content = $page['Draft'];
			}
			else if($page['Content'] != NULL){
				$content = $page['Content'];
			}
			else{
				$content = '<div id="block-1" class="block row"><div class="col col-md-12"><h1>'.strip_tags(html_entity_decode($page['Name'])).'</h1><p>'.strip_tags(html_entity_decode($page['Description'])).'</p></div></div>';
			}
           
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'text/html';
            $response->body = $content;

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::BADREQUEST);
        }
    }

}

/**
 * A protected API call to get and save content for a page
 * @uri /page/content/save
 */
class PageContentSaveResource extends Tonic\Resource {

    /**
     * @method POST
     */

    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
            $site = Site::GetBySiteId($token->SiteId);
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);

            parse_str($this->request->data, $request); // parse request

			$pageId  = $request['pageId'];
            $content = $request['content'];
            $status = $request['status']; // draft or publish
            $image = $request['image'];

			// get page and site
            $page = Page::GetByPageId($pageId);
            
            // default is root
    		$pageTypeId = -1;
    		$pageType = NULL;
    		
    		// determine if file is in sub-direcotry
        	if($page['PageTypeId']!=-1){
		        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
		        
		        // set page type
		        $pageTypeId = $pageType['PageTypeId'];
	        }

			// get permissions
            $canEdit = Utilities::CanPerformAction($pageTypeId, $access['CanEdit']);
            $canPublish = Utilities::CanPerformAction($pageTypeId, $access['CanPublish']);
            
            // check permissions
			if($canEdit == false && $canPublish == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
			
            // save content
            if($status=='publish'){
	            Page::EditContent($pageId, $content, $token->UserId);
            }
            else{ // save draft
	            Page::EditDraft($pageId, $content, $token->UserId);
            }
            
            $url = '';
          
			// publish if status is set to publish and the user can publish
            if($status=='publish' && $canPublish == true){
            	
            	// set active
            	Page::SetIsActive($page['PageId'], 1);
            	
            	// publish page
                $url = Publish::PublishPage($page['PageId'], false, true);
                
                // edit image
                Page::EditImage($page['PageId'], $image, $token->UserId);
                
				// if page is include only, republish content
				if($page['IncludeOnly'] == 1){
					Publish::PublishContent($page['SiteId']);
				}
				
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
 * A protected API call to get and save content for a page
 * @uri /page/content/revert
 */
class PageContentRevert extends Tonic\Resource {

    /**
     * @method POST
     */

    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
            $site = Site::GetBySiteId($token->SiteId);
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);

            parse_str($this->request->data, $request); // parse request

			// get page id
			$pageId  = $request['pageId'];
            
			// get page and site
            $page = Page::GetByPageId($pageId);
            
            // default is root
    		$pageTypeId = $page['PageTypeId'];
    		
    		// get permissions
            $canEdit = Utilities::CanPerformAction($pageTypeId, $access['CanEdit']);
            $canPublish = Utilities::CanPerformAction($pageTypeId, $access['CanPublish']);
            
            // check permissions
			if($canEdit == false && $canPublish == false){
				return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
			}
			
			 // removes the draft for the page
            Publish::RemoveDraft($pageId);
			
			// return successful response
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}


/**
 * A protected API call to generate a preview
 * @uri /page/content/preview
 */
class PageContentPreviewResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// get user
        	$user = User::GetByUserId($token->UserId);
            $site = Site::GetBySiteId($token->SiteId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);

            parse_str($this->request->data, $request); // parse request
            
            $pageId = $request['pageId']; // get page type
            $content = $request['content']; // get page type
            $status = 'draft';

			// get page and site
            $page = Page::GetByPageId($pageId);
            
            // make sure the user is part of the site (or is a superadmin)
            if($user['SiteId'] != $page['SiteId']){
	            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
            }
            
            // default is root
    		$pageTypeId = -1;
    		$pageType = NULL;
    		
    		// determine if file is in sub-direcotry
        	if($page['PageTypeId']!=-1){
		        $pageType = PageType::GetByPageTypeId($page['PageTypeId']);
		        
		        // set page type
		        $pageTypeId = $pageType['PageTypeId'];
	        }
            
            // get permissions
            $canEdit = Utilities::CanPerformAction($pageTypeId, $access['CanEdit']);
            $canPublish = Utilities::CanPerformAction($pageTypeId, $access['CanPublish']);
            
            // check permissions to save a draft
			if($canEdit == true || $canPublish == true){
			
				// create a preview
				$url = Publish::PublishPage($page['PageId'], true);
			
			}
			
			
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
 * A protected API call to remove files in the preview folder
 * @uri /page/content/preview/remove
 */
class PagePreviewRemoveResource extends Tonic\Resource {

    /**
     * @method DELETE
     */
    function remove() {

       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
        	// only can remove preview files from own site
            $site = Site::GetBySiteId($token->SiteId);
           
            if($site){
                $dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/preview/*';
                
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
 * A protected API call to get and save content for a page
 * @uri /page/image/swap
 */
class PageImageResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function save() {

         // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
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
 * A protected API call that shows all pages
 * @uri /page/list/all
 */
class PageListAll extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
            // get pages
            $list = Page::GetPagesForSite($token->SiteId, true);
            
            // get site
            $site = Site::GetBySiteId($token->SiteId);
            
            $pages = array();
            
            foreach ($list as $row){

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $row['LastModifiedFullName'] = $fullName;

                // init
	            $imageURL = '';
	            $thumbURL = '';
	            
				// get thumb url
				if($row['Image']!=''){
				
					 // set images URL
					$imagesURL = $site['Domain'];
					
					$thumbURL = $imagesURL.'/files/thumbs/'.$row['Image'];
					$imageURL = $imagesURL.'/files/'.$row['Image'];
					
	            };

                $row['Image'] = $imageURL;
                $row['Thumb'] = $thumbURL;

                $url = $row['FriendlyId'];
                
                if($row['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($row['PageTypeId']);

                    $url = strtolower($pageType['FriendlyId']).'/'.$row['FriendlyId'];
                }

                $row['Url'] = $url;
                
                // permissions are not applicable to this API call
	            $row['CanEdit'] = '';
	            $row['CanPublish'] = '';
	            $row['CanRemove'] = '';
                    
                $pages[$row['PageId']] = $row;
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
 * A protected API call that shows all pages
 * @uri /page/list/allowed
 */
class PageListAllowed extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

		// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site
			$site = Site::GetBySiteId($token->SiteId);
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);

            // get pages
            $list = Page::GetPagesForSite($token->SiteId, false);
            
            $pages = array();
            
            foreach ($list as $row){

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $row['LastModifiedFullName'] = $fullName;

				// init url
                $url = $row['FriendlyId'];
                
				// initialize PT
				$pageType = NULL;
				
				$canEdit = false;
				$canPublish = false;
				$canRemove = false;
				
                
				// get url, permissions
                if($row['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($row['PageTypeId']);

                    $url = strtolower($pageType['FriendlyId']).'/'.$row['FriendlyId'];
                    
                    // set edit permissions
					if($access['CanEdit']=='All' || strpos($access['CanEdit'], $pageType['PageTypeId']) !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($access['CanPublish']=='All' || strpos($access['CanPublish'], $pageType['PageTypeId']) !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($access['CanRemove']=='All' || strpos($access['CanRemove'], $pageType['PageTypeId']) !== FALSE){
						$canRemove = true;
					}
					
                }
                else{
	                
	                // set edit permissions
					if($access['CanEdit']=='All' || strpos($access['CanEdit'], 'root') !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($access['CanPublish']=='All' || strpos($access['CanPublish'], 'root') !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($access['CanRemove']=='All' || strpos($access['CanRemove'], 'root') !== FALSE){
						$canRemove = true;
					}
	                
                }
                
                // init
                $imageURL = '';
                $thumbURL = '';
                
				// get thumb url
				if($row['Image'] != ''){
				
					 // set images URL
					$imagesURL = $site['Domain'];
					$thumbURL = $imagesURL.'/files/thumbs/'.$row['Image'];
					$imageURL = $imagesURL.'/files/'.$row['Image'];
					
	            };
	            
                $row['Image'] = $imageURL;
                $row['Thumb'] = $thumbURL;
               
               	// set permissions 
                $row['CanEdit'] = $canEdit;
                $row['CanPublish'] = $canPublish;
                $row['CanRemove'] = $canRemove;

				// set url
                $row['Url'] = $url;
               
                $hasDraft = false;
                
                if($row['Draft'] != NULL){
                	$hasDraft = true;
                }
                
                $row['HasDraft'] = $hasDraft;
                
                unset($row['Content']);

                // push to array    
                array_push($pages, $row);
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

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site
			$site = Site::GetBySiteId($token->SiteId);
			$user = User::GetByUserId($token->UserId);
			
			// creates an access object
			$access = Utilities::SetAccess($user);
        
        	parse_str($this->request->data, $request); // parse request
            
            $friendlyId = $request['friendlyId']; // get page type
            $sort = $request['sort'];
            
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
        
            $siteId = $token->SiteId;
            $pageSize = 100;
            
            $page = 0;

            $pageTypeId = -1;
            $dir = '/';

            if($friendlyId!='root'){ // get pagetype
                $pageType = PageType::GetByFriendlyId($friendlyId, $siteId);
                $pageTypeId = $pageType['PageTypeId'];
                $dir = strtolower($pageType['FriendlyId']).'/';
            }
            
            // get pages
			$list = Page::GetPages($siteId, $pageTypeId, $pageSize, $page, $orderBy);
            
            $pages = array();
            
            foreach ($list as $row){

                $page = Page::GetByPageId($row['PageId']);

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $page['LastModifiedFullName'] = $fullName;

                $thumbUrl = '';

                if($page['Image']!=''){
                
                	$thumbUrl = '/files/thumbs/'.$page['Image'];
                    
                }

                $page['Thumb'] = $thumbUrl;

                $url = $page['FriendlyId'];

				// default permissions
				$canEdit = false;
				$canPublish = false;
				$canRemove = false;
				
				// initialize PT
				$pageType = NULL;

                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
                    
                    // set edit permissions
					if($access['CanEdit']=='All' || strpos($access['CanEdit'], $pageType['PageTypeId']) !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($access['CanPublish']=='All' || strpos($access['CanPublish'], $pageType['PageTypeId']) !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($access['CanRemove']=='All' || strpos($access['CanRemove'], $pageType['PageTypeId']) !== FALSE){
						$canRemove = true;
					}
					
                }
                else{
	                
	                // set edit permissions
					if($access['CanEdit']=='All' || strpos($access['CanEdit'], 'root') !== FALSE){
						$canEdit = true;
					}
					
					// set publish permissions
					if($access['CanPublish']=='All' || strpos($access['CanPublish'], 'root') !== FALSE){
						$canPublish = true;
					}
					
					// set remove permissions
					if($access['CanRemove']=='All' || strpos($access['CanRemove'], 'root') !== FALSE){
						$canRemove = true;
					}
	                
                }
                
                $page['CanEdit'] = $canEdit;
                $page['CanPublish'] = $canPublish;
                $page['CanRemove'] = $canRemove;

                $page['Url'] = $url;
             
                $hasDraft = false;
                
                if($page['Draft'] != NULL){
                	$hasDraft = true;
                }
                
                $page['HasDraft'] = $hasDraft;
                
                $pages[$row['PageId']] = $page;
            }

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($pages);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::BADREQUEST);
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

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
			
			// get a reference to the site
			$site = Site::GetBySiteId($token->SiteId);

            $siteId = $token->SiteId;
            $pageSize = 100;
            $orderBy = 'Created DESC';
            $page = 0;

            $pageTypeId = -1;
            $dir = '/';

            if($friendlyId!='root'){ // get pagetype
                $pageType = PageType::GetByFriendlyId($friendlyId, $siteId);
                $pageTypeId = $pageType['PageTypeId'];
                $dir = strtolower($pageType['FriendlyId']).'/';
            }
      
            // get pages
            $list = Page::GetPages($siteId, $pageTypeId, $pageSize, $page, $orderBy);
            
            $pages = array();
            
            foreach ($list as $row){

                $page = Page::GetByPageId($row['PageId']);

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $page['LastModifiedFullName'] = $fullName;

                $thumbUrl = '';

                if($page['Image']!=''){
                
                	$thumbUrl = '/files/thumbs/'.$page['Image'];
                    
                }
                
                // set thumb
                $page['Thumb'] = $thumbUrl;

                $url = $page['FriendlyId'];

                if($page['PageTypeId']!=-1){
                    $pageType = PageType::GetByPageTypeId($page['PageTypeId']);

                    $url = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
                }

				// set url
                $page['Url'] = $url;
                
                // permissions are not applicable to this API call
	            $page['CanEdit'] = '';
	            $page['CanPublish'] = '';
	            $page['CanRemove'] = '';

                    
                $pages[$row['PageId']] = $page;
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
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /page/published/list
 */
class PageListResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        parse_str($this->request->data, $request); // parse request
        $siteId = $request['siteId'];
        $friendlyId = urldecode($request['type']);
        $pageSize = $request['pagesize'];
        $orderBy = $request['orderby'];
        $current= $request['current'];  
        $tag = $request['tag'];           

        // get language
        $language = 'en';
        
		// set order
        if($orderBy=='Created' || $orderBy=='BeginDate'){
            $orderBy = 'Pages.'.$orderBy.' DESC';
        }
        else{
            $orderBy = 'Pages.'.$orderBy.' ASC';
        }

        if($pageSize==''){
            $pageSize = 10;
        }

        $site = Site::GetBySiteId($siteId);
        $pageType = PageType::GetByFriendlyId($friendlyId, $siteId);

	    $list = Page::GetPages($site['SiteId'], $pageType['PageTypeId'], $pageSize, $current, $orderBy, true);
        
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
                $thumbUrl = 'files/thumbs/'.$page['Image'];
                $imageUrl = 'files/'.substr($page['Image'], 2);
            }
            
            // check for callout
            $hasCallout = false;
            
            if($page['Callout']!=''){
                $hasCallout = true;
            }

			// build URL
            $url = strtolower($pageType['FriendlyId']).'/'.$page['FriendlyId'];
            
            
            $beginDate = null;
            $beginReadable = '';
            
            if($page['BeginDate'] != null){
            
	            // create a readable begin date
	            $begin = DateTime::createFromFormat('Y-m-d H:i:s', $page['BeginDate']);
	            $local = new DateTimeZone($site['TimeZone']);
				$begin->setTimezone($local);
				$beginReadable = $begin->format('D, M d y h:i a');
			
				$beginDate = $begin->format('Y-m-d H:i:s');	
			}
			
			$endDate = null;
            $endReadable = '';

			if($page['EndDate'] != null){
			
				// create a readable end date
				$end = DateTime::createFromFormat('Y-m-d H:i:s', $page['EndDate']);
				$local = new DateTimeZone($site['TimeZone']);
				$end->setTimezone($local);
				$endReadable = $end->format('D, M d y h:i a');
				
				$endDate = $end->format('Y-m-d H:i:s');
				
			}
            
            $item = array(
                    'PageId'  => $page['PageId'],
                    'Name' => $page['Name'],	// get a translation for name, description, and callout
                    'Description' => $page['Description'],
                    'Callout' => $page['Callout'],
                    'Location' => $page['Location'],
                    'LatLong' => $page['LatLong'],
                    'HasCallout' => $hasCallout,
                    'Url' => $url,
                    'Image' => $imageUrl,
                    'Thumb' => $thumbUrl,
                    'HasImage' => $hasImage,
                    'BeginDate' => $beginDate,
                    'BeginDateReadable' => $beginReadable,
                    'EndDate' => $endDate,
                    'EndDateReadable' => $endReadable,
                    'LastModified' => $page['LastModifiedDate'],
                    'Author' => $name,
                    'FirstName' => $row['FirstName'],
                    'LastName' => $row['LastName'],
                    'Photo' => $row['PhotoUrl'],
                    'Tags' => $page['Tags']
                );
            
            if($tag != ''){
	            
	           // echo 'tags='.$page['Tags'].' and tag='.$tag;
	           // echo ' and pos='.strpos($page['Tags'], $tag);
	            
	            if(strpos($page['Tags'], $tag) !== false){
		            array_push($pages, $item); 
	            }
	            
            }
            else{
	           array_push($pages, $item); 
            }
            
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
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /page/published/count
 */
class PagePublishedCountResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        parse_str($this->request->data, $request); // parse request
        $siteId = $request['siteId'];
        $friendlyId = $request['type'];     
        
        // get pagetype
        $pageType = PageType::GetByFriendlyId($friendlyId, $siteId);

		// get a count
		$count = Page::GetPagesCount($siteId, $pageType['PageTypeId'], true);
		
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'applicaton/json';
        $response->body = '{"count":'.$count.'}';

        return $response;

        return new Tonic\Response(Tonic\Response::CREATED);
    }

}

?>