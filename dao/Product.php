<?php

// Product model
class Product{
	
	// adds a pageType
    public static function Add($sku, $description, $price, $currency, $quantity, $shippingType, $shippingRate, $downloadUrl, $createdBy){
		   
        try{
            
            $db = DB::get();
        	
    		$productUniqId = uniqid();
            
    		$timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		// a bit hacky, but need to ensure that begindate and enddate are null
    		$q = "INSERT INTO Products (ProductUniqId, SKU, Description, Price, Currency, Quantity, ShippingType, ShippingRate, DownloadUrl, CreatedBy, LastModifiedBy, LastModifiedDate, Created) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    	
    	
            $s = $db->prepare($q);
            $s->bindParam(1, $productUniqId);
            $s->bindParam(2, $sku);
            $s->bindParam(3, $description);
            $s->bindParam(4, $price);
            $s->bindParam(5, $currency);
            $s->bindParam(6, $quantity);
            $s->bindParam(7, $shippingType);
            $s->bindParam(8, $shippingRate);
            $s->bindParam(9, $downloadUrl);
            $s->bindParam(10, $createdBy);
            $s->bindParam(11, $createdBy);
            $s->bindParam(12, $timestamp);
            $s->bindParam(13, $timestamp);
            
            $s->execute();
            
            return array(
                'ProductId' => $db->lastInsertId(),
                'ProductUniqId' => $productUniqId,
                'SKU' => $sku,
                'Description' => $description,
                'Price' => $price,
                'Currency' => $currency,
                'Quantity' => $quantity,
                'ShippingType' => $shippingType,
                'ShippingRate' => $shippingRate,
                'DownloadUrl' => $downloadUrl,
                'CreatedBy' => $createdBy,
                'LastModifiedBy' => $$createdBy,
                'Created' => $timestamp,
                'LastModifiedDate' => $timestamp
                );
                
        } catch(PDOException $e){
            die('[Product::Add] PDO Error: '.$e->getMessage());
        }
	}
    	
	// edits a product
	public static function Edit($productUniqId, $sku, $description, $price, $currency, $quantity, $shippingType, $shippingRate, $lastModifiedBy){
        
        try{
            
            $db = DB::get();
            
            $timestamp = gmdate("Y-m-d H:i:s", time());
            
            $q = "UPDATE Products SET SKU = ?, Description = ?, Price = ?, Currency = ?, Quantity = ?, ShippingType = ?, ShippingRate = ?, LastModifiedBy = ?, LastModifiedDate= ? WHERE ProductUnqiId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $sku);
            $s->bindParam(2, $description);
            $s->bindParam(3, $price);
            $s->bindParam(4, $currency);
            $s->bindParam(5, $quantity);
            $s->bindParam(6, $shippingType);
            $s->bindParam(7, $shippingRate);
            $s->bindParam(8, $lastModifiedBy);
            $s->bindParam(9, $timestamp);
            $s->bindParam(10, $$productUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Product::Edit] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// deletes a product
	public static function Delete($productUniqId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Products WHERE ProductUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $productUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Product::Delete] PDO Error: '.$e->getMessage());
        }
        
	}

	// gets all products for a given site
	public static function GetProducts($siteId){

        try{

            $db = DB::get();
            
            $q = "SELECT ProductUniqId, SKU, Description, Price, Currency, Quantity, ShippingType, ShippingRate, DownloadUrl, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        			FROM Products
        			WHERE Products.SiteId = ?";
 
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
    
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Product::GetProducts] PDO Error: '.$e->getMessage().'trace='.$e->getTraceAsString());
        } 
        
	}
		
	// Gets a product by ProductUniqId
	public static function GetByProductUniqId($productUniqId){
		
        try{
        
            $db = DB::get();
            
            $q = "SELECT ProductUniqId, SKU, Description, Price, Currency, Quantity, ShippingType, ShippingRate, DownloadUrl, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        		 	FROM Products WHERE ProductUniqId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $productUniqId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Product::GetByProductUniqId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a product for a specific ProductId
	public static function GetByProductId($productId){

        try{
        
            $db = DB::get();
            
            $q = "SELECT ProductUniqId, SKU, Description, Price, Currency, Quantity, ShippingType, ShippingRate,DownloadUrl, CreatedBy, LastModifiedBy, LastModifiedDate, Created
        		 	FROM Products WHERE ProductId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $productId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Product::GetByProductId] PDO Error: '.$e->getMessage());
        }
        
	}
	
}

?>