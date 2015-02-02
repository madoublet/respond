<?php

// Site model
class Site{
	
	// adds a Site
	public static function Add($domain, $bucket, $name, $friendlyId, $urlMode, $logoUrl, $theme, $primaryEmail, $timeZone, $language, $direction, $welcomeEmail, $receiptEmail){
        
        try{
            
        	$db = DB::get();
		
    		$siteId = uniqid();
    		$analyticsId = '';
    		$facebookAppId = '';
    		
    		// set defaults
    		$status = DEFAULT_STATUS;
    		$plan = DEFAULT_PLAN;
    		$userLimit = DEFAULT_USER_LIMIT;
    		$fileLimit = DEFAULT_FILE_LIMIT;
  
    		$timestamp = gmdate("Y-m-d H:i:s", time());

            $q = "INSERT INTO Sites (SiteId, FriendlyId, UrlMode, Domain, Bucket, Name, LogoUrl, Theme, PrimaryEmail, TimeZone, Language, Direction, WelcomeEmail, ReceiptEmail, Status, Plan, UserLimit, FileLimit, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
            $s->bindParam(2, $friendlyId);
            $s->bindParam(3, $urlMode);
            $s->bindParam(4, $domain);
            $s->bindParam(5, $bucket);
            $s->bindParam(6, $name);
            $s->bindParam(7, $logoUrl);
            $s->bindParam(8, $theme);
            $s->bindParam(9, $primaryEmail);
            $s->bindParam(10, $timeZone);
            $s->bindParam(11, $language);
            $s->bindParam(12, $direction);
            $s->bindParam(13, $welcomeEmail);
            $s->bindParam(14, $receiptEmail);
            $s->bindParam(15, $status);
            $s->bindParam(16, $plan);
            $s->bindParam(17, $userLimit);
            $s->bindParam(18, $fileLimit);
            $s->bindParam(19, $timestamp);
            
            $s->execute();
            
            return array(
                'SiteId' => $siteId,
                'FriendlyId' => $friendlyId,
                'UrlMode' => $urlMode,
                'Domain' => $domain,
                'Bucket' => $bucket,
                'Name' => $name,
                'LogoUrl' => $logoUrl,
                'Theme' => $theme,
                'PrimaryEmail' => $primaryEmail,
                'TimeZone' => $timeZone,
                'Language' => $language,
                'Direction' => $direction,
                'WelcomeEmail' => $welcomeEmail,
                'ReceiptEmail' => $receiptEmail,
                'Created' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[Site::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// edits the site information
	public static function Edit($siteId, $name, $domain, $primaryEmail, $timeZone, $language, $direction, 
		$showCart, $showSettings, $showLanguages, $showLogin, $urlMode,
		$currency, $weightUnit, $shippingCalculation, $shippingRate, $shippingTiers, $taxRate, $payPalId, $payPalUseSandbox,
		$welcomeEmail, $receiptEmail,
		$isSMTP, $SMTPHost, $SMTPAuth, $SMTPUsername, $SMTPSecure, 
		$formPublicId, $formPrivateId){

		try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
            		Name= ?, 
                    Domain= ?, 
        			PrimaryEmail = ?,
        			TimeZone = ?,
        			Language = ?,
        			Direction = ?,
        			Currency = ?,
        			ShowCart = ?,
        			ShowSettings = ?,
        			ShowLanguages = ?,
        			ShowLogin = ?,
        			UrlMode = ?,
        			WeightUnit = ?,
        			ShippingCalculation = ?, 
        			ShippingRate = ?,
        			ShippingTiers = ?,
        			TaxRate = ?,
        			PayPalId = ?,
        			PayPalUseSandbox = ?,
        			WelcomeEmail = ?, 
        			ReceiptEmail = ?,
					IsSMTP = ?, 
					SMTPHost = ?, 
					SMTPAuth = ?, 
					SMTPUsername = ?, 
					SMTPSecure = ?,
            		FormPublicId=?,
            		FormPrivateId=?
        			WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $name);
            $s->bindParam(2, $domain);
            $s->bindParam(3, $primaryEmail);
            $s->bindParam(4, $timeZone);
            $s->bindParam(5, $language);
            $s->bindParam(6, $direction);
            $s->bindParam(7, $currency);
            $s->bindParam(8, $showCart);
            $s->bindParam(9, $showSettings);
            $s->bindParam(10, $showLanguages);
            $s->bindParam(11, $showLogin);
            $s->bindParam(12, $urlMode);
            $s->bindParam(13, $weightUnit);
            $s->bindParam(14, $shippingCalculation);
            $s->bindValue(15, strval($shippingRate), PDO::PARAM_STR);
            $s->bindParam(16, $shippingTiers);
            $s->bindParam(17, $taxRate);
            $s->bindParam(18, $payPalId);
            $s->bindParam(19, $payPalUseSandbox);
            $s->bindParam(20, $welcomeEmail); 
            $s->bindParam(21, $receiptEmail);
			$s->bindParam(22, $isSMTP); 
			$s->bindParam(23, $SMTPHost); 
			$s->bindParam(24, $SMTPAuth); 
			$s->bindParam(25, $SMTPUsername);  
			$s->bindParam(26, $SMTPSecure); 
            $s->bindParam(27, $formPublicId);
            $s->bindParam(28, $formPrivateId);
            $s->bindParam(29, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the SMTPPassword
	public static function EditSMTPPassword($siteId, $SMTPPassword, $SMTPPasswordIV){

		try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
            		SMTPPassword = ?, 
                    SMTPPasswordIV = ?
        			WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $SMTPPassword);
            $s->bindParam(2, $SMTPPasswordIV);
            $s->bindParam(3, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::SMTPPassword] PDO Error: '.$e->getMessage());
        }
        
	}    
	
    // edits the theme
    public static function EditTheme($siteId, $theme){
        
        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                	Theme= ?
                	WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $theme);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditTheme] PDO Error: '.$e->getMessage());
        }
        
	}
    
