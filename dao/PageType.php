<?php

// PageType model
class PageType{
	
	// adds a pageType
    public static function Add($friendlyId, $typeS, $typeP, $siteId, $createdBy, $lastModifiedBy){
		   
        try{
            
            $db = DB::get();
        	
    		$pageTypeUniqId = uniqid();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
        	$friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
    
    		$timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		// a bit hacky, but need to ensure that begindate and enddate are null
    		$q = "INSERT INTO PageTypes (PageTypeUniqId, FriendlyId, TypeS, TypeP,
                    SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    	
    	
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeUniqId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $typeS);
            $s->bindParam(4, $typeP);
            $s->bindParam(5, $siteId);
            $s->bindParam(6, $createdBy);
            $s->bindParam(7, $lastModifiedBy);
            $s->bindParam(8, $timestamp);
            $s->bindParam(9, $timestamp);
            
            $s->execute();
            
            return array(
                'PageTypeId' => $db->lastInsertId(),
                'PageTypeUniqId' => $pageTypeUniqId,
                'FriendlyId' => $friendlyId,
                'TypeS' => $typeS,
                'TypeP' => $typeP,
                'SiteId' => $siteId,
                'CreatedBy' => $createdBy,
                'LastModifiedBy' => $lastModifiedBy,
                'Created' => $timestamp,
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
	public static function Edit($pageTypeUniqId, $friendlyId, $typeS, $typeP, $lastModifiedBy){
        
        try{
            
            $db = DB::get();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
        	$friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE PageTypes SET FriendlyId = ?, TypeS = ?, TypeP = ?,
    			    LastModifiedBy = ?, LastModifiedDate= ? WHERE PageTypeUnqiId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $typeS);
            $s->bindParam(3, $typeP);
            $s->bindParam(4, $lastModifiedBy);
            $s->bindParam(5, $timestamp);
            $s->bindParam(6, $pageTypeUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[PageType::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// deletes a pageType
	public static function Delete($pageTypeUniqId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM PageTypes WHERE PageTypeUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[PageType::Delete] PDO Error: '.$e->getMessage());
        }
        
	}

	// gets all PageTypes for a given site
	public static function GetPageTypes($siteId){

        try{

            $db = DB::get();
            
            $q = "SELECT  PageTypeId, PageTypeUniqId, FriendlyId, TypeS, TypeP,
        			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        			FROM PageTypes
        			WHERE PageTypes.SiteId = ?
        			ORDER BY PageTypes.Created ASC";
 
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
            
            $q = "SELECT PageTypeId, PageTypeUniqId, FriendlyId,
            		TypeS, TypeP,
        			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        		 	FROM PageTypes WHERE PageTypes.SiteId = ? ORDER BY Created limit 1";
                    
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
            
            $q = "SELECT PageTypeId, PageTypeUniqId, FriendlyId,
            		TypeS, TypeP,
        			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        		 	FROM PageTypes WHERE FriendlyId = ? && SiteId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[PageType::GetByFriendlyId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// Gets a pageType for a specific PageTypeUniqId
	public static function GetByPageTypeUniqId($pageTypeUniqId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT PageTypeId, PageTypeUniqId, FriendlyId,
            		TypeS, TypeP,
        			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        		 	FROM PageTypes WHERE PageTypeUniqId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeUniqId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[PageType::GetByPageTypeUniqId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a pageType for a specific PageTypeId
	public static function GetByPageTypeId($pageTypeId){

        try{
        
            $db = DB::get();
            
            $q = "SELECT PageTypeId, PageTypeUniqId, FriendlyId,
            		TypeS, TypeP, 
        			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
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