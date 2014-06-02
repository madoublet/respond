<?php

// Transaction model
class Transaction{
    
	// adds a transaction
	public static function Add($siteId, $processor, $processorTransactionId, $processorStatus, $email, $payerId, $name, $shipping, $fee, $tax, $total, $currency, $items, $data){
		
        try{
            
            $db = DB::get();
            
            $transactionUniqId = uniqid();
            $timestamp = gmdate("Y-m-d H:i:s", time());
    	
    		$q = "INSERT INTO Transactions (TransactionUniqId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Created) 
    			    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $s = $db->prepare($q);
            $s->bindParam(1, $transactionUniqId);
            $s->bindParam(2, $siteId);
            $s->bindParam(3, $processor);
            $s->bindParam(4, $processorTransactionId);
            $s->bindParam(5, $processorStatus);
            $s->bindParam(6, $email);
            $s->bindParam(7, $payerId);
            $s->bindParam(8, $name);
            $shipping = is_null($shipping) ? 0 : $shipping;
            $s->bindParam(9, $shipping);
            $fee = is_null($fee) ? 0 : $fee;
            $s->bindParam(10, $fee);
            $tax = is_null($tax) ? 0 : $tax;
            $s->bindParam(11, $tax);
            $total = is_null($total) ? 0 : $total;
            $s->bindParam(12, $total);
            $s->bindParam(13, $currency);
            $s->bindParam(14, $items);
            $s->bindParam(15, $data);
            $s->bindParam(16, $timestamp);
            
            $s->execute();
            
            return array(
                'TransactionUniqId' => $transactionUniqId,
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
                'Created' => $timestamp,
                );
                
        } catch(PDOException $e){
            //die('[Transaction::Add] PDO Error: '.$e->getMessage());
        }
	}
	
	// gets all transactions for a site
	public static function GetTransactions($siteId){
		
        try{
            $db = DB::get();
            
            $q = "SELECT TransactionUniqId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, 
            		Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Created
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
	
	// gets a transaction by TransactionUniqId
	public static function GetByTransactionUniqId($transactionUniqId){

        try{
        
        	$db = DB::get();
            
            $q = "SELECT TransactionUniqId, SiteId, Processor, ProcessorTransactionId, ProcessorStatus, 
            		Email, PayerId, Name, Shipping, Fee, Tax, Total, Currency, Items, Data, Created
        		 	FROM Transactions WHERE TransactionUniqId = ?";
                    
            $s = $db->prepare($q);
            $s->bindParam(1, $transactionUniqId);
            
            $s->execute();
            
            $row = $s->fetch(PDO::FETCH_ASSOC);        
    
    		if($row){
    			return $row;
    		}
        
        } catch(PDOException $e){
            die('[Transaction::GetByTransactionUniqId] PDO Error: '.$e->getMessage());
        }
        
	}
	
	// removes a transaction
	public static function Remove($transactionUniqId){
		
        try{
            
            $db = DB::get();
            
            $q = "DELETE FROM Transactions WHERE TransactionUniqId = ?";
     
            $s = $db->prepare($q);
            $s->bindParam(1, $transactionUniqId);
            
            $s->execute();
            
		} catch(PDOException $e){
            die('[Transaction::Remove] PDO Error: '.$e->getMessage());
        }
        
	}
	
	
}

?>