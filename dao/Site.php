<?php

// Site model
class Site{
	
	// adds a Site
	public static function Add($domain, $name, $friendlyId, $logoUrl, $theme, $primaryEmail, $timeZone, $language){
        
        try{
            
        	$db = DB::get();
		
    		$siteUniqId = uniqid();
    		$analyticsId = '';
    		$facebookAppId = '';
    		
    		$type = 'Non-Subscription';
  
    		$timestamp = gmdate("Y-m-d H:i:s", time());

            $q = "INSERT INTO Sites (SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Theme, AnalyticsId, FacebookAppId, PrimaryEmail, TimeZone, Language, PayPalId, Type, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $siteUniqId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $domain);
            $s->bindParam(4, $name);
            $s->bindParam(5, $logoUrl);
            $s->bindParam(6, $theme);
            $s->bindParam(7, $analyticsId);
            $s->bindParam(8, $facebookAppId);
            $s->bindParam(9, $primaryEmail);
            $s->bindParam(10, $timeZone);
            $s->bindParam(11, $language);
            $s->bindParam(12, $primaryEmail);
            $s->bindParam(13, $type);
            $s->bindParam(14, $timestamp);
            
            $s->execute();
            
            return array(
                'SiteId' => $db->lastInsertId(),
                'SiteUniqId' => $siteUniqId,
                'FriendlyId' => $friendlyId,
                'Domain' => $domain,
                'Name' => $name,
                'LogoUrl' => $logoUrl,
                'Theme' => $theme,
                'AnalyticsId' => $analyticsId,
                'FacebookAppId' => $facebookAppId,
                'PrimaryEmail' => $primaryEmail,
                'TimeZone' => $timeZone,
                'Language' => $language,
                'PayPalId' => $primaryEmail,
                'Created' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[Site::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	
	// edits the site information
	public static function Edit($siteUniqId, $domain, $name, $analyticsId, $facebookAppId, $primaryEmail, $timeZone, $language, $currency, $weightUnit, $shippingCalculation, $shippingRate, $shippingTiers, $taxRate, $payPalId, $payPalUseSandbox, $analyticssubdomain, $analyticsmultidomain, $analyticsdomain, $formPublicId, $formPrivateId){

		try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
            		Name= ?, 
                    Domain= ?, 
        			AnalyticsId= ?,
        			FacebookAppId= ?,
            		PrimaryEmail = ?,
        			TimeZone = ?,
        			Language = ?,
        			Currency = ?,
        			WeightUnit = ?,
        			ShippingCalculation = ?, 
        			ShippingRate = ?,
        			ShippingTiers = ?,
        			TaxRate = ?,
        			PayPalId = ?,
        			PayPalUseSandbox = ?,
            		AnalyticsSubdomain=?,
            		AnalyticsMultidomain=?,
            		AnalyticsDomain=?,
            		FormPublicId=?,
            		FormPrivateId=?
        			WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $domain);
            $s->bindParam(3, $analyticsId);
            $s->bindParam(4, $facebookAppId);
            $s->bindParam(5, $primaryEmail);
            $s->bindParam(6, $timeZone);
            $s->bindParam(7, $language);
            $s->bindParam(8, $currency);
            $s->bindParam(9, $weightUnit);
            $s->bindParam(10, $shippingCalculation);
            $s->bindValue(11, strval($shippingRate), PDO::PARAM_STR);
            $s->bindParam(12, $shippingTiers);
            $s->bindParam(13, $taxRate);
            $s->bindParam(14, $payPalId);
            $s->bindParam(15, $payPalUseSandbox);
            $analyticsdomain = trim($analyticsdomain);
            if (empty($analyticsdomain)) {
            	$analyticssubdomain = $analyticsmultidomain = 0;
            }
            $analyticssubdomain = ($analyticsmultidomain ? '1' : $analyticssubdomain);  // if multi-domain > subdomain must be active
            $s->bindParam(16, $analyticssubdomain);
            $s->bindParam(17, $analyticsmultidomain);
            $s->bindParam(18, $analyticsdomain);
            $s->bindParam(19, $formPublicId);
            $s->bindParam(20, $formPrivateId);
            $s->bindParam(21, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // edits the theme
    public static function EditTheme($siteUniqId, $theme){
        
        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                	Theme= ?
                	WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $theme);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditTheme] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // edits the logo
    public static function EditLogo($siteUniqId, $logoUrl){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    LogoUrl= ?
                    WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $logoUrl);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditLogo] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the icon
    public static function EditIcon($siteUniqId, $iconUrl){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    IconUrl= ?
                    WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $iconUrl);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditIcon] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the icon bg
    public static function EditIconBg($siteUniqId, $iconBg){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    IconBg= ?
                    WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $iconBg);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditIconBg] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the PayPalLogoUrl
    public static function EditPayPalLogoUrl($siteUniqId, $payPalLogoUrl){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    PayPalLogoUrl= ?
                    WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $payPalLogoUrl);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditPayPalLogoUrl] PDO Error: '.$e->getMessage());
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
	
