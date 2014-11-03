<?php

// MenuItem DAO
class MenuItem{
	

	// adds a menuItem
	public static function Add($name, $cssClass, $type, $url, $pageId, $priority, $siteId, $lastModifiedBy){
		
        try{
            
            $db = DB::get();
            
        	$menuItemId = uniqid();
        	$timestamp = gmdate("Y-m-d H:i:s", time());
            
    		$q = "INSERT INTO MenuItems (MenuItemId, Name, CssClass, Type, Url, PageId, Priority, SiteId, LastModifiedBy, LastModifiedDate) 
    		        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    	
            $s = $db->prepare($q);
            $s->bindParam(1, $menuItemId);
            $s->bindParam(2, $name);
            $s->bindParam(3, $cssClass);
            $s->bindParam(4, $type);
            $s->bindParam(5, $url);
            $s->bindParam(6, $pageId);
            $s->bindParam(7, $priority);
            $s->bindParam(8, $siteId);
            $s->bindParam(9, $lastModifiedBy);
            $s->bindParam(10, $timestamp);
            
            $s->execute();
            
            return array(
                'MenuItemId' => $menuItemId,
                'Name' => $name,
                'CssClass' => $cssClass,
                'Type' => $type,
                'Url' => $url,
                'PageId' => $pageId,
                'Priority' => $priority,
                'IsNested' => 0,
                'SiteId' => $siteId,
                'LastModifiedBy' => $lastModifiedBy,
                'LastModifiedDate' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[MenuItem::Add] PDO Error: '.$e->getMessage());
        }
        
	}
    
	
	// updates the name, cssClass, and url
	public static function Edit($menuItemId, $name, $cssClass, $url, $pageId){
	 
        try{
            
            $db = DB::get();

            $q = "UPDATE MenuItems SET Name = ?, CssClass = ?, Url = ?, PageId = ? WHERE MenuItemId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $cssClass);
            $s->bindParam(3, $url);
            $s->bindParam(4, $pageId);
            $s->bindParam(5, $menuItemId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[MenuItem::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // updates the priority
    public static function EditPriority($menuItemId, $priority){
		
        try{
            
            $db = DB::get();

            $q = "UPDATE MenuItems SET Priority = ? WHERE MenuItemId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $priority, PDO::PARAM_INT);
            $s->bindParam(2, $menuItemId);
            
            $s->execute();
            
    	} catch(PDOException $e){
            die('[MenuItem::EditPriority] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// updates the isNested flag
    public static function EditIsNested($menuItemId, $isNested){
		
        try{
            
            $db = DB::get();

            $q = "UPDATE MenuItems SET IsNested = ? WHERE MenuItemId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $isNested, PDO::PARAM_INT);
            $s->bindParam(2, $menuItemId);
            
            $s->execute();
            
    	} catch(PDOException $e){
            die('[MenuItem::EditIsNested] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// removes a menuItem
	public static function Remove($menuItemId){
		        
        try{
            
            $db = DB::get();

            $q = "DELETE FROM MenuItems WHERE MenuItemId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $menuItemId);
            
            $s->execute();
            
        } catch(PDOException $e){
            die('[MenuItem::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// removes menuItems for type
	public static function RemoveForType($type, $siteId){
		        
        try{
            
            $db = DB::get();

            $q = "DELETE FROM MenuItems WHERE Type = ? AND SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $type);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
        } catch(PDOException $e){
            die('[MenuItem::RemoveForType] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets all menuItems (and meta data) for a given site
	public static function GetMenuItems($siteId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT MenuItems.MenuItemId, MenuItems.Name, MenuItems.CssClass,
            		MenuItems.Type,
        			MenuItems.Url, MenuItems.PageId, MenuItems.Priority, MenuItems.IsNested,
        			MenuItems.SiteId,
        			MenuItems.LastModifiedBy, MenuItems.LastModifiedDate
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
            
            $q = "SELECT MenuItems.MenuItemId, MenuItems.Name, MenuItems.CssClass,
            		MenuItems.Type,
        			MenuItems.Url, MenuItems.PageId, MenuItems.Priority, MenuItems.IsNested,
        			MenuItems.SiteId,
        			MenuItems.LastModifiedBy, MenuItems.LastModifiedDate
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
	
	// gets a menuItem for a specific MenuItemId
	public static function GetByMenuItemId($menuItemId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT MenuItemId, Name, CssClass, Type,
    		        Url, PageId, Priority, isNested, SiteId, LastModifiedBy, LastModifiedDate
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