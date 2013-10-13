<?php

/**
 * A protected API call to add a product
 * @uri /product/add
 */
class ProductAddResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function add() {

        // get an authuser
        $authUser = new AuthUser();

        if(isset($authUser->UserUniqId)){ // check if authorized

            parse_str($this->request->data, $request); // parse request

            $sku = $request['sku'];
            $description = $request['description'];
            $price = $request['price'];
            $currency = $request['currency'];
            $quantity = $request['quantity'];
            $shippingType = $request['shippingType'];
            $shippingRate = $request['shippingRate'];
            $downloadUrl = $request['downloadUrl'];
            $pageUniqId = $request['pageUniqId'];
            $cartId = $request['cartId'];
        
            $product = Product::Add($sku, $description, $price, $currency, $quantity, $shippingType, $shippingRate, $downloadUrl, $authUser->UserId);
            
            // #todo: add to page
            // $page = Page::GetByPageUniqId($pageUniqId);
			// #something like:  Product::AddToPage($product['ProductId'], $page['PageId'], $cartId);
			
            // return a json response
            $response = new Tonic\Response(Tonic\Response::OK);
            $response->contentType = 'applicaton/json';
            $response->body = json_encode($product);

            return $response;
        
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }

}

?>