<?php

class AuthUser{
	
	// user
	public $UserId;
	public $UserUniqId;
	public $Role;
	public $Language;
	public $IsSuperAdmin;
	public $IsFirstLogin;
	public $Email;
	public $Name;
	public $FirstName;
	public $LastName;
	public $HasPhotoUrl;
	public $PhotoUrl;
	
	// role-based priveleges (what can be accessed, edited, and published)
	public $Access;
	public $CanEdit;
	public $CanPublish;
	public $CanRemove;
	public $CanCreate;
	
	// site
	public $SiteId;
	public $SiteUniqId;
	public $SiteFriendlyId;
	public $Directory;
	public $LogoUrl;
	public $PageId;
	public $sid;
	public $ip;
	public $SiteName;
	public $FileUrl;
	public $HomeUrl;
	public $TimeZone;
	public $Domain;
	public $Currency;
	public $WeightUnit;
	
	// subscription
	public $Type;
	public $CustomerId;
	public $Plan;
	public $Status;			// trialing, active, past_due, canceled, or unpaid
	public $RenewalDate;
	
	function __construct($redirect=true){
		
		if(!isset($_SESSION)){
			session_start();
		}
		
		if(isset($_SESSION['UserId'])){
			$this->UserId = $_SESSION['UserId'];
			$this->UserUniqId = $_SESSION['UserUniqId'];
			$this->Role = $_SESSION['Role'];
			$this->Language = $_SESSION['Language'];
			$this->IsSuperAdmin = $_SESSION['IsSuperAdmin'];
			$this->IsFirstLogin =  $_SESSION['IsFirstLogin'];
			$this->Email = $_SESSION['Email'];
			$this->Name = $_SESSION['Name'];
			$this->FirstName = $_SESSION['FirstName'];
			$this->LastName = $_SESSION['LastName'];
			$this->HasPhotoUrl = $_SESSION['HasPhotoUrl'];
			$this->PhotoUrl = $_SESSION['PhotoUrl'];
			$this->SiteId = $_SESSION['SiteId'];
			$this->SiteUniqId = $_SESSION['SiteUniqId'];
			$this->SiteFriendlyId = $_SESSION['SiteFriendlyId'];
			$this->Directory = $_SESSION['Directory'];
			$this->LogoUrl = $_SESSION['LogoUrl'];
			$this->sid = $_SESSION['sid'];
			$this->ip = $_SESSION['ip'];
			$this->SiteName = $_SESSION['SiteName'];
			$this->FileUrl = $_SESSION['FileUrl'];
			$this->TimeZone = $_SESSION['TimeZone']; 
			$this->Domain = $_SESSION['Domain']; 
			$this->Currency = $_SESSION['Currency']; 
			$this->WeightUnit = $_SESSION['WeightUnit']; 
			$this->Type = $_SESSION['Type'];
			$this->CustomerId = $_SESSION['CustomerId'];
			$this->Plan = $_SESSION['Plan'];
			$this->Status = $_SESSION['Status'];
			$this->RenewalDate = $_SESSION['RenewalDate'];
			$this->Access = $_SESSION['Access'];
			$this->CanEdit = $_SESSION['CanEdit'];
			$this->CanPublish = $_SESSION['CanPublish'];
			$this->CanRemove = $_SESSION['CanRemove'];
			$this->CanCreate = $_SESSION['CanCreate'];
			
		}
		else{
			if ($redirect) $this->Redirect();
		}
	}
	
	// redirects failed login
	private function Redirect(){
	    header("location:index"); /* redirects to the login page */
	}
    
