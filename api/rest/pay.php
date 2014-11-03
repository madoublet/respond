<?php


/**
 * API call to pay for a subscription
 * @uri /pay/stripe/subscription
 */
class PayStripeSubscriptionResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function pay() {
    
    	// get token
		$token = Utilities::ValidateJWTToken(apache_request_headers());

		// check if token is not null
        if($token != NULL){ 

        	// parse request
        	parse_str($this->request->data, $request);
        	
        	$site = Site::GetBySiteId($token->SiteId);

			$siteId = $site['SiteId'];
			$email = $site['PrimaryEmail'];
			$status = 'Active';
        	$stripe_token = $request['token'];
			$plan = $request['plan'];
    
			// set API key
			Stripe::setApiKey(STRIPE_SECRET_KEY);

            // create a new customer and subscribe them to the plan
            $customer = Stripe_Customer::create(
            	array(
					"card" => $stripe_token,
					"plan" => $plan,
					"email" => $email)
            );

			// get back the id and the end period for the plan
            $id = $customer->id;
            
            // get subscription information
            $subscription = $customer->subscriptions->data[0];
			
			$subscriptionId = $subscription->id;			
			$stripe_status = $subscription->status;
			$stripe_plan = $subscription->plan->id;
			$stripe_planname  = $subscription->plan->name;
			
			// subscribe to a plan
			Site::Subscribe($siteId, $status, $plan, 'stripe', $subscriptionId, $customerId);
        
            // return a json response
            return new Tonic\Response(Tonic\Response::OK); 
                
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>