<?php

// MenuType DAO
class MenuType{
    
    // adds a menuType
    public static function Add($friendlyId, $name, $siteId, $lastModifiedBy){
		    
        try{
            
            $db = DB::get();
            
    		$menuTypeId = uniqid();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
    		$friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
    
    		$timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO MenuTypes (MenuTypeId, FriendlyId, Name,
                    SiteId, LastModifiedBy, LastModifiedDate) 
                    VALUES (?, ?, ?, ?, ?, ?)";
    	
            $s = $db->prepare($q);
            $s->bindParam(1, $menuTypeId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $name);
            $s->bindParam(4, $siteId);
            $s->bindParam(5, $lastModifiedBy);
            $s->bindParam(6, $timestamp);
            
            $s->execute();
            
            return array(
                'MenuTypeId' => $menuTypeId,
                'FriendlyId' => $friendlyId,
                'Name' => $name,
                'SiteId' => $siteId,
                'LastModifiedBy' => $lastModifiedBy,
                'LastModifiedDate' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[MenuType::Add] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// determines whether a FriendlyId is unique
	public static function IsFriendlyIdUnique($friendlyId, $siteId){

        try{

            $db = DB::get();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
        	$friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
    
            $count = 0;
        
    		$q = "SELECT Count(*) as Count FROM MenuTypes where FriendlyId=? AND SiteId=?";
    
        	$s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(1, $siteId);
            
    		$s->execute();
    
    		$count = $s->fetchColumn();
    
    		if($count==0){
    			return true;
    		}
    		else{
    			return false;
    		}
            
        } catch(PDOException $e){
            die('[MenuType::IsFriendlyIdUnique] PDO Error: '.$e->getMessage());
        } 
        
	}

	// edits a menuType
	public static function Edit($menuTypeId, $friendlyId, $name, $lastModifiedBy){
		
        try{
            
            $db = DB::get();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
            $friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE MenuTypes SET FriendlyId = ?, Name = ?,
    			    LastModifiedBy = ?, LastModifiedDate = ? WHERE MenuTypeId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $name);
            $s->bindParam(3, $lastModifiedBy);
            $s->bindParam(4, $timestamp);
            $s->bindParam(5, $menuTypeId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[MenuType::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// removes a menuType
	public static function Remove($menuTypeId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM MenuTypes WHERE MenuTypeId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $menuTypeId);
            
            $s->execute();
            
    	} catch(PDOException $e){
            die('[MenuType::Delete] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets all MenuTypes for a given site
	public static function GetMenuTypes($siteId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT  MenuTypeId, FriendlyId, Name,
            		SiteId, LastModifiedBy, LastModifiedDate
        			FROM MenuTypes
        			WHERE MenuTypes.SiteId = ?
        			ORDER BY MenuTypes.LastModifiedDate ASC";
 
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
    
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[MenuType::GetMenuTypes] PDO Error: '.$e->getMessage().'trace='.$e->getTraceAsString());
        } 
        
	}
	
	
	// gets a menuType for a specific friendlyId
	public static function GetByFriendlyId($friendlyId, $siteId){
		  
        try{
        
            $db = DB::get();
            
            $q = "SELECT MenuTypeId, FriendlyId, Name,
    		SiteId, LastModifiedBy, LastModifiedDate
		 	FROM MenuTypes WHERE FriendlyId=? && SiteId=?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[MenuType::GetByFriendlyId] PDO Error: '.$e->getMessage());
        }
        
	}
		
	// gets a menuType for a specific MenuTypeId
	public static function GetByMenuTypeId($menuTypeId){
        
        try{
        
            $db = DB::get();
            
            $q = "SELECT MenuTypeId, FriendlyId, Name,
            SiteId, LastModifiedBy, LastModifiedDate
		 	FROM MenuTypes WHERE MenuTypeId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $menuTypeId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[MenuType::GetByMenuTypeId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>