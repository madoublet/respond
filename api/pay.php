<?php


/**
 * API call to pay for a subscription
 * @uri /pay/subscription
 */
class PayResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function pay() {

        // parse request
        parse_str($this->request->data, $request);
        
        $token = $request['token'];
        $plan = $request['plan'];
    
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
            Stripe::setApiKey(STRIPE_API_KEY);

            // create a new customer and subscribe them to the plan
            $customer = Stripe_Customer::create(
            	array(
					"card" => $token,
					"plan" => $plan,
					"email" => $authUser->Email)
            );

			// get back the id and the end period for the plan
            $id = $customer->id;
            $end = $customer->subscription->current_period_end;
            
            // #debug print 'end='.$end;
            
            date_default_timezone_set('UTC');
            
            // create a date from the timestamp returned by Stripe
            $renewalDate = gmdate("Y-m-d H:i:s", intval($end));
            
            // #debug print ' renewalDate='.$renewalDate;
            
            // by default, you should not have to update a payment
            $updatePayment = 0;
            
            // update the db and session
            Site::SetSubscription($authUser->SiteUniqId, $plan, $id, $renewalDate, $updatePayment);
            AuthUser::SetPlan($plan, $renewalDate, $updatePayment);
        
            // return a json response
            return new Tonic\Response(Tonic\Response::OK); 
                
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>