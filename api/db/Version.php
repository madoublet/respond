<?php

// Versions DAO
class Version{
    
	// adds a version
	public static function Add($pageId, $userId, $content){
		
        try{
            
            $db = DB::get();
    		
    		// create version
    		$versionId = uniqid();
    		
    		// set timestamp
    		$created = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO Versions (VersionId, PageId, UserId, Content, Created) 
    			    VALUES (?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $versionId);
            $s->bindParam(2, $pageId);
            $s->bindParam(3, $userId);
            $s->bindParam(4, $content);
            $s->bindParam(5, $created);
            
            $s->execute();
            
            // get count
            $q = "SELECT Count(*) as Count FROM Versions where PageId = ?";
    
        	$s = $db->prepare($q);
            $s->bindParam(1, $pageId);
            
    		$s->execute();
    
			// get count
			$allowed = 5;
    		$count = $s->fetchColumn();
    		
    		if($count > $allowed){
	            $limit = $count - $allowed;
	            
	            // delete to limit
	            $q = "DELETE FROM Versions ORDER BY Created ASC LIMIT ".$limit;
	            
	            $s = $db->prepare($q);
	            
	            $s->execute();
            }
            
            return array(
                'VersionId' => $versionId,
                'PageId' => $pageId,
                'UserId' => $userId,
                'Content' => $content,
                'Created' => $created
                );
                
        } catch(PDOException $e){
            die('[Version::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// removes a version
	public static function Remove($versionId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Versions WHERE VersionId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $versionId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Version::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets all versions for a page
	public static function GetVersions($pageId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT Versions.VersionId, Versions.PageId, Versions.UserId, Versions.Content, Versions.Created, Users.FirstName, Users.LastName
        			FROM Versions LEFT JOIN Users ON Versions.UserId = Users.UserId			
        			WHERE PageId = ? ORDER BY Created DESC";
        			
        	
            $s = $db->prepare($q);
            $s->bindParam(1, $pageId);
            
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Version::GetVersions] PDO Error: '.$e->getMessage());
        }
        
	}
	
	
	// gets a version for a specific $versionId
	public static function GetByVersionId($versionId){
	
        try{
        
            $db = DB::get();
            
            $q = "SELECT Versions.VersionId, Versions.PageId, Versions.UserId, Versions.Content, Versions.Created, Users.FirstName, Users.LastName
            		FROM Versions LEFT JOIN Users ON Versions.UserId = Users.UserId
        		 	WHERE VersionId=?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $versionId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Version::GetByVersionId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>