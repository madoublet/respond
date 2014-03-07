<?php

class AuthUser{
	
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
	
	function __construct($site, $root_url, $returnUrl){
		
		session_start();
		
		if(isset($_SESSION[$site.'.UserId'])){
			$this->UserId = $_SESSION[$site.'.UserId'];
			$this->UserUniqId = $_SESSION[$site.'.UserUniqId'];
			$this->Role = $_SESSION[$site.'.Role'];
			$this->Language = $_SESSION[$site.'.Language'];
			$this->Email = $_SESSION[$site.'.Email'];
			$this->Name = $_SESSION[$site.'.Name'];
			$this->FirstName = $_SESSION[$site.'.FirstName'];
			$this->LastName = $_SESSION[$site.'.LastName'];
			$this->HasPhotoUrl = $_SESSION[$site.'.HasPhotoUrl'];
			$this->PhotoUrl = $_SESSION[$site.'.PhotoUrl'];
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
	
}

?>