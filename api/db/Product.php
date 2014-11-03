<?php

// Products DAO
class Product{
    
	// adds a version
	public static function Add($productId, $sku, $pageId, $name, $price, $shipping, $weight, $download){
		
        try{
            
            $db = DB::get();
    		
    		// set timestamp
    		$created = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO Products (ProductId, SKU, PageId, Name, Price, Shipping, Weight, Download, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $productId);
            $s->bindParam(2, $sku);
            $s->bindParam(3, $pageId);
            $s->bindParam(4, $name);
            $s->bindParam(5, $price);
            $s->bindParam(6, $shipping);
            $s->bindParam(7, $weight);
            $s->bindParam(8, $download);
            $s->bindParam(9, $created);
            
            $s->execute();
            
          
            
            return array(
                'ProductId' => $productId,
                'SKU' => $sku,
                'PageId' => $pageId,
                'Name' => $name,
                'Price' => $price,
                'Shipping' => $shipping,
                'Weight' => $weight,
                'Download' => $download,
                'Created' => $created
                );
                
        } catch(PDOException $e){
            die('[Product::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// removes products for a page
	public static function RemoveForPage($pageId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Products WHERE PageId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $pageId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Product::RemoveForPage] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets all products for a page
	public static function GetProducts($pageId){
		
        try{

            $db = DB::get();
            
            $q = "SELECT ProductId, SKU, PageId, Name, Price, Shipping, Weight, Download, Created
        			FROM Products		
        			WHERE PageId = ? ORDER BY Created DESC";
        			
        	
            $s = $db->prepare($q);
            $s->bindParam(1, $pageId);
            
            $s->execute();
            
            $arr = array();
            
            while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Product::GetProducts] PDO Error: '.$e->getMessage());
        }
        
	}
	
	
	// gets a version for a specific $productId
	public static function GetByProductId($productId){
	
        try{
        
            $db = DB::get();
            
            $q = "SELECT ProductId, SKU, PageId, Name, Price, Shipping, Weight, Download, Created
            		FROM Products
        		 	WHERE ProductId=?";
                    
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