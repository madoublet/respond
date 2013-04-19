<?php

// MenuType model
class MenuType{
	
	public $MenuTypeId;
	public $MenuTypeUniqId;
	public $FriendlyId;
	public $Name;
	public $SiteId;
	public $CreatedBy;
	public $LastModifiedBy;
	public $LastModifiedDate;
	public $Created;
	
	function __construct($menuTypeId, $menuTypeUniqId, $friendlyId, $name, 
		$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created){
		$this->MenuTypeId = $menuTypeId;
		$this->MenuTypeUniqId = $menuTypeUniqId;
		$this->FriendlyId = $friendlyId;
		$this->Name = $name;
		$this->SiteId = $siteId;
		$this->CreatedBy = $createdBy;
		$this->Created = $created;
		$this->LastModifiedBy = $lastModifiedBy;
		$this->lastModifiedDate = $lastModifiedDate;
	}
    
    // creates an associative array from the public params
    public function ToAssocArray(){
		$arr = array();

		foreach($this as $var=>$value){
			$arr[$var] = $value;
		}

		return $arr;
	}
	
	// Determines whether a FriendlyId is unique
	public static function IsFriendlyIdUnique($friendlyId, $siteId){

		Connect::init();
		
		$friendlyId = mysql_real_escape_string($friendlyId); // clean data
		settype($siteId, 'integer');
		
		$count=0;
	
		// Pulls in the Name of the User too
		$result = mysql_query("SELECT Count(*) as Count
			FROM MenuTypes where FriendlyId='$friendlyId' AND SiteId=$siteId");
			
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
	
	// Adds a menuType
	public static function Add($friendlyId, $name, $siteId, $createdBy, $lastModifiedBy){
		
		Connect::init();
		
		$menuTypeUniqId = uniqid();
		
		// cleanup friendlyid (escape, trim, remove spaces, tolower)
		$friendlyId = mysql_real_escape_string($friendlyId);
		$friendlyId = trim($friendlyId);
		$friendlyId = str_replace(' ', '', $friendlyId);
		$friendlyId = strtolower($friendlyId);
		
		$name = mysql_real_escape_string($name);
		settype($siteId, 'integer');
		settype($createdBy, 'integer');
		settype($lastModifiedBy, 'integer');
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$result = mysql_query(
			"INSERT INTO MenuTypes (MenuTypeUniqId, FriendlyId, Name,
				SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
			 VALUES ('$menuTypeUniqId', '$friendlyId', '$name',
				$siteId, $createdBy, $lastModifiedBy, '$timestamp', '$timestamp')");
	
		if(!$result) {
		  print "Could not successfully run query MenuType->Add" . mysql_error() . "<br>";
		  exit;
		}
		
		return new MenuType(mysql_insert_id(), $menuTypeUniqId, $friendlyId, $name,
				$siteId, $createdBy, $lastModifiedBy, $timestamp, $timestamp);
	}
	
	// Edits a menuType
	public function Edit($friendlyId, $name, $lastModifiedBy){
		
		Connect::init();
		
		$name = mysql_real_escape_string($name); // clean data
		
		// cleanup friendlyid (escape, trim, remove spaces, tolower)
		$friendlyId = mysql_real_escape_string($friendlyId);
		$friendlyId = trim($friendlyId);
		$friendlyId = str_replace(' ', '', $friendlyId);
		$friendlyId = strtolower($friendlyId);
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$query = "UPDATE MenuTypes SET FriendlyId = '$friendlyId', Name = '$name',
				LastModifiedBy = $lastModifiedBy, LastModifiedDate='$timestamp' WHERE MenuTypeId = $this->MenuTypeId";
		
		mysql_query($query);
		
		return;	
	}
	
	// Deletes a menuType
	public static function Delete($menuTypeUniqId){
		
		Connect::init();
		
		$delete = mysql_query("DELETE FROM MenuTypes WHERE MenuTypeUniqId='$menuTypeUniqId'");
	
		return;
	}
	
	// Gets all MenuTypes for a given site
	public static function GetMenuTypes($siteId){
		
		Connect::init();

		$result = mysql_query("SELECT  MenuTypeId, MenuTypeUniqId, FriendlyId, Name,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
			FROM MenuTypes
			WHERE MenuTypes.SiteId = $siteId
			ORDER BY MenuTypes.Created ASC");

		if(!$result) {
		  die("Could not successfully run query Page->GetPages" . mysql_error() . "<br>");
		  exit;
		}
		
		return $result;
	}
	
	
	// Gets a menuType for a specific friendlyId
	public static function GetByFriendlyId($friendlyId, $siteId){
		
		Connect::init();
		
		$result = mysql_query("SELECT MenuTypeId, MenuTypeUniqId, FriendlyId, Name,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM MenuTypes WHERE FriendlyId='$friendlyId' && SiteId=$siteId");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$menuTypeId = $row["MenuTypeId"];
			$menuTypeUniqId = $row["MenuTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$name = $row["Name"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new MenuType($menuTypeId, $menuTypeUniqId, $friendlyId, $name,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
	// Gets a menuType for a specific MenuTypeUniqId
	public static function GetByMenuTypeUniqId($menuTypeUniqId){
		
		Connect::init();
		
		$result = mysql_query("SELECT MenuTypeId, MenuTypeUniqId, FriendlyId, Name,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM MenuTypes WHERE MenuTypeUniqId='$menuTypeUniqId'");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$menuTypeId = $row["MenuTypeId"];
			$menuTypeUniqId = $row["MenuTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$name = $row["Name"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new MenuType($menuTypeId, $menuTypeUniqId, $friendlyId, $name,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
	// Gets a menuType for a specific MenuTypeId
	public static function GetByMenuTypeId($menuTypeId){
		
		Connect::init();
		
		$result = mysql_query("SELECT MenuTypeId, MenuTypeUniqId, FriendlyId, Name,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM MenuTypes WHERE MenuTypeId=$menuTypeId");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$menuTypeId = $row["MenuTypeId"];
			$menuTypeUniqId = $row["MenuTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$name = $row["Name"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new MenuType($menuTypeId, $menuTypeUniqId, $friendlyId, $name,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
}

?>