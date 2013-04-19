<?php

// Product model
class Product{
	
	public $ProductId;
	public $ProductUniqId;
	public $SKU;
	public $Name;
	public $Price;
	public $PageUniqId;
	public $Created;
	public $CreatedBy;
	public $LastModifiedDate;
	public $LastModifiedBy;
	
	function __construct($productId, $productUniqId, $sku, $name, $price, $pageUniqId, $created, $createdBy, $lastModifiedDate, $lastModifiedBy){
		$this->ProductId = $productId;
		$this->ProductUniqId = $productUniqId;
		$this->SKU = $sku;
		$this->Name = $name;
		$this->Price = $price;
		$this->PageUniqId = $pageUniqId;
		$this->Created = $created;
		$this->CreatedBy = $createdBy;
		$this->LastModifiedDate = $lastModifiedDate;
		$this->LastModifiedBy = $lastModifiedBy;
	}
	
	// Adds a product
	public static function Add($sku, $name, $price, $pageUniqId, $createdBy){
		
		Connect::init();
		
		$productUniqId = uniqid();
		
		$sku = mysql_real_escape_string($sku);
		$name = mysql_real_escape_string($name);
		$price = mysql_real_escape_string($price);
		$pageUniqId = mysql_real_escape_string($pageUniqId);
		settype($createdBy, 'integer');
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
	
		// a bit hacky, but need to ensure that begindate and enddate are null
		$q = "INSERT INTO Products (ProductUniqId, SKU, Name, Price, PageUniqId, Created, CreatedBy, LastModifiedDate, LastModifiedBy) 
			VALUES ('$productUniqId', '$sku', '$name', $price, '$pageUniqId', '$timestamp', $createdBy, '$timestamp', $createdBy)";
	
	
		$result = mysql_query($q);
	
		if(!$result) {
		  die("Could not successfully run query Product->Add, error=".mysql_error());
		  exit;
		}
		
		return new Product(mysql_insert_id(), $productUniqId, $sku, $name, $price, $pageUniqId, $timestamp, $createdBy, $timestamp, $createdBy); 
	}
	
	// Edits a product
	public function Edit($sku, $name, $price, $lastModifiedBy){
		
		Connect::init();
		
		$sku = mysql_real_escape_string($sku);
		$name = mysql_real_escape_string($name);
		$price = mysql_real_escape_string($price);
		settype($quantity, 'float');
		settype($lastModifiedBy, 'float');
		
		$timestamp = gmdate("Y-m-d H:i:s", time());
		
		$query = "UPDATE Products 
					SET SKU = '$sku', 
					Name = '$name', 
					Price = $price,
					LastModifiedDate = '$timestamp',
					LastModifiedBy = $lastModifiedBy
					WHERE ProductId = $this->ProductId";
		
		$result = mysql_query($query);
		
		if(!$result) {
		  die("Could not successfully run query Product->Edit, error=".mysql_error());
		  exit;
		}
		
		$this->SKU = $sku;
		$this->Name = $name;
		$this->Price = $price;
		$this->LastModifiedDate = $lastModifiedDate;
		$this->LastModifiedBy = $lastModifiedBy;
		
		return;	
	}
	
	// Deletes a product
	public static function Delete($productUniqId){
		
		Connect::init();
	
		$delete = mysql_query("DELETE FROM Products WHERE ProductUniqId='$productUniqId'");
	
		return;
	}
	
	// Gets products by $pageUniqId
	public static function GetProductsByPageUniqId($pageUniqId){
		
		Connect::init();
		
		// Pulls in the Name of the User too
		$result = mysql_query("SELECT Products.ProductId, Products.ProductUniqId, 
			Products.SKU, Products.Name, Products.Price, Products.PageUniqId, 
			Products.Created, Products.CreatedBy, Products.LastModifiedDate, Products.LastModifiedBy
			FROM Products
			WHERE Products.PageUniqId = '$pageUniqId'
			ORDER BY Products.Price ASC");

		if(!$result) {
		  die("Could not successfully run query Product->GetProductsByPageUniqId" . mysql_error() . "<br>");
		  exit;
		}
		
		return $result;
	}
	
	// Gets a product for a specific $productUniqId
	public static function GetByProductUniqId($productUniqId){
		
		Connect::init();
		
		$result = mysql_query("SELECT Products.ProductId, Products.ProductUniqId, 
			Products.SKU, Products.Name, Products.Price, Products.PageUniqId, 
			Products.Created, Products.CreatedBy, Products.LastModifiedDate, Products.LastModifiedBy
		 	FROM Products WHERE ProductUniqId='$productUniqId'");
			
		if(!$result) 
		{
		  return null;
		}
		
		if(mysql_num_rows($result) == 0) 
		{
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
		
			$productId = $row["ProductId"];
			$productUniqId = $row["ProductUniqId"];
			$sku = $row["SKU"];
			$name = $row["Name"];
			$price = $row["Price"];
			$pageUniqId = $row["PageUniqId"];
			$created = $row["Created"];
			$createdBy = $row["CreatedBy"];
			$lastModifiedDate = $row["LastModifiedDate"];
			$lastModifiedBy = $row["LastModifiedBy"];
				
			return new Product($productId, $productUniqId, $sku, $name, $price, $pageUniqId, $created, $createdBy, $lastModifiedDate, $lastModifiedBy);  
		}
	}
	
	// Gets a product for a specific $productId
	public static function GetByProductId($productId){
		
		Connect::init();
		
		$result = mysql_query("SELECT Products.ProductId, Products.ProductUniqId, 
			Products.SKU, Products.Name, Products.Price, Products.PageUniqId, Products.Created
		 	FROM Products WHERE ProductId=$productId");
			
		if(!$result) 
		{
		  return null;
		}
		
		if(mysql_num_rows($result) == 0) 
		{
		    return null;
		}
		else{
			$row = mysql_fetch_assoc($result);
		
			$productId = $row["ProductId"];
			$productUniqId = $row["ProductUniqId"];
			$sku = $row["SKU"];
			$name = $row["Name"];
			$price = $row["Price"];
			$pageUniqId = $row["PageUniqId"];
			$created = $row["Created"];
			$createdBy = $row["CreatedBy"];
			$lastModifiedDate = $row["LastModifiedDate"];
			$lastModifiedBy = $row["LastModifiedBy"];
				
			return new Product($productId, $productUniqId, $sku, $name, $price, $pageUniqId, $created, $createdBy, $lastModifiedDate, $lastModifiedBy);  
		}
	}
	
}

?>