<?php

class AuthUser{
	
	public $UserId;
	public $UserUniqId;
	public $Role;
	public $IsSuperAdmin;
	public $IsFirstLogin;
	public $Email;
	public $Name;
	public $FirstName;
	public $LastName;
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
	
	function __construct(){
		
		session_start();
		
		if(isset($_SESSION['UserId']))
		{
			$this->UserId = $_SESSION['UserId'];
			$this->UserUniqId = $_SESSION['UserUniqId'];
			$this->Role = $_SESSION['Role'];
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
		}
		else $this->Redirect();
	}
	
	private function Redirect(){
	    header("location:index.php"); /* redirects to the login page */
	}
    
    public static function Create($user){

    	session_start();

		$site = Site::GetBySiteId($user['SiteId']);
        
		$isSuperAdmin = 0;
		
		if($user['Email']==SITE_ADMIN){ // set is superman
			$isSuperAdmin = 1;
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
		$_SESSION['IsSuperAdmin'] = $isSuperAdmin;  
		$_SESSION['IsFirstLogin'] = $isFirstLogin; 
		$_SESSION['Email'] = $user['Email'];
		$_SESSION['Name'] = $user['FirstName'].' '.$user['LastName'];
		$_SESSION['FirstName'] = $user['FirstName'];
		$_SESSION['LastName'] = $user['LastName'];
		$_SESSION['SiteId'] = $user['SiteId'];
		$_SESSION['SiteUniqId'] = $site['SiteUniqId'];
		$_SESSION['SiteFriendlyId'] = $site['FriendlyId'];
		$_SESSION['Directory'] = $directory;
		$_SESSION['LogoUrl'] = $site['LogoUrl'];
		$_SESSION['sid'] = session_id(); 
		$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
		$_SESSION['SiteName'] = $site['Name'];
		$_SESSION['FileUrl'] = 'sites/'.$site['FriendlyId'].'/files/';
		$_SESSION['TimeZone'] = $site['TimeZone'];

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