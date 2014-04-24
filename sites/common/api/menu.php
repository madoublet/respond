<?php 


/**
 * This is a public API call that shows you the list of pages for the specified parameters in a list format
 * @uri /menu/list/{type}
 */
class MenuListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($type) {
  
        $list = MenuItem::GetMenuItemsForType(SITE_ID, $type);
        
        $menu = array();
        
        foreach ($list as $row){
        
        	$scope = 'external';
        	$pageUniqId = '';
        	
        	// set the scope of the link
        	if($row['PageId'] != '-1'){
	        	$scope = 'internal';
	        	
	        	$page = Page::GetByPageId($row['PageId']);
	        	
	        	if($page != NULL){
		        	$pageUniqId = $page['PageUniqId'];
	        	}
        	}
        	
        	// set the item
        	$item = array(
                    'MenuItemUniqId'  => $row['MenuItemUniqId'],
                    'Name'  => $row['Name'],
                    'Url'  => $row['Url'],
                    'PageUniqId' => $pageUniqId,
                    'Scope' => $scope
                );
        
			
			// push the item to the array
			array_push($menu, $item);
        
        }
        
        
        // return a json response
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'application/json';
        $response->body = json_encode($menu);

        return $response;
        
    }

}

?>