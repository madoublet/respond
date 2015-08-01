<?php

/**
 * Adds a product, post params: token, productId, sku, pageId, name, price, shipping, weight, download
 * @uri /product/add
 */
class ProductAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

       	// get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// parse request
        	parse_str($this->request->data, $request); 
			
            // get request paramters
            $productId = $request['productId'];
            $sku = $request['sku'];
            $pageId = $request['pageId'];
            $name = $request['name'];
            $price = $request['price'];
            $shipping = $request['shipping'];
            $weight = $request['weight'];
            $download = $request['download'];
            
            // adds a version
            Product::Add($productId, $sku, $pageId, $name, $price, $shipping, $weight, $download);
                        
            // return a 200
            return new Tonic\Response(Tonic\Response::OK);
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

/**
 * Returns a product, post params: token, productId
 * @uri /product/retrieve
 */
class ProductRetrieveResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {
    
        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// parse request
        	parse_str($this->request->data, $request);
			
			$productId = $request['productId'];
			
			$product = Product::GetByProductId($productId);

            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'application/json';
            $response->body = json_encode($product);

            return $response;
        }
        else{
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
    
}
    
/**
 * Removes products for a page, post params: token, pageId
 * @uri /product/clear
 */
class ProductClearResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function post() {

        // get token
		$token = Utilities::ValidateJWTToken();

		// check if token is not null
        if($token != NULL){ 
        
        	// parse request
        	parse_str($this->request->data, $request);
        
        	$pageId = $request['pageId'];
        	
			Product::RemoveForPage($pageId);
			
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
         
            return $response;

        }
        else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }

    }

}

?>