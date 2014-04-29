<?php

/**
 * API call to pay for a subscription
 * @uri /customer/subscribe
 */
class CustomerSubscribeResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);
        
        $token = $request['token'];
        $plan = $request['plan'];
    
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	try{
	        
	        	$site = Site::GetBySiteUniqId($authUser->SiteUniqId);
	        	
	        	if($site['CustomerId'] == null){
		        
		            Stripe::setApiKey(STRIPE_API_KEY);
		
		            // create a new customer and subscribe them to the plan
		            $customer = Stripe_Customer::create(
		            	array(
							"card" => $token,
							"plan" => $plan,
							"email" => $authUser->Email)
		            );
		
					// get back the id and the end period for the plan
		            $customerId = $customer->id;
		      	
					// #todo add customerid
					Site::EditCustomer($site['SiteUniqId'], $customerId);
					
				}
				else{
					
					Stripe::setApiKey(STRIPE_API_KEY);
	
					$customer = Stripe_Customer::retrieve($site['CustomerId']);
					$customer->updateSubscription(
						array(
							"card" => $token,
							"plan" => $plan, 
							"prorate" => true,
							"trial_end" => 'now')
					);
					
				}
	            
	            // return a json response
	            return new Tonic\Response(Tonic\Response::OK); 
            
            }
            catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
                
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * A protected API call to edit a page
 * @uri /customer/get
 */
class CustomerGetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			try{
			
	            $site = Site::GetBySiteUniqId($authUser->SiteUniqId);
	            
	            if(strtoupper($site['Type']) == 'SUBSCRIPTION'){
	            
		            Stripe::setApiKey(STRIPE_API_KEY);
		
					// get customer
					$customer = Stripe_Customer::retrieve($site['CustomerId']);
					
					// get card
					$default_card = $customer->default_card;
					$hasCard = false;
					$cardReadable = 'No card';
					$cardExpires = '';
					$cardExpiredMonth = '';
					$cardExpiredYear = '';
	            
					if($default_card != null){
						$card = $customer->cards->retrieve($default_card);
						
						$cardReadable = $card->type.' *'.$card->last4.' ';
						$cardExpires = 'Expires '.$card->exp_month.'/'.$card->exp_year;
						$cardExpiredMonth = $card->exp_month;
						$cardExpiredYear = $card->exp_year;
						$hasCard = true;
					}
					
					// get default subscription
					if(isset($customer->subscriptions->data[0])){		
					
						$subscription = $customer->subscriptions->data[0];
					
						$status = $subscription->status;
						$plan = $subscription->plan->id;
						$name  = $subscription->plan->name;
						
						// set sites timezone
						$local = new DateTimeZone($site['TimeZone']);
						
						$date = new DateTime();
						$date->setTimestamp($subscription->current_period_end);
						$date->setTimezone($local);
						
						// crete a renewable readable date
						$renewalReadable = $date->format('D, M d y h:i:s a');
						
						// get currency amount interval
						$currency = $subscription->plan->currency;
						$amount = $subscription->plan->amount;
						$interval = $subscription->plan->interval;
						
						// create a readable version of the price
						$readable = $amount.' / '.$interval.' '.$currency;
									
						if($currency = 'usd'){
							$dollars = $amount/100;
							$readable = '$'.$dollars.' / '.$interval;
						}
						
						if($status == 'trialing'){
							$status = 'trial';
						}
						
						$end = $subscription->current_period_end;
					}
					else{
						$status = 'unsubscribed';
						$plan = '';
						$name = 'N/A';
						$renewalReadable = 'N/A';
						$currency = '';
						$amount = '';
						$interval = '';
						$readable = '';
						$end = '';
						$cardReadable = '';
						$cardExpires = '';
						$cardExpiredMonth = '';
						$cardExpiredYear = '';
						$hasCard = false;
					}

					$customer = array(
						'type' => $site['Type'],
					  	'id' => $customer->id,
						'status' => ucfirst($status),
						'plan' => $plan,
						'amountReadable' => $readable,
						'name' => $name,
						'renewal' => $end,
						'renewalReadable' => $renewalReadable,
						'amount' => $amount,
						'interval' => $interval,
						'currency' => $currency,
						'hasCard' => $hasCard,
						'cardReadable' => $cardReadable,
						'cardExpires' => $cardExpires,
						'cardExpiredMonth' => $cardExpiredMonth,
						'cardExpiredYear' => $cardExpiredYear
					);  
				
				}
				else{
					
					$customer = array(
						'type' => $site['Type'],
					  	'id' => '',
						'status' => 'Active',
						'plan' => 'N/A',
						'amountReadable' => '',
						'name' => '',
						'renewal' => '',
						'renewalReadable' => '',
						'amount' => '',
						'interval' => '',
						'currency' =>  '',
						'hasCard' => false,
						'cardReadable' => '',
						'cardExpires' => ''
					); 
					
				}
	
			    $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($customer);
	
	            return $response;
            
            }
			catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
	            
            
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * API call to pay for a subscription
 * @uri /customer/plan/unsubscribe
 */
class CustomerUnsubscribeResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);
        
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	try{
        
	        	$site = Site::GetBySiteUniqId($authUser->SiteUniqId);
	        
	            Stripe::setApiKey(STRIPE_API_KEY);
	
				$customer = Stripe_Customer::retrieve($site['CustomerId']);
				
				// retrieve default subscription
				if(isset($customer->subscriptions->data[0])){
				
					$subscription = $customer->subscriptions->data[0];
						
					// cancels a subscription	
					if($subscription != NULL){	
						$subscription->cancel();
					}
					
					// update the session
		            AuthUser::UpdateSubscription();
	            }
	            
	            // return a json response
	            return new Tonic\Response(Tonic\Response::OK); 
            
            }
            catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
                
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

/**
 * API call to pay for a subscription
 * @uri /customer/plan/change
 */
class CustomerPlanChangeResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);
        $plan = $request['plan'];
        
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	try{
        
	        	$site = Site::GetBySiteUniqId($authUser->SiteUniqId);
	        
	            Stripe::setApiKey(STRIPE_API_KEY);
	
				$customer = Stripe_Customer::retrieve($site['CustomerId']);
				
				// retrieve default subscription
				if(isset($customer->subscriptions->data[0])){
				
					$subscription = $customer->subscriptions->data[0];
				
					// updates the subscription	
					if($subscription != NULL){	
						$subscription->plan = $plan;
						$subscription->save();
					}
					
		            // update the session
		            AuthUser::UpdateSubscription();
		            
				}
	        
	            // return a json response
	            return new Tonic\Response(Tonic\Response::OK); 
            
            }
        	catch (Exception $e) {
				$response = new Tonic\Response(Tonic\Response::BADREQUEST);
				$response->body = $e->getMessage();
				return $response;
			}
                
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>