<?php

// Site model
class Site{
	
	public $SiteId;
	public $SiteUniqId;
	public $FriendlyId;
	public $Domain;
	public $Name;
	public $LogoUrl;
	public $Template;
	public $AnalyticsId;
	public $FacebookAppId;
	public $PrimaryEmail;
	public $TimeZone;
	public $LastLogin;
	public $Created;
	
	function __construct($siteId, $siteUniqId, $friendlyId, $domain, $name, $logoUrl, $template,
			$analyticsId, $facebookAppId, $primaryEmail,
			$timeZone, $lastLogin, $created){
		$this->SiteId = $siteId;
		$this->SiteUniqId = $siteUniqId;
		$this->FriendlyId = $friendlyId;
		$this->Domain = $domain;
		$this->Name = $name;
		$this->LogoUrl = $logoUrl;
		$this->Template = $template;
		$this->AnalyticsId = $analyticsId;
		$this->FacebookAppId = $facebookAppId;
		$this->PrimaryEmail = $primaryEmail;
		$this->TimeZone = $timeZone;
		$this->LastLogin = $lastLogin;
		$this->Created = $created;
	}
    
    // creates an associative array from the public params
    public function ToAssocArray(){
		$arr = array();

		foreach($this as $var=>$value){
			$arr[$var] = $value;
		}

		return $arr;
	}
	
