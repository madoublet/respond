<?php

// load dao
include '../../global.php';
include 'dao/Product.php';

// create controller
class ProcessCart extends Actions
{
	private $AuthUser;

	function __construct($authUser){
		
		parent::__construct();
		$this->AuthUser = $authUser;

		$this->Ajax = $this->GetPostData("Ajax"); /* check for any ajax calls */
		
		if($this->Ajax=='product.add'){
			$this->Add();
		}
		else if($this->Ajax=='product.remove'){
			$this->Remove();
		}
		else if($this->Ajax=='product.get'){
			$this->Get();
		}
	}

	// adds a product
	function Add(){
		$pageUniqId = $this->GetPostData("PageUniqId");
		$sku = $this->GetPostData("SKU");
		$name = $this->GetPostData("Name");
		$price = $this->GetPostData("Price");
		$createdBy = $this->AuthUser->UserId;
		
		$product = Product::Add($sku, $name, $price, $pageUniqId, $createdBy);

		// creates a response object
		$tojson = array (
		    "ProductUniqId"  => $product->ProductUniqId
		);
			
		// encode to json
		$encoded = json_encode($tojson);
		 
		die($encoded);
	}

	// removes a product
	function Remove(){

	}

	// gets a list of products
	function Get(){
		$pageUniqId = $this->GetPostData("PageUniqId");

		$products = Product::GetProductsByPageUniqId($pageUniqId);

		$html = '';

		while($row = mysql_fetch_array($products)){
			$html=$html.'<tr data-productuniqid="'.$row['ProductUniqId'].'">'.
					'<td>'.$row['SKU'].'</td>'.
					'<td>'.$row['Name'].'</td>'.
					'<td>$'.$row['Price'].'</td><td><a id="remove-product">Remove</a></td></tr>';
		}

		die($html);
	}
}

$authUser = new AuthUser(); // get auth user
$authUser->Authenticate('All');

$p = new ProcessCart($authUser); // setup controller

?>