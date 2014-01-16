<?php

// Category model
class Category{
    
	// adds a category
	public static function Add($friendlyId, $name, $pageTypeId, $createdBy){
		
        try{
            
            $db = DB::get();
    		
    		$categoryUniqId = uniqid();
            
            // cleanup friendlyid (escape, trim, remove spaces, tolower)
        	$friendlyId = trim($friendlyId);
    		$friendlyId = str_replace(' ', '', $friendlyId);
    		$friendlyId = strtolower($friendlyId);
    
    		// set defaults
    		$lastModifiedBy = $createdBy;
    		$timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO Categories (CategoryUniqId, FriendlyId, Name, PageTypeId, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $categoryUniqId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $name);
            $s->bindParam(4, $pageTypeId);
            $s->bindParam(5, $createdBy);
            $s->bindParam(6, $lastModifiedBy);
            $s->bindParam(7, $timestamp);
            $s->bindParam(8, $timestamp);
            
            $s->execute();
            
            return array(
                'CategoryId' => $db->lastInsertId(),
                'CategoryUniqId' => $categoryUniqId,
                'FriendlyId' => $friendlyId,
                'Name' => $name,
                'PageTypeId' => $pageTypeId,
                'CreatedBy' => $createdBy,
                'LastModifiedBy' => $lastModifiedBy,
                'Created' => $timestamp,
                'LastModifiedDate' => $timestamp,
                );
                
        } catch(PDOException $e){
            die('[Category::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// determines whether a friendlyId is unique
	public static function IsFriendlyIdUnique($friendlyId, $pageTypeId){
        
        try{

            $db = DB::get();
            
    
        	$count = 0;
    	
    		$q ="SELECT Count(*) as Count FROM Categories where FriendlyId = ? AND PageTypeId=?";
    
        	$s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $pageTypeId);
            
    		$s->execute();
    
    		$count = $s->fetchColumn();
    
    		if($count==0){
    			return true;
    		}
    		else{
    			return false;
    		}
            
        } catch(PDOException $e){
            die('[Category::IsFriendlyIdUnique] PDO Error: '.$e->getMessage());
        } 
	}
	
	// edits the settings for a category
	public static function Edit($categoryUniqId, $name, $lastModifiedBy){
		
        try{
            
            $db = DB::get();
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE Categories 
    				SET Name = ?,
					LastModifiedBy = ?, 
					LastModifiedDate = ? 
					WHERE CategoryUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $lastModifiedBy);
            $s->bindParam(3, $timestamp);
            $s->bindParam(4, $categoryUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Category::Edit] PDO Error: '.$e->getMessage());
        }
	}
	
	// removes a categories
	public static function Remove($categoryUniqId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Categories WHERE CategoryUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $categoryUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Category::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets all categories
	public static function GetCategories($pageTypeId){
		
        try{

            $db = DB::get();
            
         
    
            $q = "SELECT Categories.CategoryId, Categories.CategoryUniqId, Categories.FriendlyId,
            		Categories.Name, Categories.PageTypeId, Categories.CreatedBy, 
            		Categories.LastModifiedBy, Categories.Created, Categories.LastModifiedDate
        			FROM Categories
        			WHERE Categories.PageTypeId = ? ORDER BY Categories.Name ASC";
        			
            $s = $db->prepare($q);
            $s->bindParam(1, $pageTypeId);
            
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Category::GetCategories] PDO Error: '.$e->getMessage());
        } 
        
	}
	
	// gets all categories
	public static function GetCategoriesForPage($pageId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT Categories.CategoryId, Categories.CategoryUniqId, Categories.FriendlyId,
            		Categories.Name, Categories.PageTypeId, Categories.CreatedBy, 
            		Categories.LastModifiedBy, Categories.Created, Categories.LastModifiedDate
        			FROM Categories LEFT JOIN Category_Page_Rel ON Categories.CategoryId = Category_Page_Rel.CategoryId
        			WHERE Category_Page_Rel.PageId = ? ORDER BY Categories.Name ASC";
        			
            $s = $db->prepare($q);
            $s->bindParam(1, $pageId);
            
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Category::GetCategoriesForPage] PDO Error: '.$e->getMessage());
        } 
        
	}
	
	// gets a category for a specific $categoryUniqId
	public static function GetByCategoryUniqId($categoryUniqId){

        try{
        
        	$db = DB::get();
            
            $q = "SELECT Categories.CategoryId, Categories.CategoryUniqId, Categories.FriendlyId,
            		Categories.Name, Categories.PageTypeId, Categories.CreatedBy, 
            		Categories.LastModifiedBy, Categories.Created, Categories.LastModifiedDate
        			FROM Categories
        		 	WHERE CategoryUniqId=?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $categoryUniqId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Category::GetByCategoryUniqId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a category for a specific $friendlyId and $pageTypeId
	public static function GetByFriendlyId($friendlyId, $pageTypeId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT Categories.CategoryId, Categories.CategoryUniqId, Categories.FriendlyId,
            		Categories.Name, Categories.PageTypeId, Categories.CreatedBy, 
            		Categories.LastModifiedBy, Categories.Created, Categories.LastModifiedDate
        			FROM Categories
        		 	WHERE FriendlyId=? AND PageTypeId=?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            $s->bindParam(2, $pageTypeId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Category::GetByFriendlyId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a category for a specific $categoryId
	public static function GetByCategoryId($categoryId){
	
        try{
        
            $db = DB::get();
            
            $q = "SELECT Categories.CategoryId, Categories.CategoryUniqId, Categories.FriendlyId,
            		Categories.Name, Categories.PageTypeId, Categories.CreatedBy, 
            		Categories.LastModifiedBy, Categories.Created, Categories.LastModifiedDate
        			FROM Categories
        		 	WHERE CategoryId=?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $categoryId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Page::GetByCategoryId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>