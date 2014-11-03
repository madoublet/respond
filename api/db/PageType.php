<?php

// PageType DAO
class PageType{
	
	// adds a pageType
    public static function Add($friendlyId, $layout, $stylesheet, $isSecure, $siteId, $lastModifiedBy){
		   
        try{
            
            $db = DB::get();
        	
    		$pageTypeId = uniqid();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
        	$friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
    
    		$timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO PageTypes (PageTypeId, FriendlyId, Layout, Stylesheet, IsSecure,
                    SiteId, LastModifiedBy, LastModifiedDate) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    	
    	
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $layout);
            $s->bindParam(4, $stylesheet);
            $s->bindParam(5, $isSecure);
            $s->bindParam(6, $siteId);
            $s->bindParam(7, $lastModifiedBy);
            $s->bindParam(8, $timestamp);
            
            $s->execute();
            
            return array(
                'PageTypeId' => $pageTypeId,
                'FriendlyId' => $friendlyId,
                'Layout' => $layout,
                'Stylesheet' => $stylesheet,
                'IsSecure' => $isSecure,
                'SiteId' => $siteId,
                'LastModifiedBy' => $lastModifiedBy,
                'LastModifiedDate' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[PageType::Add] PDO Error: '.$e->getMessage());
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
    	
    		$q ="SELECT Count(*) as Count FROM PageTypes where FriendlyId = ? AND SiteId=?";
    
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
            die('[PageType::IsFriendlyIdUnique] PDO Error: '.$e->getMessage());
        } 
        
	}
	
	// edits a pageType
	public static function Edit($pageTypeId, $layout, $stylesheet, $isSecure, $lastModifiedBy){
        
        try{
            
            $db = DB::get();
      
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE PageTypes SET Layout = ?, Stylesheet = ?, IsSecure = ?,
    			    LastModifiedBy = ?, LastModifiedDate= ? WHERE PageTypeId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $layout);
            $s->bindParam(2, $stylesheet);
            $s->bindParam(3, $isSecure);
            $s->bindParam(4, $lastModifiedBy);
            $s->bindParam(5, $timestamp);
            $s->bindParam(6, $pageTypeId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[PageType::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// removes a pageType
	public static function Remove($pageTypeId, $siteId){
		
        try{
            
            $db = DB::get();
            
            // remove page types
            $q = "DELETE FROM PageTypes WHERE PageTypeId = ? AND SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeId);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[PageType::Delete] PDO Error: '.$e->getMessage());
        }
        
	}

	// gets all PageTypes for a given site
	public static function GetPageTypes($siteId){

        try{

            $db = DB::get();
            
            $q = "SELECT  PageTypeId, FriendlyId, Layout, Stylesheet, IsSecure,
        			SiteId, LastModifiedBy, LastModifiedDate
        			FROM PageTypes
        			WHERE PageTypes.SiteId = ?
        			ORDER BY PageTypes.LastModifiedDate ASC";
 
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
    
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[PageType::GetPageTypes] PDO Error: '.$e->getMessage().'trace='.$e->getTraceAsString());
        } 
        
	}
	
	// gets the default pagetype (for site)
	public static function GetDefaultPageType($siteId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT PageTypeId, FriendlyId,
            		Layout, Stylesheet, IsSecure,
        			SiteId, LastModifiedBy, LastModifiedDate
        		 	FROM PageTypes WHERE PageTypes.SiteId = ? ORDER BY LastModifiedDate limit 1";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[PageType::GetDefaultPage] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a pageType for a specific friendlyId
	public static function GetByFriendlyId($friendlyId, $siteId){
	
        try{
        
            $db = DB::get();
            
            $q = "SELECT PageTypeId, FriendlyId,
            		Layout, Stylesheet, IsSecure,
        			SiteId, LastModifiedBy, LastModifiedDate
        		 	FROM PageTypes WHERE FriendlyId = ? AND SiteId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
    		else{
	    		return NULL;
    		}
        
        } catch(PDOException $e){
            die('[PageType::GetByFriendlyId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a pageType for a specific PageTypeId
	public static function GetByPageTypeId($pageTypeId){

        try{
        
            $db = DB::get();
            
            $q = "SELECT PageTypeId, FriendlyId,
            		Layout, Stylesheet, IsSecure,
        			SiteId, LastModifiedBy, LastModifiedDate
        		 	FROM PageTypes WHERE PageTypeId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[PageType::GetByPageTypeId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>