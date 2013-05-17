<?php

// Site model
class Site{
	
	// adds a Site
	public static function Add($domain, $name, $friendlyId, $logoUrl, $template, $primaryEmail){
        
        try{
            
        	$db = DB::get();
		
    		$siteUniqId = uniqid();
    		$timeZone = 'CST';
    		$analyticsId = '';
    		$facebookAppId = '';
    		
    		$timestamp = gmdate("Y-m-d H:i:s", time());

            $q = "INSERT INTO Sites (SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template, AnalyticsId, FacebookAppId, PrimaryEmail, TimeZone, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $siteUniqId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $domain);
            $s->bindParam(4, $name);
            $s->bindParam(5, $logoUrl);
            $s->bindParam(6, $template);
            $s->bindParam(7, $analyticsId);
            $s->bindParam(8, $facebookAppId);
            $s->bindParam(9, $primaryEmail);
            $s->bindParam(10, $timeZone);
            $s->bindParam(11, $timestamp);
            
            $s->execute();
            
            return array(
                'SiteId' => $db->lastInsertId(),
                'SiteUniqId' => $siteUniqId,
                'FriendlyId' => $friendlyId,
                'Domain' => $domain,
                'Name' => $name,
                'LogoUrl' => $logoUrl,
                'Template' => $template,
                'AnalyticsId' => $analyticsId,
                'FacebookAppId' => $facebookAppId,
                'PrimaryEmail' => $primaryEmail,
                'TimeZone' => $timeZone,
                'Created' => $timestamp,
                );
                
        } catch(PDOException $e){
            die('[Site::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	
	// edits the site information
	public static function Edit($siteUniqId, $domain, $name, $analyticsId, $facebookAppId, $primaryEmail, $timeZone){

		try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
            		Name= ?, 
                    Domain= ?, 
        			AnalyticsId= ?,
        			FacebookAppId= ?,
            		PrimaryEmail = ?,
        			TimeZone = ? WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $domain);
            $s->bindParam(3, $analyticsId);
            $s->bindParam(4, $facebookAppId);
            $s->bindParam(5, $primaryEmail);
            $s->bindParam(6, $timeZone);
            $s->bindParam(7, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // edits the template
    public static function EditTemplate($siteUniqId, $template){
        
        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                	Template= ?
        			TimeZone = ? WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $template);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditTemplate] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // edits the logo
    public static function EditLogo($siteUniqId, $logoUrl){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    LogoUrl= ?
        			TimeZone = ? WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $logoUrl);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditLogo] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// determines whether a friendlyId is unique
	public static function IsFriendlyIdUnique($friendlyId){

        try{

            $db = DB::get();
    
    		$count = 0;
    	
    		$q ="SELECT Count(*) as Count FROM Sites where FriendlyId = ?";
    
        	$s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            
    		$s->execute();
    
    		$count = $s->fetchColumn();
    
    		if($count==0){
    			return true;
    		}
    		else{
    			return false;
    		}
            
        } catch(PDOException $e){
            die('[Site::IsFriendlyIdUnique] PDO Error: '.$e->getMessage());
        } 
        
	}

	
    // set last login
	public static function SetLastLogin($siteUniqId){
        
        try{
            
            $db = DB::get();
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE Sites SET LastLogin = ? WHERE SiteUniqId= ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $timestamp);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::SetLastLogin] PDO Error: '.$e->getMessage());
        }
	}
	
	// Gets all sites
	public static function GetSites(){
		
        try{

            $db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, Created FROM Sites ORDER BY Name ASC";
                    
            $s = $db->prepare($q);
            
            $s->execute();
            
            $arr = array();
            
        	while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Site::GetSites] PDO Error: '.$e->getMessage());
        } 
        
	}
	
	// Gets a site for a specific domain name
	public static function GetByDomain($domain){
		 
        try{
        
    		$db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
    						AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE Domain = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $domain);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Site::GetByDomain] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// Gets a site for a given friendlyId
	public static function GetByFriendlyId($friendlyId){
		
        try{
        
        	$db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
    						AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE FriendlyId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $friendlyId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Site::GetByFriendlyId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// Gets a site for a given siteUniqId
	public static function GetBySiteUniqId($siteUniqId){

        try{
        
            $db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
    						AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE SiteUniqId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $siteUniqId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Site::GetBySiteUniqId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// Gets a site for a given SiteId
	public static function GetBySiteId($siteId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
        					AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE Siteid = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Site::GetBySiteId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>