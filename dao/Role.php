<?php

// Role model
class Role{
    
	// adds a role
	public static function Add($name, $canView, $canEdit, $canPublish, $canRemove, $canCreate, $siteId){
		
        try{
            
            $db = DB::get();
            
            $roleUniqId = uniqid();
    	
    		$q = "INSERT INTO Roles (RoleUniqId, Name, CanView, CanEdit, CanPublish, CanRemove, CanCreate, SiteId) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $roleUniqId);
            $s->bindParam(2, $name);
            $s->bindParam(3, $canView);
            $s->bindParam(4, $canEdit);
            $s->bindParam(5, $canPublish);
            $s->bindParam(6, $canRemove);
            $s->bindParam(7, $canCreate);
            $s->bindParam(8, $siteId);
            
            $s->execute();
            
            return array(
                'RoleUniqId' => $roleUniqId,
                'Name' => $name,
                'CanView' => $canView,
                'CanEdit' => $canEdit,
                'CanPublish' => $canPublish,
                'CanRemove' => $canRemove,
                'CanCreate' => $canCreate
                );
                
        } catch(PDOException $e){
            die('[Role::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// edits a role
	public static function Edit($roleUniqId, $name, $canView, $canEdit, $canPublish, $canRemove, $canCreate, $siteId){
		
        try{
            
            $db = DB::get();
        
    		$q = "UPDATE Roles SET Name = ?, CanView = ?, CanEdit = ?, CanPublish = ?, CanRemove = ?, CanCreate = ? WHERE RoleUniqId = ? AND SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $canView);
            $s->bindParam(3, $canEdit);
            $s->bindParam(4, $canPublish);
            $s->bindParam(5, $canRemove);
            $s->bindParam(6, $canCreate);
            $s->bindParam(7, $roleUniqId);
            $s->bindParam(8, $siteId);
            
            $s->execute();
                
        } catch(PDOException $e){
            die('[Role::Edit] PDO Error: '.$e->getMessage());
        }
	}
	
	// determines whether a name is unique
	public static function IsNameUnique($name, $siteId){

        try{

            $db = DB::get();
    
    		$count = 0;
    	
    		$q ="SELECT Count(*) as Count FROM Roles where Name = ? AND SiteId = ?";
    
        	$s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $siteId);
            
    		$s->execute();
    
    		$count = $s->fetchColumn();
    
    		if($count==0){
    			return true;
    		}
    		else{
    			return false;
    		}
            
        } catch(PDOException $e){
            die('[Role::IsNameUnique] PDO Error: '.$e->getMessage());
        } 
        
	}
	
	// Gets a role for a name
	public static function GetByName($name, $siteId){
		 
        try{
        
    		$db = DB::get();
            
            $q = "SELECT RoleId, RoleUniqId, Name, CanView, CanEdit, CanPublish, CanRemove, CanCreate
        			FROM Roles
        			WHERE Name = ? AND SiteId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Role::GetByName] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a list of roles
	public static function GetRoles($siteId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT  RoleId, RoleUniqId, Name, CanView, CanEdit, CanPublish, CanRemove, CanCreate
        			FROM Roles
        			WHERE SiteId = ?
        			ORDER BY Roles.Name ASC";
 
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
    
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Role::GetRoles] PDO Error: '.$e->getMessage().'trace='.$e->getTraceAsString());
        } 
        
	}
	
	// removes a role
	public static function Remove($roleUniqId, $siteId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Roles WHERE RoleUniqId = ? AND SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $roleUniqId);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Role::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	
}

?>