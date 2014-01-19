<?php

// MenuItem model
class MenuItem{
	

	// adds a menuItem
	public static function Add($name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy){
		
        try{
            
            $db = DB::get();
            
        	$menuItemUniqId = uniqid();
        	$timestamp = gmdate("Y-m-d H:i:s", time());
            
    		$q = "INSERT INTO MenuItems (MenuItemUniqId, Name, CssClass, Type, Url, PageId, Priority, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
    		        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    	
            $s = $db->prepare($q);
            $s->bindParam(1, $menuItemUniqId);
            $s->bindParam(2, $name);
            $s->bindParam(3, $cssClass);
            $s->bindParam(4, $type);
            $s->bindParam(5, $url);
            $s->bindParam(6, $pageId);
            $s->bindParam(7, $priority);
            $s->bindParam(8, $siteId);
            $s->bindParam(9, $createdBy);
            $s->bindParam(10, $lastModifiedBy);
            $s->bindParam(11, $timestamp);
            $s->bindParam(12, $timestamp);
            
            $s->execute();
            
            return array(
                'MenuItemId' => $db->lastInsertId(),
                'MenuItemUniqId' => $menuItemUniqId,
                'Name' => $name,
                'CssClass' => $cssClass,
                'Type' => $type,
                'Url' => $url,
                'PageId' => $pageId,
                'Priority' => $priority,
                'IsNested' => 0,
                'SiteId' => $siteId,
                'CreatedBy' => $createdBy,
                'LastModifiedBy' => $lastModifiedBy,
                'Created' => $timestamp,
                'LastModifiedDate' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[MenuItem::Add] PDO Error: '.$e->getMessage());
        }
        
	}
    
	
	// updates the name, cssClass, and url
	public static function Edit($menuItemUniqId, $name, $cssClass, $url){
	 
        try{
            
            $db = DB::get();

            $q = "UPDATE MenuItems SET Name = '$name', CssClass = '$cssClass', Url = '$url' WHERE MenuItemUniqId = '$menuItemUniqId'";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $cssClass);
            $s->bindParam(3, $url);
            $s->bindParam(4, $menuItemUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[MenuItem::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // updates the priority
    public static function EditPriority($menuItemUniqId, $priority){
		
        try{
            
            $db = DB::get();

            $q = "UPDATE MenuItems SET Priority = ? WHERE MenuItemUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $priority, PDO::PARAM_INT);
            $s->bindParam(2, $menuItemUniqId);
            
            $s->execute();
            
    	} catch(PDOException $e){
            die('[MenuItem::EditPriority] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// updates the isNested flag
    public static function EditIsNested($menuItemUniqId, $isNested){
		
        try{
            
            $db = DB::get();

            $q = "UPDATE MenuItems SET IsNested = ? WHERE MenuItemUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $isNested, PDO::PARAM_INT);
            $s->bindParam(2, $menuItemUniqId);
            
            $s->execute();
            
    	} catch(PDOException $e){
            die('[MenuItem::EditIsNested] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// deletes a menuItem
	public static function Remove($menuItemUniqId){
		        
        try{
            
            $db = DB::get();

            $q = "DELETE FROM MenuItems WHERE MenuItemUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $menuItemUniqId);
            
            $s->execute();
            
        } catch(PDOException $e){
            die('[MenuItem::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets all menuItems (and meta data) for a given site
	public static function GetMenuItems($siteId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT MenuItems.MenuItemId, MenuItems.MenuItemUniqId, MenuItems.Name, MenuItems.CssClass,
            		MenuItems.Type,
        			MenuItems.Url, MenuItems.PageId, MenuItems.Priority, MenuItems.IsNested,
        			MenuItems.SiteId, MenuItems.CreatedBy, 
        			MenuItems.LastModifiedBy, MenuItems.LastModifiedDate, MenuItems.Created
        			FROM MenuItems
        			WHERE MenuItems.SiteId = ?
        			ORDER BY MenuItems.Priority";
 
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
    
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[MenuItem::GetMenuItems] PDO Error: '.$e->getMessage().'trace='.$e->getTraceAsString());
        } 
        
	}

	// gets all menuItems (and meta data) for a given site and type
	public static function GetMenuItemsForType($siteId, $type){
		
        try{

            $db = DB::get();
            
            $q = "SELECT MenuItems.MenuItemId, MenuItems.MenuItemUniqId, MenuItems.Name, MenuItems.CssClass,
            		MenuItems.Type,
        			MenuItems.Url, MenuItems.PageId, MenuItems.Priority, MenuItems.IsNested,
        			MenuItems.SiteId, MenuItems.CreatedBy, 
        			MenuItems.LastModifiedBy, MenuItems.LastModifiedDate, MenuItems.Created
        			FROM MenuItems
        			WHERE MenuItems.SiteId = ? AND MenuItems.Type = ?
        			ORDER BY MenuItems.Priority";
 
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
            $s->bindParam(2, $type);
    
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[MenuItem::GetMenuItemsForType] PDO Error: '.$e->getMessage().'trace='.$e->getTraceAsString());
        } 
        
	}

	// gets a menuItem for a specific MenuItemUniqId
	public static function GetByMenuItemUniqId($menuItemUniqId){
		        
        try{
        
            $db = DB::get();
            
            $q = "SELECT MenuItemId, MenuItemUniqId, Name, CssClass, Type,
            		Url, PageId, Priority, IsNested, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        		 	FROM MenuItems WHERE MenuItemUniqId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $menuItemUniqId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[MenuItem::GetByMenuItemUniqId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a menuItem for a specific MenuItemId
	public static function GetByMenuItemId($menuItemId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT MenuItemId, MenuItemUniqId, Name, CssClass, Type,
    		        Url, PageId, Priority, isNested, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	        FROM MenuItems WHERE MenuItemId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $menuItemId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[MenuItem::GetByMenuItemId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>