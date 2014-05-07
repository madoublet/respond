<?php
 
 	include '../app.php'; // import php files
	
		
	// #testing webhooks: https://stripe.com/docs/testing
	
	Stripe::setApiKey(STRIPE_API_KEY);
	
	
	 
	// retrieve the request's body and parse it as JSON
	$body = @file_get_contents('php://input');
	$event_json = json_decode($body);
	 
	// for extra security, retrieve from the Stripe API
	$event_id = $event_json->id;
	
	try{
	
		$event = Stripe_Event::retrieve($event_id);
	
		$invoice_id = $event->data->object->id;
		$total = $event->data->object->total;
		
		if($event->type == 'invoice.payment_succeeded'){
		
			// check for trial
			if($total != 0){
		
				// #ref: https://stripe.com/docs/api#retrieve_customer
				$customer = Stripe_Customer::retrieve($event->data->object->customer);
			
				$site =  Site::GetByCustomerId($customer->id);
				
				// email receipt to customer
				if(SEND_PAYMENT_SUCCESSFUL_EMAIL == true){
				
		    		$to = $site['PrimaryEmail'];
		    		$from = REPLY_TO;
		    		$fromName = REPLY_TO_NAME;
		    		$subject = BRAND.': Payment Successful';
		    		$file = 'emails/invoice-payment-succeeded.html';
		    		
		    		// create strings to replace
		    		$loginUrl = APP_URL;
		    		$newSiteUrl = APP_URL.'/sites/'.$site['FriendlyId'];
		    		
		    		$replace = array(
		    			'{{brand}}' => BRAND,
		    			'{{reply-to}}' => REPLY_TO,
		    			'{{login-url}}' => $loginUrl
		    		);
		    		
		    		// send email from file
		    		Utilities::SendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);
		    	}
	    	
	    	}
		
		}
		
		if($event->type == 'invoice.payment_failed'){
		
			$invoice_id = $event->data->object->id;
	
			// https://stripe.com/docs/api#retrieve_customer
			$customer = Stripe_Customer::retrieve($event->data->object->customer);
			
			$site =  Site::GetByCustomerId($customer->id);
			
			// email receipt to customer
			if(SEND_PAYMENT_FAILED_EMAIL == true){
			
	    		$to = $site['PrimaryEmail'];
	    		$from = REPLY_TO;
	    		$subject = BRAND.': Payment Failed';
	    		$file = 'emails/invoice-payment-failed.html';
	    		
	    		// create strings to replace
	    		$loginUrl = APP_URL;
	    		$newSiteUrl = APP_URL.'/sites/'.$site['FriendlyId'];
	    		
	    		$replace = array(
	    			'{{brand}}' => BRAND,
	    			'{{reply-to}}' => REPLY_TO,
	    			'{{login-url}}' => $loginUrl
	    		);
	    		
	    		// send email from file
	    		Utilities::SendEmailFromFile($to, $from, $subject, $replace, $file);
	    	}
		
		}
	
	}
	catch (Exception $e) {
		print $e->getMessage();;
	}
	  
?>