	// adds a Site
	public static function Add($domain, $name, $friendlyId, $logoUrl, $template, $primaryEmail){
		
		Connect::init();
		
		$siteUniqId = uniqid();
		$domain = mysql_real_escape_string($domain); // clean data
		$name = mysql_real_escape_string($name);
		$friendlyId = mysql_real_escape_string($friendlyId);
		$logoUrl = mysql_real_escape_string($logoUrl);
		$template = mysql_real_escape_string($template);
		$primaryEmail = mysql_real_escape_string($primaryEmail);
		$timeZone = 'CST';
		$analyticsId = '';
		$facebookAppId = '';
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		$expdate = gmdate("Y-m-d H:i:s", (time() + (30 * 24 * 60 * 60)));
		
		$result = mysql_query(
			"INSERT INTO Sites (SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template, AnalyticsId, FacebookAppId, PrimaryEmail,
				TimeZone, Created) 
			 VALUES ('$siteUniqId', '$friendlyId', '$domain', '$name', '$logoUrl', '$template', '$analyticsId', '$facebookAppId', '$primaryEmail',
			 	'$timeZone', '$timestamp')");
	
		if(!$result) {
		  print "Could not successfully run query Site->Add" . mysql_error() . "<br>";
		  exit;
		}
	
		return new Site(mysql_insert_id(), $siteUniqId, $friendlyId, $domain, $name, $logoUrl, 
			$template, $analyticsId, $facebookAppId, $primaryEmail, $timeZone, $timestamp, $timestamp);
	}
	
	
	// Edits the site information
	public static function Edit($siteUniqId, $domain, $name, $analyticsId, $facebookAppId, $primaryEmail, $timeZone){

		Connect::init();
		
        $siteUniqId = mysql_real_escape_string($siteUniqId);
		$name = mysql_real_escape_string($name);
		$domain = mysql_real_escape_string($domain);
    	$analyticsId = mysql_real_escape_string($analyticsId);
		$facebookAppId = mysql_real_escape_string($facebookAppId);
		$primaryEmail = mysql_real_escape_string($primaryEmail);
    	$timeZone = mysql_real_escape_string($timeZone);
		
		$result = mysql_query("UPDATE Sites 
			SET 
    		Name='$name', 
            Domain='$domain', 
			AnalyticsId='$analyticsId',
			FacebookAppId='$facebookAppId',
    		PrimaryEmail = '$primaryEmail',
			TimeZone = '$timeZone' WHERE SiteUniqId='$siteUniqId'");

		if(!$result) {
		  print "Could not successfully run query Site->Edit:" . mysql_error();
		  exit;
		}
	}
    
    // Edits the template
    public static function EditTemplate($siteUniqId, $template){

		Connect::init();
		
        $siteUniqId = mysql_real_escape_string($siteUniqId);
        $template = mysql_real_escape_string($template);
		
		$result = mysql_query("UPDATE Sites 
			SET  
            Template='$template'
			WHERE SiteUniqId='$siteUniqId'");

		if(!$result) {
		  print "Could not successfully run query Site->EditTemplate:" . mysql_error();
		  exit;
		}
	}
    
    // Edits the logo
    public static function EditLogo($siteUniqId, $logoUrl){

    	Connect::init();
		
        $siteUniqId = mysql_real_escape_string($siteUniqId);
        $logoUrl = mysql_real_escape_string($logoUrl);
		
		$result = mysql_query("UPDATE Sites 
			SET  
            LogoUrl='$logoUrl'
			WHERE SiteUniqId='$siteUniqId'");

		if(!$result) {
		  print "Could not successfully run query Site->EditLogo:" . mysql_error();
		  exit;
		}
	}
	
	// determines whether a friendlyId is unique
	public static function IsFriendlyIdUnique($friendlyId){

		Connect::init();
		
		$login = mysql_real_escape_string($friendlyId); // clean data
		settype($siteId, 'integer');
		
		$count=0;
	
		// Pulls in the Name of the User too
		$result = mysql_query("SELECT Count(*) as Count
			FROM Sites where FriendlyId='$friendlyId'");
			
		if(mysql_num_rows($result) == 0){
		    return false;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$count = $row["Count"];
		}
	
		if($count==0){
			return true;
		}
		else{
			return false;
		}
	}

	
    // set last login
	public function SetLastLogin(){
		
		Connect::init();
	
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$result = mysql_query("UPDATE Sites SET LastLogin = '$timestamp'
			WHERE SiteId=$this->SiteId");
	
		if(!$result) {
		  print "Could not successfully run query Site->EditImageConstraints" . mysql_error() . "<br>";
		  exit;
		}
	}
	
	// Gets all sites
	public static function GetSites(){
		
		Connect::init();
		
		// Pulls in the Name of the User too
		$result = mysql_query("SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, Created
			FROM Sites
			ORDER BY Name ASC");

		if(!$result) {
		  die("Could not successfully run query Site->GetSites" . mysql_error() . "<br>");
		  exit;
		}
		
		return $result;
	}
	
	// Gets an Site for a specific domain name
	public static function GetByDomain($domain){
		
		Connect::init();
		
		$domain = mysql_real_escape_string($domain); // clean data
		
		$result = mysql_query("SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
							AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE Domain='$domain'");
		
		if(!$result) {
		  return null;
		}

		if(mysql_num_rows($result) == 0) 
		{
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$siteId = $row["SiteId"];
			$siteUniqId = $row["SiteUniqId"];
			$friendlyId = $row["FriendlyId"];
			$domain = $row["Domain"];
			$name = $row["Name"];
			$logoUrl = $row["LogoUrl"];
			$template = $row["Template"];
			$analyticsId = $row["AnalyticsId"];
			$facebookAppId = $row["FacebookAppId"];
			$primaryEmail = $row["PrimaryEmail"];
			$timeZone = $row["TimeZone"];
			$lastLogin = $row["LastLogin"];
			$created = $row["Created"];
			
			return new Site($siteId, $siteUniqId, $friendlyId, $domain, $name, $logoUrl, $template,
				$analyticsId, $facebookAppId, $primaryEmail,
				$timeZone, $lastLogin, $created);
		}
	}
	
	// Gets an Site for a given friendlyId
	public static function GetByFriendlyId($friendlyId){
		
		Connect::init();
		
		settype($siteId, 'integer');
		
		$result = mysql_query("SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template, 
							AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE FriendlyId='$friendlyId'");
		
		if(!$result) {
		  return null;
		}

		if(mysql_num_rows($result) == 0) {
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$siteId = $row["SiteId"];
			$siteUniqId = $row["SiteUniqId"];
			$friendlyId = $row["FriendlyId"];
			$domain = $row["Domain"];
			$name = $row["Name"];
			$logoUrl = $row["LogoUrl"];
			$template = $row["Template"];
			$analyticsId = $row["AnalyticsId"];
			$facebookAppId = $row["FacebookAppId"];
			$primaryEmail = $row["PrimaryEmail"];
			$timeZone = $row["TimeZone"];
			$lastLogin = $row["LastLogin"];
			$created = $row["Created"];
			
			return new Site($siteId, $siteUniqId, $friendlyId, $domain, $name, $logoUrl, $template,
				$analyticsId, $facebookAppId, $primaryEmail,
				$timeZone, $lastLogin, $created);
		}
	}
	
	// Gets an Site for a given siteUniqId
	public static function GetBySiteUniqId($siteUniqId){
		
		Connect::init();
		
		settype($siteId, 'integer');
		
		$result = mysql_query("SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
							AnalyticsId, FacebookAppId,  PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE SiteUniqId='$siteUniqId'");
		
		if(!$result) {
		  print "Could not successfully run query Site->GetBySiteId: " . mysql_error() . "<br>";
		  exit;
		}

		if(mysql_num_rows($result) == 0) 
		{
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$siteId = $row["SiteId"];
			$siteUniqId = $row["SiteUniqId"];
			$friendlyId = $row["FriendlyId"];
			$domain = $row["Domain"];
			$name = $row["Name"];
			$logoUrl = $row["LogoUrl"];
			$template = $row["Template"];
			$analyticsId = $row["AnalyticsId"];
			$facebookAppId = $row["FacebookAppId"];
			$primaryEmail = $row["PrimaryEmail"];
			$timeZone = $row["TimeZone"];
			$lastLogin = $row["LastLogin"];
			$created = $row["Created"];
			
			return new Site($siteId, $siteUniqId, $friendlyId, $domain, $name, $logoUrl, $template,
				$analyticsId, $facebookAppId, $primaryEmail,
				$timeZone, $lastLogin, $created);
		}
	}
	
	// Gets an Site for a given SiteId
	public static function GetBySiteId($siteId){
		
		Connect::init();
		
		settype($siteId, 'integer');
		
		$result = mysql_query("SELECT SiteId, SiteUniqId, FriendlyId, Domain, Name, LogoUrl, Template,
							AnalyticsId, FacebookAppId, PrimaryEmail,
							TimeZone, LastLogin, Created
							FROM Sites WHERE SiteId=$siteId");
		
		if(!$result) {
		  print "Could not successfully run query Site->GetBySiteId: " . mysql_error() . "<br>";
		  exit;
		}

		if(mysql_num_rows($result) == 0) 
		{
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$siteId = $row["SiteId"];
			$siteUniqId = $row["SiteUniqId"];
			$friendlyId = $row["FriendlyId"];
			$domain = $row["Domain"];
			$name = $row["Name"];
			$logoUrl = $row["LogoUrl"];
			$template = $row["Template"];
			$analyticsId = $row["AnalyticsId"];
			$facebookAppId = $row["FacebookAppId"];
			$primaryEmail = $row["PrimaryEmail"];
			$timeZone = $row["TimeZone"];
			$lastLogin = $row["LastLogin"];
			$created = $row["Created"];
			
			return new Site($siteId, $siteUniqId, $friendlyId, $domain, $name, $logoUrl, $template,
				$analyticsId, $facebookAppId, $primaryEmail,
				$timeZone, $lastLogin, $created);
		}
	}
	
}

?>