	// update customer
	public static function EditCustomer($siteUniqId, $customerId){
        
        try{
        
            $db = DB::get();
            
            $q = "UPDATE Sites SET Type = 'Subscription', CustomerId = ? WHERE SiteUniqId= ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $customerId);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditCustomer] PDO Error: '.$e->getMessage());
        }
	}
		
	// update type
	public static function EditType($siteUniqId, $type){
        
        try{
        
            $db = DB::get();
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE Sites SET Type = ? WHERE SiteUniqId= ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $type);
            $s->bindParam(2, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::UpdateStatus] PDO Error: '.$e->getMessage());
        }
	}
	
	// gets all sites
	public static function GetSites(){
		
        try{
            $db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, IconUrl, IconBg, Theme,
    						AnalyticsId, AnalyticsSubdomain, AnalyticsMultidomain, AnalyticsDomain, FormPublicId, FormPrivateId,
    						FacebookAppId, PrimaryEmail,
							TimeZone, Language, Currency, WeightUnit, 
							ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox, PayPalLogoUrl,
							LastLogin, Type, CustomerId, 
							Created
							FROM Sites ORDER BY Name ASC";
                    
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
	
	// gets all domains
	public static function GetDomains(){
		
        try{
            $db = DB::get();
            
            $q = "SELECT Domain FROM Sites";
                    
            $s = $db->prepare($q);
            
            $s->execute();
            
            $arr = array();
            
        	while($row = $s->fetch(PDO::FETCH_ASSOC)) { 
        		$domain = 'http://'.$row['Domain'];
        		$www = 'http://www.'.$row['Domain'];
        	
                array_push($arr, $domain);
                array_push($arr, $www);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Site::GetDomains] PDO Error: '.$e->getMessage());
        }   
	}
	
	// removes a site
	public static function Remove($siteUniqId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Sites WHERE SiteUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $siteUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// Gets a site for a specific domain name
	public static function GetByDomain($domain){
		 
        try{
        
    		$db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, IconUrl, IconBg, Theme,
    						AnalyticsId, AnalyticsSubdomain, AnalyticsMultidomain, AnalyticsDomain, FormPublicId, FormPrivateId,
    						FacebookAppId, PrimaryEmail,
							TimeZone, Language, Currency, WeightUnit, 
							ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox, PayPalLogoUrl,
							LastLogin, Type, CustomerId, 
							Created
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
	
	// Gets a site for a specific domain name
	public static function GetByCustomerId($customerId){
		 
        try{
        
    		$db = DB::get();
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, IconUrl, IconBg, Theme,
    						AnalyticsId, AnalyticsSubdomain, AnalyticsMultidomain, AnalyticsDomain, FormPublicId, FormPrivateId,
    						FacebookAppId, PrimaryEmail,
							TimeZone, Language, Currency, WeightUnit, 
							ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox, PayPalLogoUrl,
							LastLogin, Type, CustomerId, 
							Created
							FROM Sites WHERE CustomerId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $customerId);
            
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
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, IconUrl, IconBg, Theme,
    						AnalyticsId, AnalyticsSubdomain, AnalyticsMultidomain, AnalyticsDomain, FormPublicId, FormPrivateId,
    						FacebookAppId, PrimaryEmail,
							TimeZone, Language, Currency, WeightUnit, 
							ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox, PayPalLogoUrl,
							LastLogin, Type, CustomerId, 
							Created
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
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, IconUrl, IconBg, Theme,
    						AnalyticsId, AnalyticsSubdomain, AnalyticsMultidomain, AnalyticsDomain, FormPublicId, FormPrivateId,
    						FacebookAppId, PrimaryEmail,
							TimeZone, Language, Currency, WeightUnit, 
							ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox, PayPalLogoUrl,
							LastLogin, Type, CustomerId, 
							Created
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
            
            $q = "SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, IconUrl, IconBg, Theme,
        					AnalyticsId, AnalyticsSubdomain, AnalyticsMultidomain, AnalyticsDomain, FormPublicId, FormPrivateId,
        					FacebookAppId, PrimaryEmail,
							TimeZone, Language, Currency, WeightUnit, 
							ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox, PayPalLogoUrl,
							LastLogin, Type, CustomerId, 
							Created
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