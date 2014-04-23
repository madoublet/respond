<?php

/**
 * API call to get the default card for a plan
 * @uri /card/default
 */
class CardDefaultResource extends Tonic\Resource {

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
				
	            $default_card = $customer->default_card;
	            
				$card = $customer->cards->retrieve($default_card);
				
				$card_arr = array(
					'last4' => $card->last4,
					'type' => $card->type,
					'exp_month' => $card->exp_month,
					'exp_year' => $card->exp_year
				);
	            
	            // return a json response
	            $response = new Tonic\Response(Tonic\Response::OK);
	            $response->contentType = 'application/json';
	            $response->body = json_encode($card_arr);
	
	            return $response;
            
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
 * API call to get the default card for a plan
 * @uri /card/update
 */
class CardUpdateResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);
    
		$month = $request['month'];
		$year = $request['year'];
    
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	try {
        	
        		$site = Site::GetBySiteUniqId($authUser->SiteUniqId);
        	
	            Stripe::setApiKey(STRIPE_API_KEY);
	
				$customer = Stripe_Customer::retrieve($site['CustomerId']);
				
	            $default_card = $customer->default_card;
	            
				$card = $customer->cards->retrieve($default_card);
				
				$card->exp_month = $month; 
				$card->exp_year = $year; 
				
				$card->save();
				
	            // return a 200
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
 * API call to get the default card for a plan
 * @uri /card/new
 */
class CardNewResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // parse request
        parse_str($this->request->data, $request);
    
		$token = $request['token'];
		
        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized
        
        	try {
        
        		$site = Site::GetBySiteUniqId($authUser->SiteUniqId);
        	
	            Stripe::setApiKey(STRIPE_API_KEY);
	
				$customer = Stripe_Customer::retrieve($site['CustomerId']);
				
				//$customer->cards->create(array("card" => $token));
				
				$customer->card = $token;
				
				$customer->save();
				
	            // return a 200
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