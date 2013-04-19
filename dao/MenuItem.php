<?php

// MenuItem model
class MenuItem{
	
	public $MenuItemId;
	public $MenuItemUniqId;
	public $Name;
	public $CssClass;
	public $Type;
	public $Url;
	public $PageId;
	public $Priority;
	public $SiteId;
	public $CreatedBy;
	public $LastModifiedBy;
	public $LastModifiedDate;
	public $Created;
	
	function __construct($menuItemId, $menuItemUniqId, $name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created){
		$this->MenuItemId = $menuItemId;
		$this->MenuItemUniqId = $menuItemUniqId;
		$this->Name = $name;
		$this->CssClass = $cssClass;
		$this->Type = $type;
		$this->Url = $url;
		$this->PageId = $pageId;
		$this->Priority = $priority;
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
	
	// Adds a menuItem
	public static function Add($name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy){
		
		Connect::init();
		
		$menuItemUniqId = uniqid();
		
		$name = mysql_real_escape_string($name);
		$cssClass = mysql_real_escape_string($cssClass);
		$type = mysql_real_escape_string($type);
		$url = mysql_real_escape_string($url);
		$pageId = mysql_real_escape_string($pageId);
		settype($siteId, 'integer');
		settype($createdBy, 'integer');
		settype($lastModifiedBy, 'integer');
		settype($priority, 'integer');
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$result = mysql_query(
			"INSERT INTO MenuItems (MenuItemUniqId, Name, CssClass, Type, Url, PageId, Priority, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
			 VALUES ('$menuItemUniqId', '$name', '$cssClass', '$type', '$url', '$pageId', $priority, $siteId, $createdBy, $lastModifiedBy, '$timestamp', '$timestamp')");
	
		if(!$result) {
		  print "Could not successfully run query MenuItem->Add" . mysql_error() . "<br>";
		  exit;
		}
		
		return new MenuItem(mysql_insert_id(), $menuItemUniqId, $name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy, $timestamp, $timestamp);
	}
	
	// updates the name, cssClass, and url
	public static function Update($menuItemUniqId, $name, $cssClass, $url){
		
		Connect::init();
		
        $menuItemUniqId = mysql_real_escape_string($menuItemUniqId);
    	$name = mysql_real_escape_string($name);
    	$cssClass = mysql_real_escape_string($cssClass);
		$url = mysql_real_escape_string($url);
		settype($pageId, 'integer');
		
		$result = mysql_query(
			"UPDATE MenuItems SET Name = '$name', CssClass = '$cssClass', Url = '$url' WHERE MenuItemUniqId = '$menuItemUniqId'");
	
		if(!$result) {
		  print "Could not successfully run query MenuItem::Update" . mysql_error() . "<br>";
		  exit;
		}
		
		return;
	}
    
    // updates the name, cssClass, and url
    public static function UpdateOrder($menuItemUniqId, $order){
		
		Connect::init();
		
    	$menuItemUniqId = mysql_real_escape_string($menuItemUniqId);
		settype($order, 'integer');
		
		$result = mysql_query(
			"UPDATE MenuItems SET Priority = $order WHERE MenuItemUniqId = '$menuItemUniqId'");
	
		if(!$result) {
		  print "Could not successfully run query MenuItem::UpdatePriority" . mysql_error() . "<br>";
		  exit;
		}
		
		return;
	}
	
	// Deletes all menuItems for an site
	public static function Remove($menuItemUniqId){
		
		Connect::init();
		
		$menuItemUniqId = mysql_real_escape_string($menuItemUniqId);
	
		$delete = mysql_query("DELETE FROM MenuItems WHERE MenuItemUniqId='$menuItemUniqId'");
	
		return;
	}
	
	// Gets all menuItems (and meta data) for a given site
	public static function GetMenuItems($siteId){
		
		Connect::init();

		$result = mysql_query("SELECT MenuItems.MenuItemId, MenuItems.MenuItemUniqId, MenuItems.Name, MenuItems.CssClass,
			MenuItems.Type,
			MenuItems.Url, MenuItems.PageId, MenuItems.Priority,
			MenuItems.SiteId, MenuItems.CreatedBy, 
			MenuItems.LastModifiedBy, MenuItems.LastModifiedDate, MenuItems.Created
			FROM MenuItems
			WHERE MenuItems.SiteId = $siteId
			ORDER BY MenuItems.Priority");

		if(!$result) {
		  die("Could not successfully run query MenuItem->GetMenuItems" . mysql_error() . "<br>");
		  exit;
		}
		
		return $result;
	}

	// Gets all menuItems (and meta data) for a given site and type
	public static function GetMenuItemsForType($siteId, $type){
		
		Connect::init();

		$result = mysql_query("SELECT MenuItems.MenuItemId, MenuItems.MenuItemUniqId, MenuItems.Name, MenuItems.CssClass,
			MenuItems.Type,
			MenuItems.Url, MenuItems.PageId, MenuItems.Priority,
			MenuItems.SiteId, MenuItems.CreatedBy, 
			MenuItems.LastModifiedBy, MenuItems.LastModifiedDate, MenuItems.Created
			FROM MenuItems
			WHERE MenuItems.SiteId = $siteId AND MenuItems.Type = '$type'
			ORDER BY MenuItems.Priority");

		if(!$result) {
		  die("Could not successfully run query MenuItem->GetMenuItems" . mysql_error() . "<br>");
		  exit;
		}
		
		return $result;
	}
	
	// Gets all menuItems for a given site
	public static function GetMenuItemsCount($siteId){
		
		Connect::init();
		
		$count=0;
	
		// Pulls in the Name of the User too
		$result = mysql_query("SELECT Count(*) as Count
			FROM MenuItems
			WHERE SiteId = $siteId");
			
		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			$count = $row["Count"];
		}
		
		return $count;
	}
	
	// Gets a menuItem for a specific FriendlyId, SiteId
	public static function GetByFriendlyId($friendlyId, $siteId){
		
		Connect::init();
		
		$result = mysql_query("SELECT MenuItemId, MenuItemUniqId, Name, CssClass, Type,
			Url, PageId, Priority, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM MenuItems WHERE FriendlyId='$friendlyId' AND SiteId=$siteId");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$menuItemId = $row["MenuItemId"];
			$menuItemUniqId = $row["MenuItemUniqId"];
			$name = $row["Name"];
			$cssClass = $row["CssClass"];
			$type = $row["Type"];
			$url = $row["Url"];
			$pageId = $row["PageId"];
			$priority = $row["Priority"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new MenuItem($menuItemId, $menuItemUniqId, $name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy, $lastModified, $created);
		}
	}
	
	// Gets a menuItem for a specific MenuItemUniqId
	public static function GetByMenuItemUniqId($menuItemUniqId){
		
		Connect::init();
		
		$result = mysql_query("SELECT MenuItemId, MenuItemUniqId, Name, CssClass, Type,
			Url, PageId, Priority, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM MenuItems WHERE MenuItemUniqId='$menuItemUniqId'");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$menuItemId = $row["MenuItemId"];
			$menuItemUniqId = $row["MenuItemUniqId"];
			$name = $row["Name"];
			$cssClass = $row["CssClass"];
			$type = $row["Type"];
			$url = $row["Url"];
			$pageId = $row["PageId"];
			$priority = $row["Priority"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new MenuItem($menuItemId, $menuItemUniqId, $name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
	// Gets a menuItem for a specific MenuItemId
	public static function GetByMenuItemId($menuItemId){
		
		Connect::init();
		
		$result = mysql_query("SELECT MenuItemId, MenuItemUniqId, Name, CssClass, Type,
			Url, PageId, Priority, SiteId, CreatedBy, LastModifiedBy, LastModifiedDate, Created
		 	FROM MenuItems WHERE MenuItemId=$menuItemId");
			
		if(!$result){
		  return null;
		}

		if(mysql_num_rows($result) == 0){
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
			
			$menuItemId = $row["MenuItemId"];
			$menuItemUniqId = $row["MenuItemUniqId"];
			$name = $row["Name"];
			$cssClass = $row["CssClass"];
			$type = $row["Type"];
			$url = $row["Url"];
			$pageId = $row["PageId"];
			$priority = $row["Priority"];
			$siteId = $row["SiteId"];
			$createdBy= $row["CreatedBy"];
			$lastModifiedBy= $row["LastModifiedBy"];
			$lastModifiedDate= $row["LastModifiedDate"];
			$created = $row["Created"];
			
			return new MenuItem($menuItemId, $menuItemUniqId, $name, $cssClass, $type, $url, $pageId, $priority, $siteId, $createdBy, $lastModifiedBy, $lastModifiedDate, $created);
		}
	}
	
}

?>