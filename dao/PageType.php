<?php

// PageType model
class PageType{
	
	public $PageTypeId;
	public $PageTypeUniqId;
	public $FriendlyId;
	public $TypeS;
	public $TypeP;
	public $SiteId;
	public $CreatedBy;
	public $LastModifiedBy;
	public $LastModifiedDate;
	public $Created;
	
	function __construct($pageTypeId, $pageTypeUniqId, $friendlyId, $typeS, $typeP, 
		$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created){
		$this->PageTypeId = $pageTypeId;
		$this->PageTypeUniqId = $pageTypeUniqId;
		$this->FriendlyId = $friendlyId;
		$this->TypeS = $typeS;
		$this->TypeP = $typeP;
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
			FROM PageTypes where FriendlyId='$friendlyId' AND SiteId=$siteId");
			
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
	
	// Gets the Page Type Id
	public static function GetPageTypeIdForPage($siteId){

		Connect::init();
	
		// Pulls in the Name of the User too
		$result = mysql_query("SELECT PageTypeId
			FROM PageTypes where FriendlyId='page' AND SiteId=$siteId");
			
		if(mysql_num_rows($result) == 0){
		    return -1;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$pageTypeId = $row["PageTypeId"];
		}
	
		return $pageTypeId;
	}
	
	// Adds a pageType
	public static function Add($friendlyId, $typeS, $typeP, $siteId, $createdBy, $lastModifiedBy){
		
		Connect::init();
		
		$pageTypeUniqId = uniqid();
		
		// cleanup friendlyid (escape, trim, remove spaces, tolower)
		$friendlyId = mysql_real_escape_string($friendlyId);
		$friendlyId = trim($friendlyId);
		$friendlyId = str_replace(' ', '', $friendlyId);
		$friendlyId = strtolower($friendlyId);
		
		$typeS = mysql_real_escape_string($typeS);
		$typeP = mysql_real_escape_string($typeP);
		settype($siteId, 'integer');
		settype($createdBy, 'integer');
		settype($lastModifiedBy, 'integer');
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$result = mysql_query(
			"INSERT INTO PageTypes (PageTypeUniqId, FriendlyId, TypeS, TypeP,
				SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
			 VALUES ('$pageTypeUniqId', '$friendlyId', '$typeS', '$typeP',
				$siteId, $createdBy, $lastModifiedBy, '$timestamp', '$timestamp')");
	
		if(!$result) {
		  print "Could not successfully run query PageType->Add" . mysql_error() . "<br>";
		  exit;
		}
		
		return new PageType(mysql_insert_id(), $pageTypeUniqId, $friendlyId, $typeS, $typeP,
				$siteId, $createdBy, $lastModifiedBy, $timestamp, $timestamp);
	}
	
	// Edits a pageType
	public function Edit($friendlyId, $typeS, $typeP, $lastModifiedBy){
		
		Connect::init();
		
		$typeP = mysql_real_escape_string($typeP);
		$typeS = mysql_real_escape_string($typeS);
		$metaName = mysql_real_escape_string($metaName);
		
		// cleanup friendlyid (escape, trim, remove spaces, tolower)
		$friendlyId = mysql_real_escape_string($friendlyId);
		$friendlyId = trim($friendlyId);
		$friendlyId = str_replace(' ', '', $friendlyId);
		$friendlyId = strtolower($friendlyId);
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$query = "UPDATE PageTypes SET FriendlyId = '$friendlyId', TypeS = '$typeS', TypeP = '$typeP',
				LastModifiedBy = $lastModifiedBy, LastModifiedDate='$timestamp' WHERE PageTypeId = $this->PageTypeId";
		
		mysql_query($query);
		
		return;	
	}
	
	// Deletes a pageType
	public static function Delete($pageTypeUniqId){
		
		Connect::init();
	
		$delete = mysql_query("DELETE FROM PageTypes WHERE PageTypeUniqId='$pageTypeUniqId'");
	
		return;
	}
	
	// Gets all PageTypes for a given site
	public static function GetArrayOfFriendlyIds($siteId){
		
		Connect::init();

		$result = mysql_query("SELECT FriendlyId
			FROM PageTypes
			WHERE PageTypes.SiteId = $siteId");

		if(!$result){
		  return null;
		}
		else{
			$len = mysql_num_rows($result);
			
			$arr = array();
			$x = 0;
			
			while($row = mysql_fetch_array($result)){ 
				$arr[$x] = $row['FriendlyId'];
				$x++;
			}
			
			return $arr;
		}
	}
	
	// Gets an array of TypeP
	public static function GetArrayOfTypeP($siteId){
		
		Connect::init();

		$result = mysql_query("SELECT TypeP
			FROM PageTypes
			WHERE PageTypes.SiteId = $siteId");

		if(!$result){
		  return null;
		}
		else{
			$len = mysql_num_rows($result);
			
			$arr = array();
			$x = 0;
			
			while($row = mysql_fetch_array($result)){ 
				$arr[$x] = strtolower($row['TypeP']);
				$x++;
			}
			
			return $arr;
		}
	}
	
	// Gets all PageTypes for a given site
	public static function GetPageTypes($siteId){
		
		Connect::init();

		$result = mysql_query("SELECT  PageTypeId, PageTypeUniqId, FriendlyId,
			TypeS, TypeP,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
			FROM PageTypes
			WHERE PageTypes.SiteId = $siteId
			ORDER BY PageTypes.Created ASC");

		if(!$result) {
		  die("Could not successfully run query Page->GetPages" . mysql_error() . "<br>");
		  exit;
		}
		
		return $result;
	}
	
	// Gets the default pagetype (for site)
	public static function GetDefaultPageType($siteId){
		
		Connect::init();
		
		$result = mysql_query("SELECT PageTypeId, PageTypeUniqId, FriendlyId,
			TypeS, TypeP,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM PageTypes WHERE PageTypes.SiteId = $siteId ORDER BY Created limit 1");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$pageTypeId = $row["PageTypeId"];
			$pageTypeUniqId = $row["PageTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$typeS = $row["TypeS"];
			$typeP = $row["TypeP"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new PageType($pageTypeId, $pageTypeUniqId, $friendlyId, $typeS, $typeP,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
	// Gets a pageType for a specific friendlyId
	public static function GetByFriendlyId($friendlyId, $siteId){
		
		Connect::init();
		
		$result = mysql_query("SELECT PageTypeId, PageTypeUniqId, FriendlyId,
			TypeS, TypeP,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM PageTypes WHERE FriendlyId='$friendlyId' && SiteId=$siteId");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$pageTypeId = $row["PageTypeId"];
			$pageTypeUniqId = $row["PageTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$typeS = $row["TypeS"];
			$typeP = $row["TypeP"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new PageType($pageTypeId, $pageTypeUniqId, $friendlyId, $typeS, $typeP,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
	// Gets a pageType for a specific PageTypeUniqId
	public static function GetByPageTypeUniqId($pageTypeUniqId){
		
		Connect::init();
		
		$result = mysql_query("SELECT PageTypeId, PageTypeUniqId, FriendlyId,
			TypeS, TypeP,
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM PageTypes WHERE PageTypeUniqId='$pageTypeUniqId'");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$pageTypeId = $row["PageTypeId"];
			$pageTypeUniqId = $row["PageTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$typeS = $row["TypeS"];
			$typeP = $row["TypeP"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new PageType($pageTypeId, $pageTypeUniqId, $friendlyId, $typeS, $typeP,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
	// Gets a pageType for a specific PageTypeId
	public static function GetByPageTypeId($pageTypeId){
		
		Connect::init();
		
		$result = mysql_query("SELECT PageTypeId, PageTypeUniqId, FriendlyId,
			TypeS, TypeP, 
			SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM PageTypes WHERE PageTypeId=$pageTypeId");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$pageTypeId = $row["PageTypeId"];
			$pageTypeUniqId = $row["PageTypeUniqId"];
			$friendlyId = $row["FriendlyId"];
			$typeS = $row["TypeS"];
			$typeP = $row["TypeP"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new PageType($pageTypeId, $pageTypeUniqId, $friendlyId, $typeS, $typeP,
				$siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
}

?>