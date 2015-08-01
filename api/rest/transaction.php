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
 * @uri /transaction/download/{transactionId}/{productId}
 */
class TransactionDownloadResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get($transactionId, $productId) {
    
    	// defaults
    	$body = '';
    	$contentType  = 'application/zip';
    
    	// get product
    	$product = Product::GetByProductId($productId);
    	
    	// get extension
        $parts = explode('.', $product['Download']); 
    	$ext = end($parts);
    	
    	// set contenttype
    	$contentType = Utilities::GetContentTypeFromExtension($ext);
    	
    	// validate transaction
		$transaction = Transaction::GetByTransactionId($transactionId);
		
		// get site
		$site = Site::GetBySiteId($transaction['SiteId']);
    	
    	// handle files
    	$file = SITES_LOCATION.'/'.$site['FriendlyId'].'/downloads/'.$product['Download'];
	    $body = file_get_contents($file);
	    
		if(isset($transaction['Items'])){
			// decode items in the transaction
			$items = json_decode($transaction['Items'], true);

			$is_valid = false;

			// determine if sku is associated with the transaction
			foreach($items as $item){
			
				if($item['ProductId'] == $productId){
					$is_valid = true;
				}
				
			} 

			// return the file for a valid call
			if($is_valid == true){
	       		$response = new Tonic\Response(Tonic\Response::OK);
		   		$response->contentType = $contentType;
		   		//Response.AppendHeader("content-disposition", "attachment; filename='" + fileName +"'");
		   		$response->contentDisposition = "attachment; filename='".$product['Download']."'";
		   		$response->body = $body;

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
    	
    	$siteId = $request['custom'];

	    // get reference to site
	    $site = Site::GetBySiteId($siteId);
    	
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
			
			// set static URL
			$staticUrl = $site['Domain'];

		    // get items 
		    for($x=1; $x<=$num_items; $x++){

				if(isset($request['item_number'.$x])){

					$item_number = $request['item_number'.$x];
					$item_name = $request['item_name'.$x];
					$item_number = iconv("ISO-8859-1","UTF-8", $item_number);
					$item_name = iconv("ISO-8859-1","UTF-8", $item_name);

					$item_quantity = $request['quantity'.$x];
					$item_total = $request['mc_gross_'.$x];
					$item_price = floatval($item_total) / intval($item_quantity);

			    	$item = array(
	                    'ProductId' => $item_number,
	                    'Name'  => $item_name,
	                    'Quantity' => $item_quantity,
	                    'Price' => $item_price,
	                    'Total' => $item_total,
	                );

					// get product
					$product = Product::GetByProductId($item_number);

					// get download link
	                $download_link = '';
	                
	                // check if there is a downloaded file for the product
	                if($product['Download'] != '' && $product['Download'] != NULL){
		                $download_link = '<br><a href="'.API_URL.'/transaction/download/{{transactionId}}/'.$item_number.'">Download</a>';
		            }

	                // setup currency for line items
	                $item_total = $item_total.' '.$currency;
	                $item_price = $item_price.' '.$currency;

	                // add $ for total and price
	                if($currency == 'USD'){
		                $item_total = '$'.$item_total;
		                $item_price = '$'.$item_price;
	                }

	                $line_items .= '<tr style="border-bottom: 1px solid #f0f0f0;"><td>'.$item_name.'<br><small>'.$item_number.'</small>'.$download_link.'</td><td align="right">'.$item_price.'</td><td align="right">'.$item_quantity.'</td><td align="right">'.$item_total.'</td></tr>';

				    array_push($items, $item);
			    }


		    }

		    $items_json = json_encode($items);

		    $data_json = json_encode($_POST);
		    
		    // create receipt
		    $receipt = $line_items;
		    				
			// add a transaction
			$transaction = Transaction::Add($site['SiteId'], $processor, $processorTransactionId, $processorStatus, $email, $payerId, $name, $shipping, $fee,$tax, $total, $currency, $items_json, $data_json, $receipt);

			// replace {{transactionId}} in line_items
			$line_items = str_replace('{{transactionId}}', $transaction['TransactionId'], $line_items);

			$site_logo = '';

			if($site['LogoUrl']!='' && $site['LogoUrl']!=NULL){
				$site_logo = '<img src="'.$staticUrl.'/files/'.$site['LogoUrl'].'" style="max-height:50px">';
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
    		
    		// create subject
    		$subject = SITE_RECEIPT_EMAIL_SUBJECT;
    		$subject = str_replace('{{site}}', $site['Name'], $subject);
    		$subject = str_replace('{{transactionId}}', $transaction['TransactionId'], $subject);
    		
    		// send email
    		$content = $site['ReceiptEmail'];
    		
    		// walk through and replace values in associative array
            foreach ($replace as $key => &$value) {
			    
			    $content = str_replace($key, $value, $content);
			    $subject = str_replace($key, $value, $subject);
		
			}
			
    		// send site email
    		Utilities::SendSiteEmail($site, $email, $site['PrimaryEmail'], $site['Name'], $subject, $content);
    		
  
		} else {
		    // IPN response was "INVALID"\
		}

        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'text/HTML';
        $response->body = 'Yah!!!';

        return $response;
    }
}


/**
 * A protected API call that shows all pages
 * @uri /transaction/list
 */
class TransactionListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
            parse_str($this->request->data, $request); // parse request

            // get transactions
            $list = Transaction::GetTransactions($token->SiteId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($list);

            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

/**
 * A protected API call that shows all pages
 * @uri /transaction/receipt
 */
class TransactionReceiptResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
    	parse_str($this->request->data, $request); // parse request
		
		$processorTransactionId = $request['processorTransactionId'];

		if($processorTransactionId != NULL){
       
            // get transactions
            $transaction = Transaction::GetByProcessorTransactionId($processorTransactionId);
            
            $receipt = $transaction['Receipt'];
            
            // replace {{transactionId}} in $receipt
			$receipt = str_replace('{{transactionId}}', $transaction['TransactionId'], $receipt);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = $receipt;

            return $response;
            
		}
		else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

?>