    // edits the logo
    public static function EditLogo($siteId, $logoUrl){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    LogoUrl= ?
                    WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $logoUrl);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditLogo] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the icon
    public static function EditIcon($siteId, $iconUrl){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    IconUrl= ?
                    WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $iconUrl);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditIcon] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the icon bg
    public static function EditIconBg($siteId, $iconBg){

        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                    IconBg= ?
                    WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $iconBg);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditIconBg] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// edits the administrative portion of the site
    public static function EditAdmin($siteId, $domain, $bucket, $status, $fileLimit, $userLimit){
        
        try{
            
            $db = DB::get();
            
            $q = "UPDATE Sites SET 
                	Domain = ?,
                	Bucket = ?,
                	Status = ?,
                	FileLimit = ?,
                	UserLimit = ?
                	WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $domain);
            $s->bindParam(2, $bucket);
            $s->bindParam(3, $status);
            $s->bindParam(4, $fileLimit);
            $s->bindParam(5, $userLimit);
            $s->bindParam(6, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::EditAdmin] PDO Error: '.$e->getMessage());
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
	public static function SetLastLogin($siteId){
        
        try{
            
            $db = DB::get();
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE Sites SET LastLogin = ? WHERE SiteId= ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $timestamp);
            $s->bindParam(2, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::SetLastLogin] PDO Error: '.$e->getMessage());
        }
	}
		
	// subscribes a site (change status, plan, and set customer)
	public static function Subscribe($siteId, $status, $plan, $provider, $subscriptionId, $customerId){
        
        try{
        
            $db = DB::get();
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE Sites SET Status = ?, Plan = ?, Provider = ?, SubscriptionId = ?, CustomerId = ? WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $status);
            $s->bindParam(2, $plan);
            $s->bindParam(3, $provider);
            $s->bindParam(4, $subscriptionId);
            $s->bindParam(5, $customerId);
            $s->bindParam(6, $siteId);
            
            $s->execute();
            
            // unserialize plans
            $plans_json = file_get_contents(APP_LOCATION.'data/plans.json');
            
            // decode json
            $plans = json_decode($plans_json, true);
            
            // set test defaults
            $userLimit = -1;
            $fileLimit = -1;
            
            // walkthrough plans
            foreach ($plans as $item) {
	            
	            //$ids .= $item['id'].' ';
			    
			    if($item['id'] == $plan){
				    
				    // get user and file limit from plan
				    $userLimit = $item['userLimit'];
				    $fileLimit = $item['fileLimit'];
				    
			    }
			    
			}

			// set the user and file limit if found
			if($userLimit != -1){
				
				$q = "UPDATE Sites SET UserLimit = ?, FileLimit = ? WHERE SiteId = ?";
     
	            $s = $db->prepare($q);
	            $s->bindParam(1, $userLimit);
	            $s->bindParam(2, $fileLimit);
	            $s->bindParam(3, $siteId);
				
				$s->execute();
			}
            
		} catch(PDOException $e){
            die('[Site::Subscribe] PDO Error: '.$e->getMessage());
        }
	}
	
	// gets all sites
	public static function GetSites(){
		
        try{
            $db = DB::get();
            
            $q = "SELECT SiteId, FriendlyId, Domain, Bucket, Name, LogoUrl, IconUrl, IconBg, Theme,
    						PrimaryEmail, TimeZone, Language, Direction, Currency, 
    						ShowCart, ShowSettings, ShowLanguages, ShowLogin, UrlMode,
    						WeightUnit, ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox,
							WelcomeEmail, ReceiptEmail,
							IsSMTP, SMTPHost, SMTPAuth, SMTPUsername, SMTPPassword, SMTPPasswordIV, SMTPSecure,
							FormPublicId, FormPrivateId,
							Status, Plan, Provider, SubscriptionId, CustomerId,
							CanDeploy, UserLimit, FileLimit,
							LastLogin, Created
							FROM Sites ORDER BY Created DESC";
                    
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
	
	// gets all domains for CORS auth
	public static function GetDomains(){
		
        try{
            $db = DB::get();
            
            $q = "SELECT Domain, FriendlyId FROM Sites";
                    
            $s = $db->prepare($q);
            
            $s->execute();
            
            $arr = array();
            
        	while($row = $s->fetch(PDO::FETCH_ASSOC)) { 
        		$domain = $row['Domain'];
        		$www = str_replace('http://', 'http://www.', $row['Domain']);
        		$www_s = str_replace('https://', 'https://www.', $row['Domain']);
        		
        		$s3 = str_replace('{{site}}', $row['FriendlyId'], S3_URL);
        		        	
                array_push($arr, $domain);
                array_push($arr, $www);
                array_push($arr, $www_s);
                array_push($arr, $s3);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Site::GetDomains] PDO Error: '.$e->getMessage());
        }   
	}
	
	// removes a site
	public static function Remove($siteId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Sites WHERE SiteId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Site::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// Gets a site for a specific domain name
	public static function GetByDomain($domain){
		 
        try{
        
    		$db = DB::get();
            
            $q = "SELECT SiteId, FriendlyId, Domain, Bucket, Name, LogoUrl, IconUrl, IconBg, Theme,
    						PrimaryEmail, TimeZone, Language, Direction, Currency, 
    						ShowCart, ShowSettings, ShowLanguages, ShowLogin, UrlMode,
    						WeightUnit, ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox,
							WelcomeEmail, ReceiptEmail,
							IsSMTP, SMTPHost, SMTPAuth, SMTPUsername, SMTPPassword, SMTPPasswordIV, SMTPSecure,
							FormPublicId, FormPrivateId,
							Status, Plan, Provider, SubscriptionId, CustomerId,
							CanDeploy, UserLimit, FileLimit,
							LastLogin, Created	
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
            
            $q = "SELECT SiteId, FriendlyId, Domain, Bucket, Name, LogoUrl, IconUrl, IconBg, Theme,
    						PrimaryEmail, TimeZone, Language, Direction, Currency, 
    						ShowCart, ShowSettings, ShowLanguages, ShowLogin, UrlMode,
    						WeightUnit, ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox,
							WelcomeEmail, ReceiptEmail,
							IsSMTP, SMTPHost, SMTPAuth, SMTPUsername, SMTPPassword, SMTPPasswordIV, SMTPSecure,
							FormPublicId, FormPrivateId,
							Status, Plan, Provider, SubscriptionId, CustomerId,
							CanDeploy, UserLimit, FileLimit,
							LastLogin, Created
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
	
	// Gets a site for a given SiteId
	public static function GetBySiteId($siteId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT SiteId, FriendlyId, Domain, Bucket, Name, LogoUrl, IconUrl, IconBg, Theme,
    						PrimaryEmail, TimeZone, Language, Direction, Currency, 
    						ShowCart, ShowSettings, ShowLanguages, ShowLogin, UrlMode,
    						WeightUnit, ShippingCalculation, ShippingRate, ShippingTiers, TaxRate, 
							PayPalId, PayPalUseSandbox,
							WelcomeEmail, ReceiptEmail,
							IsSMTP, SMTPHost, SMTPAuth, SMTPUsername, SMTPPassword, SMTPPasswordIV, SMTPSecure,
							FormPublicId, FormPrivateId,
							Status, Plan, Provider, SubscriptionId, CustomerId, 
							CanDeploy, UserLimit, FileLimit,
							LastLogin, Created
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