    // creates the authuser for the app
    public static function Create($user, $canEdit, $canPublish, $canRemove, $canCreate){

    	session_start();

		$site = Site::GetBySiteId($user['SiteId']);
        
		$isSuperAdmin = false;
		
		if($user['Email']==SITE_ADMIN){ // set is superman
			$isSuperAdmin = true;
		}
		
		$isFirstLogin = 0;
		
		if($site['LastLogin']==null || $site['LastLogin']==''){
			$isFirstLogin = 1;
		}
        
        // determine whether user has a photo
        $hasPhotoUrl = true;
        
        if($user['PhotoUrl']==null || $user['PhotoUrl']==''){
	        $hasPhotoUrl = false;
        }
        
        Site::SetLastLogin($site['SiteUniqId']);

		$directory = 'sites/'.$site['FriendlyId'].'/';
		
		$_SESSION['UserId'] = $user['UserId'];
		$_SESSION['UserUniqId'] = $user['UserUniqId']; 
		$_SESSION['Role'] = $user['Role'];   
		$_SESSION['Language'] = $user['Language'];  
		$_SESSION['IsSuperAdmin'] = $isSuperAdmin;  
		$_SESSION['IsFirstLogin'] = $isFirstLogin; 
		$_SESSION['Email'] = $user['Email'];
		$_SESSION['Name'] = $user['FirstName'].' '.$user['LastName'];
		$_SESSION['FirstName'] = $user['FirstName'];
		$_SESSION['LastName'] = $user['LastName'];
		$_SESSION['HasPhotoUrl'] = $hasPhotoUrl;
		$_SESSION['PhotoUrl'] = $user['PhotoUrl'];
		$_SESSION['SiteId'] = $user['SiteId'];
		$_SESSION['SiteUniqId'] = $site['SiteUniqId'];
		$_SESSION['SiteFriendlyId'] = $site['FriendlyId'];
		$_SESSION['Domain'] = $site['Domain'];
		$_SESSION['Currency'] = $site['Currency'];
		$_SESSION['WeightUnit'] = $site['WeightUnit'];
		$_SESSION['Directory'] = $directory;
		$_SESSION['LogoUrl'] = $site['LogoUrl'];
		$_SESSION['sid'] = session_id(); 
		$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
		$_SESSION['SiteName'] = $site['Name'];
		$_SESSION['FileUrl'] = 'sites/'.$site['FriendlyId'].'/files/';
		$_SESSION['TimeZone'] = $site['TimeZone'];
		$_SESSION['Type'] = $site['Type'];
		$_SESSION['CustomerId'] = $site['CustomerId'];
		
		// what can be edited and published
		if($canEdit == 'All' || $canPublish == 'All' || $canRemove == 'All' || $canCreate == 'All'){
			$_SESSION['Access'] = 'All';
		}
		else{
			$_SESSION['Access'] = $canEdit.','.$canPublish.','.$canRemove.','.$canCreate;
		}
		
		$_SESSION['CanEdit'] = $canEdit;
		$_SESSION['CanPublish'] = $canPublish;
		$_SESSION['CanRemove'] = $canRemove;
		$_SESSION['CanCreate'] = $canCreate;
		
		if(strtoupper($site['Type']) == 'SUBSCRIPTION' && $site['CustomerId'] != NULL){
			AuthUser::UpdateSubscription();
		}
		else{
			$_SESSION['Status'] = 'N/A';
			$_SESSION['Plan'] = 'N/A';
			$_SESSION['RenewalDate'] = NULL;
		}

	}

	// updates changes to the user
	public function UpdateUser(){
		
		$user = User::GetByUserUniqId($this->UserUniqId);
		
		// determine whether user has a photo
        $hasPhotoUrl = true;
        
        if($user['PhotoUrl']==null || $user['PhotoUrl']==''){
	        $hasPhotoUrl = false;
        }
		
		// update session
		$_SESSION['Name'] = $user['FirstName'].' '.$user['LastName'];
		$_SESSION['FirstName'] = $user['FirstName'];
		$_SESSION['LastName'] = $user['LastName'];
		$_SESSION['HasPhotoUrl'] = $hasPhotoUrl;
		$_SESSION['PhotoUrl'] = $user['PhotoUrl'];
		$_SESSION['Language'] = $user['Language'];  
		
		return;
	}
	
	// updates the subscription for a user
	public static function UpdateSubscription(){
	
		try{
			$customerId = $_SESSION['CustomerId'];
			
			Stripe::setApiKey(STRIPE_API_KEY);
	
			$customer = Stripe_Customer::retrieve($customerId);
	
			// get default subscription
			if(isset($customer->subscriptions->data[0])){
				$subscription = $customer->subscriptions->data[0];
				
				$_SESSION['Status'] = $subscription->status;
				$_SESSION['Plan'] = $subscription->plan->id;
				$_SESSION['RenewalDate'] = gmdate("Y-m-d H:i:s", intval($subscription->current_period_end));
			}
			else{
				$_SESSION['Status'] = 'unsubscribed';
				$_SESSION['Plan'] = '';
				$_SESSION['RenewalDate'] = NULL;
			}
	
		}
		catch (Exception $e){
			throw new Exception('Stripe error: '.$e->getMessage().'. Contact your administrator.'); 
		}
		
	}
	
	// gets timezone offset in hours for a user
	public function Offset(){
		$zone = new DateTimeZone($this->TimeZone);
		$now = new DateTime("now", $zone);
		
		$offset = $zone->getOffset($now);
		$offset_hours = round(($offset)/3600); 
	
		return $offset_hours;
	}

	// authenticates a user based on role
	public function Authenticate($auth){
		
		if($auth=='Admin'){
			if($this->Role != 'Admin'){
				die('You are not authorized to view this page.');
			}
		}
		
		if($auth=='SuperAdmin'){
			if($this->IsSuperAdmin!=true){
				die('You are not authorized to view this page.');
			}
		}
		
	}
}

?>