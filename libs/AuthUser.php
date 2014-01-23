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
	
	function __construct(){
		
		session_start();
		
		if(isset($_SESSION['UserId']))
		{
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
			
		}
		else $this->Redirect();
	}
	
	private function Redirect(){
	    header("location:index.php"); /* redirects to the login page */
	}
    
    public static function Create($user){

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
		
		if(strtoupper($site['Type']) == 'SUBSCRIPTION' && $site['CustomerId'] != NULL){
			AuthUser::UpdateSubscription();
		}
		else{
			$_SESSION['Status'] = 'N/A';
			$_SESSION['Plan'] = 'N/A';
			$_SESSION['RenewalDate'] = NULL;
		}

	}
	
	public static function UpdateSubscription(){
	
		try{
			$customerId = $_SESSION['CustomerId'];
			
			Stripe::setApiKey(STRIPE_API_KEY);
	
			$customer = Stripe_Customer::retrieve($customerId);
	
			if($customer->subscription){
				$_SESSION['Status'] = $customer->subscription->status;
				$_SESSION['Plan'] = $customer->subscription->plan->id;
				$_SESSION['RenewalDate'] = gmdate("Y-m-d H:i:s", intval($customer->subscription->current_period_end));
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