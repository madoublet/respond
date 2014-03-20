<?php

class SiteAuthUser{
	
	// user
	public $UserId;
	public $UserUniqId;
	public $Role;
	public $Language;
	public $Email;
	public $Name;
	public $FirstName;
	public $LastName;
	public $HasPhotoUrl;
	public $PhotoUrl;
	
	function __construct($siteFriendlyId, $root_url, $returnUrl){
		
		if(!isset($_SESSION)){
			session_start();
		}
		
		if(isset($_SESSION[$siteFriendlyId.'.UserId'])){
			$this->UserId = $_SESSION[$siteFriendlyId.'.UserId'];
			$this->UserUniqId = $_SESSION[$siteFriendlyId.'.UserUniqId'];
			$this->Role = $_SESSION[$siteFriendlyId.'.Role'];
			$this->Language = $_SESSION[$siteFriendlyId.'.Language'];
			$this->Email = $_SESSION[$siteFriendlyId.'.Email'];
			$this->Name = $_SESSION[$siteFriendlyId.'.Name'];
			$this->FirstName = $_SESSION[$siteFriendlyId.'.FirstName'];
			$this->LastName = $_SESSION[$siteFriendlyId.'.LastName'];
			$this->HasPhotoUrl = $_SESSION[$siteFriendlyId.'.HasPhotoUrl'];
			$this->PhotoUrl = $_SESSION[$siteFriendlyId.'.PhotoUrl'];
		}
		else{
			$this->Redirect($root_url, $returnUrl);
		}
	}
	
	// redirects failed login
	private function Redirect($root_url, $returnUrl){
	    header('location:'.$root_url.'login?r='.urlencode($returnUrl));
	}
    
	// authenticates a user based on role
	public function Authenticate($auth){
		
		if($auth=='Admin'){
			if($this->Role != 'Admin'){
				die('You are not authorized to view this page.');
			}
		}
		
	}
	
	public static function Create($siteFriendlyId, $user){
		
		if(!isset($_SESSION)){
			session_start();
		}
    	
    	// determine whether user has a photo
        $hasPhotoUrl = true;
        
        if($user['PhotoUrl']==null || $user['PhotoUrl']==''){
	        $hasPhotoUrl = false;
        }
	
		$_SESSION[$siteFriendlyId.'.UserId'] = $user['UserId'];
		$_SESSION[$siteFriendlyId.'.UserUniqId'] = $user['UserUniqId']; 
		$_SESSION[$siteFriendlyId.'.Role'] = $user['Role'];   
		$_SESSION[$siteFriendlyId.'.Language'] = $user['Language'];  
		$_SESSION[$siteFriendlyId.'.Email'] = $user['Email'];
		$_SESSION[$siteFriendlyId.'.Name'] = $user['FirstName'].' '.$user['LastName'];
		$_SESSION[$siteFriendlyId.'.FirstName'] = $user['FirstName'];
		$_SESSION[$siteFriendlyId.'.LastName'] = $user['LastName'];
		$_SESSION[$siteFriendlyId.'.HasPhotoUrl'] = $hasPhotoUrl;
		$_SESSION[$siteFriendlyId.'.PhotoUrl'] = $user['PhotoUrl'];
		
	}
	
}

?>