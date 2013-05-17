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
            
            if($pageTypeUniqId != '-1'){
                $pageType = PageType::GetByPageTypeUniqId($pageTypeUniqId);
            
                if($pageType != null){
                    $pageTypeId = $pageType['PageTypeId'];
                }
            }

            $name = $request['name'];
            $friendlyId = $request['friendlyId'];
            $description = $request['description'];

            $page = Page::Add($friendlyId, $name, $description, $pageTypeId, $authUser->SiteId, $authUser->UserId);

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

            Page::EditSettings($pageUniqId, $name, $friendlyId, $description, $keywords, $callout, $rss, $layout, $stylesheet, $authUser->UserId);

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

            Page::Remove($pageUniqId);

            return new Tonic\Response(Tonic\Response::OK);
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
        
            $fragment = '../sites/'.$site['FriendlyId'].'/fragments/publish/'.$pageUniqId.'.html';

            $content = '';

            if(file_exists($fragment)){
              $content = file_get_contents($fragment);
            }
            else{ // create default content for the page
                $page = Page::GetByPageUniqId($pageUniqId); 
                $content = '<div id="block-1" class="block row-fluid"><div class="col span12"><h1>'.strip_tags(html_entity_decode($page['Name'])).'</h1><p>'.strip_tags(html_entity_decode($page['Description'])).'</p></div></div>';
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

            if($status=='publish'){
                if($page['IsActive'] == 1){
                    $url = Publish::PublishPage($page['PageUniqId']);
                }

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

            // get pages
            $list = Page::GetPages($siteId, $pageTypeId, $pageSize, $page, $orderBy);
            
            $pages = array();
            
            foreach ($list as $row){

                $page = Page::GetByPageId($row['PageId']);

                $fullName = $row['FirstName'].' '.$row['LastName'];
                $page['LastModifiedFullName'] = $fullName;

                $imageUrl = '';
                $thumbUrl = '';

                $page['Image'] = $imageUrl;
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


        $dest = 'sites/'.$site['FriendlyId'];
        
        // Get all pages
        $list = Page::GetPages($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, true);
        
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
                    'Name' => $page['Name'],
                    'Description' => $page['Description'],
                    'Callout' => $page['Callout'],
                    'HasCallout' => $hasCallout,
                    'Url' => $url,
                    'Image' => $imageUrl,
                    'Thumb' => $thumbUrl,
                    'HasImage' => $hasImage,
                    'LastModified' => $page['LastModifiedDate'],
                    'Author' => $name
                );
                
            $pages[$page['PageUniqId']] = $item;
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


        $dest = 'sites/'.$site['FriendlyId'];
        
        // Get all pages
        $list = Page::GetPages($site['SiteId'], $pageType['PageTypeId'], $pageSize, $page, $orderBy, true);
        
        $pages = array();
        
        foreach ($list as $row){

            $page = Page::GetByPageId($row['PageId']);

            $name = $row['FirstName'].' '.$row['LastName'];
            
            // get image url
            $thumbUrl = '';
            $imageUrl = '';
            $mImageUrl = '';
            
            $url = strtolower($pageType['TypeS']).'/'.$page['FriendlyId'];
            
            $item = array(
                    'PageUniqId'  => $page['PageUniqId'],
                    'Name' => $page['Name'],
                    'Description' => $page['Description'],
                    'Callout' => $page['Callout'],
                    'Url' => $url,
                    'Image' => $imageUrl,
                    'Thumb' => $thumbUrl,
                    'LastModified' => $page['LastModifiedDate'],
                    'Author' => $name
                );
                
            $fragment = '../sites/'.$site['FriendlyId'].'/fragments/publish/'.$page['PageUniqId'].'.html';

            if(file_exists($fragment)){
                $content = file_get_contents($fragment);
            }
            else{
                $content = 'Not found';
            }

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