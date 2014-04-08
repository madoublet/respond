<?php

/**
 * A protected API call to edit a page
 * @uri /plan/add
 */
class PlanAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			if($authUser->IsSuperAdmin == true){ // only available to super admin

				try{
				
		            parse_str($this->request->data, $request); // parse request
		          
					$id = $request['id'];
		            $name = $request['name'];
		            $amount = $request['amount'];
		            $interval = $request['interval'];
		            $currency = $request['currency'];
		            $trial = $request['trial'];
		
					$plan = array(
					  "amount" => $amount,
					  "interval" => $interval,
					  "name" => $name,
					  "currency" => $currency,
					  "trial_period_days" => $trial,
					  "id" => $id);
		
					// add plan to stripe
					Stripe::setApiKey(STRIPE_API_KEY);
		
					Stripe_Plan::create($plan);
		           
		            // return a json response
		            $response = new Tonic\Response(Tonic\Response::OK);
		            $response->contentType = 'application/json';
		            $response->body = json_encode($plan);
		
		            return $response;
	            
	            }
				catch (Exception $e) {
					$response = new Tonic\Response(Tonic\Response::BADREQUEST);
					$response->body = $e->getMessage();
					return $response;
				}
	            
            }
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to edit a plan
 * @uri /plan/edit
 */
class PlanEditResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

			if($authUser->IsSuperAdmin == true){ // only available to super admin

				try{

		            parse_str($this->request->data, $request); // parse request
		          
					$id = $request['id'];
		            $name = $request['name'];
		
					// add plan to stripe
					Stripe::setApiKey(STRIPE_API_KEY);
		
					$p = Stripe_Plan::retrieve($id);
					$p->name = $name;
					$p->save();
		           
		            // return a json response
		            $response = new Tonic\Response(Tonic\Response::OK);
		
		            return $response;
		            
	            }
	            catch (Exception $e) {
					$response = new Tonic\Response(Tonic\Response::BADREQUEST);
					$response->body = $e->getMessage();
					return $response;
				}
	            
            }
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * A protected API call to add a page
 * @uri /plan/list
 */
class PlanListResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	try{

				// add plan to stripe
				Stripe::setApiKey(STRIPE_API_KEY);
	
				$plan_list = Stripe_Plan::all();
				$plans = array();
				
				foreach($plan_list['data'] as $item){ // iterate files
				
					$readable = $item->amount.' / '.$item->interval.' '.$item->currency;
					
					if($item->currency = 'usd'){
					
						$dollars = $item->amount/100; 
					
						$readable = '$'.$dollars.' / '.$item->interval;
					}
				
					if($item->currency=='usd'){
						
					}
				
					$plan = array(
						'interval' => $item->interval,
						'name' => $item->name,
						'amount' => $item->amount,
						'currency' => $item->currency,
						'id' => $item->id,
						'readable' => $readable,
						'trial' => $item->trial_period_days
					);
				
					array_push($plans, $plan);
				
				}
				
				// return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($plans);
	
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
 * A protected API call to edit a page
 * @uri /plan/get
 */
class PlanGetResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get an authuser
        $authUser = new AuthUser();
        
        parse_str($this->request->data, $request); // parse request

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        
        	try{
        	
        		$customerId = $authUser->CustomerId;
			
				Stripe::setApiKey(STRIPE_API_KEY);
		
				$customer = Stripe_Customer::retrieve($customerId);
		
				$status = $customer->subscription->status;
				$plan = $customer->subscription->plan->id;
				$name  = $customer->subscription->plan->name;
				$renewal = gmdate("Y-m-d H:i:s", intval($customer->subscription->current_period_end));
				$currency = $customer->subscription->plan->currency;
				$amount = $customer->subscription->plan->amount;
				$interval = $customer->subscription->plan->interval;
				
				$readable = $amount.' / '.$interval.' '.$currency;
							
				if($currency = 'usd'){
					$dollars = $amount/100;
					$readable = '$'.$dollars.' / '.$interval;
				}
				
				$plan = array(
					'status' => $status,
					'plan' => $plan,
					'readable' => $readable,
					'name' => $name,
					'renewal' => $renewal
				);

	            // return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($plan);
	
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

?>