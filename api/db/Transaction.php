<?php

// Transaction model
class Transaction{
    
	// adds a transaction
	public static function Add($siteId, $processor, $processorTransactionId, $processorStatus, $email, $payerId, $name, $shipping, $fee, $tax, $total, $currency, $items, $data, $receipt){
		
        try{
            
            $db = DB::get();
            
            $transactionId = uniqid();
            $timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO Transactions (TransactionId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Receipt, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $transactionId);
            $s->bindParam(2, $siteId);
            $s->bindParam(3, $processor);
            $s->bindParam(4, $processorTransactionId);
            $s->bindParam(5, $processorStatus);
            $s->bindParam(6, $email);
            $s->bindParam(7, $payerId);
            $s->bindParam(8, $name);
            $s->bindParam(9, $shipping);
            $s->bindParam(10, $fee);
            $s->bindParam(11, $tax);
            $s->bindParam(12, $total);
            $s->bindParam(13, $currency);
            $s->bindParam(14, $items);
            $s->bindParam(15, $data);
            $s->bindParam(16, $receipt);
            $s->bindParam(17, $timestamp);
            
            $s->execute();
            
            return array(
                'TransactionId' => $transactionId,
                'SiteId' => $siteId,
                'Processor' => $processor,
                'ProcessorTransactionId' => $processorTransactionId,
                'ProcessorStatus' => $processorStatus,
                'Email' => $email,
                'PayerId' => $payerId,
                'Name' => $name,
                'Shipping' => $shipping,
                'Fee' => $fee,
                'Tax' => $tax,
                'Total' => $total,
                'Currency' => $currency,
                'Items' => $items,
                'Data' => $data,
                'Receipt' => $receipt,
                'Created' => $timestamp,
                );
                
        } catch(PDOException $e){
            die('[Transaction::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// gets all transactions for a site
	public static function GetTransactions($siteId){
		
        try{
            $db = DB::get();
            
            $q = "SELECT TransactionId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, 
            		Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Receipt, Created
					FROM Transactions WHERE SiteId = ? ORDER BY Created DESC";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $siteId);
            
            $s->execute();
            
            $arr = array();
            
        	while($row = $s->fetch(PDO::FETCH_ASSOC)) {  
                array_push($arr, $row);
            } 
            
            return $arr;
        
		} catch(PDOException $e){
            die('[Transaction::GetTransactions] PDO Error: '.$e->getMessage());
        }   
	}
	
	// gets a transaction by $transactionId
	public static function GetByTransactionId($transactionId){

        try{
        
        	$db = DB::get();
            
            $q = "SELECT TransactionId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, 
            		Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Receipt, Created
        		 	FROM Transactions WHERE TransactionId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $transactionId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Transaction::GetByTransactionId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// gets a transaction by the $processorTransactionId
	public static function GetByProcessorTransactionId($processorTransactionId){

        try{
        
        	$db = DB::get();
            
            $q = "SELECT TransactionId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, 
            		Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Receipt, Created
        		 	FROM Transactions WHERE ProcessorTransactionId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $processorTransactionId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Transaction::GetByProcessorTransactionId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// removes a transaction
	public static function Remove($transactionId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Transactions WHERE TransactionId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $transactionId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Transaction::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	
}

?>