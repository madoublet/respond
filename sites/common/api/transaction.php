<?php


/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /transaction/test
 */
class TransactionTestResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/HTML';
        $response->body = 'Transaction works!';

        return $response;
    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /transaction/download/{transactionUniqId}/{sku}
 */
class TransactionDownloadResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($transactionUniqId, $sku) {
    
    	// set sku to be downloaded
    	$file = '../files/downloads/'.$sku.'.zip';

		// validate transaction
		$transaction = Transaction::GetByTransactionUniqId($transactionUniqId);

		if(isset($transaction['Items'])){
			// decode items in the transaction
			$items = json_decode($transaction['Items'], true);
			
			$is_valid = false;
			
			// determine if sku is associated with the transaction
			foreach($items as $item){
				if($item['SKU'] == $sku){
					$is_valid = true;
				}
			} 
	
			// return the file for a valid call
			if($is_valid == true){
	       		$response = new Tonic\Response(Tonic\Response::OK);
		   		$response->contentType = 'application/zip';
		   		$response->body = file_get_contents($file);
		   		
		   		return $response;
	        }
	        else{
		        return new Tonic\Response(Tonic\Response::UNAUTHORIZED, 'NOT AUTHORIZED');
	        }
        }
        else{
	        return new Tonic\Response(Tonic\Response::UNAUTHORIZED, 'NOT AUTHORIZED');
        }
    
        
    }
}

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /transaction/paypal
 */
class TransactionPaypalResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
    	parse_str($this->request->data, $request);
    	
    	$siteUniqId = $request['custom'];
		    
	    // get reference to site
	    $site = Site::GetBySiteUniqId($siteUniqId);
    	
    	$use_sandbox = false;
    	
    	// set whether to use a sandbox
    	if($site['PayPalUseSandbox'] == '1'){
	    	$use_sandbox = true;
    	}
    	
    	$listener = new IpnListener();
		$listener->use_curl = false;
		$listener->use_sandbox = $use_sandbox;
		$listener->use_ssl = true;
		
		try {
		    $verified = $listener->processIpn();
		} catch (Exception $e) {
		    // fatal error trying to process IPN.
		    exit(0);
		}
		
		// IPN response was "VERIFIED"
		if ($verified) {
		    $processor = 'PayPal';
		    
		    if($use_sandbox == true){
			    $processor .= ' (sandbox)';
		    }
		    
		    $processorTransactionId = $request['txn_id'];
		    $processorStatus = $request['payment_status'];
		    $email = $request['payer_email'];
		    $payerId = $request['payer_id'];
		    $name = $request['first_name'].' '.$request['last_name'];
		    $shipping = $request['mc_handling'];
		    $fee = $request['mc_fee'];
		    $tax = $request['tax'];
		    $total = $request['mc_gross'];
		    $currency = $request['mc_currency'];
		    
		    $num_items = 1000;
		 
		    if(isset($request['num_cart_items'])){
		    	$num_items = $request['num_cart_items'];
		    }
		    
		    $items = array();
		   
			// line-items (for receipt)
			$line_items = '';
		    			
		    // get items 
		    for($x=1; $x<=$num_items; $x++){
		   
				if(isset($request['item_number'.$x])){
				
					$arr_temp = explode('-', $request['item_number'.$x]);
					
					// shipping type is the last item of the array
					$item_shipping_type = $arr_temp[count($arr_temp) - 1];
					
					// the sku is the last item less the type
					$item_sku = str_replace('-'.$item_shipping_type, '', $request['item_number'.$x]);
					$item_name = $request['item_name'.$x];
					$item_sku = iconv("ISO-8859-1","UTF-8", $item_name);
					$item_name = iconv("ISO-8859-1","UTF-8", $item_name);
					
					$item_quantity = $request['quantity'.$x];
					$item_total = $request['mc_gross_'.$x];
					$item_price = floatval($item_total) / intval($item_quantity);
				
			    	$item = array(
	                    'SKU' => $item_sku,
	                    'Name'  => $item_name,
	                    'ShippingType' => $item_shipping_type,
	                    'Quantity' => $item_quantity,
	                    'Price' => $item_price,
	                    'Total' => $item_total,
	                );
	                
	                $download_link = '';
	                
	                if($item_shipping_type == 'DOWNLOAD'){
	                	$download_link = '<br><a href="http://'.$site['Domain'].'/api/transaction/download/{{transactionUniqId}}/'.$item_sku.'">Download</a>';
	                }
	                
	                // setup currency for line items
	                $item_total = $item_total.' '.$currency;
	                $item_price = $item_price.' '.$currency;
	                
	                // add $ for total and price
	                if($currency == 'USD'){
		                $item_total = '$'.$item_total;
		                $item_price = '$'.$item_price;
	                }
	                
	                $line_items .= '<tr style="border-bottom: 1px solid #f0f0f0;"><td>'.$item_name.'<br><small>'.$item_sku.'</small>'.$download_link.'</td><td align="right">'.$item_price.'</td><td align="right">'.$item_quantity.'</td><td align="right">'.$item_total.'</td></tr>';
	                
				    array_push($items, $item);
			    }
			    
			    
		    }
		    
		    $items_json = json_encode($items);
		    
		    $data_json = json_encode($_POST);
		   
			// add a transaction
			$transaction = Transaction::Add($site['SiteId'], $processor, $processorTransactionId, $processorStatus, $email, $payerId, $name, $shipping, $fee,$tax, $total, $currency, $items_json, $data_json);
			
			// replace {{transactionUniqId}} in line_items
			$line_items = str_replace('{{transactionUniqId}}', $transaction['TransactionUniqId'], $line_items);
			
			$site_logo = '';
			
			if($site['LogoUrl']!='' && $site['LogoUrl']!=NULL){
				$site_logo = '<img src="http://'.$site['Domain'].'/files/'.$site['LogoUrl'].'" style="max-height:50px">';
			}
			
			// setup currency for line items
            $shipping = $shipping.' '.$currency;
            $tax = $tax.' '.$currency;
            $total = $total.' '.$currency;
            
            // add $ for total and price
            if($currency == 'USD'){
                $shipping = '$'.$shipping;
                $tax = '$'.$tax;
                $total = '$'.$total;
            }
			
			// send email
			$replace = array(
    			'{{site}}' => $site['Name'],
    			'{{site-logo}}' => $site_logo,
    			'{{reply-to}}' => $site['PrimaryEmail'],
    			'{{line-items}}' => $line_items,
    			'{{shipping}}' => $shipping,
    			'{{tax}}' => $tax,
    			'{{total}}' => $total,
    		);
    		
    		$subject = '['.$site['Name'].'] Receipt for your purchase from '.$site['Name'].' (ID: '.strtoupper($transaction['TransactionUniqId']).')';
    		//$file = 'sites/'.$site['FriendlyId'].'/emails/receipt.html';
    		
    		$file = '/emails/receipt.html';
    		
    		// send email from file
    		Utilities::SendEmailFromFile($email, $site['PrimaryEmail'], $site['Name'], $subject, $replace, $file);
			
			
		} else {
		    // IPN response was "INVALID"\
		}

        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/HTML';
        $response->body = 'Yah!!!';

        return $response;
    }
}


?>