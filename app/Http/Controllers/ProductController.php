<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Illuminate\Http\Response;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Product;

class ProductController extends Controller
{

  /**
   * Lists all products for a site
   *
   * @return Response
   */
  public static function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    $arr = Product::listAll($siteId);

    return response()->json($arr);

  }

  /**
   * Retrieves a product for a site
   *
   * @return Response
   */
  public static function retrieve(Request $request, $id)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    $product = Product::getById($id, $siteId);

    // build array
    $arr = array(
        'id' => $product->id,
        'name' => $product->name,
        'shipped' => $product->shipped,
        'price' => $product->price,
        'file' => $product->file,
        'subscription' => $product->subscription,
        'plan' => $product->plan,
        'planPrice' => $product->planPrice,
        'images' => $product->images,
        'options' => $product->options
      );

    return response()->json($arr);

  }

  /**
   * Adds the product
   *
   * @return Response
   */
  public static function add(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get url, title and description
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');
    $shipped = $request->json()->get('shipped');
    $price = $request->json()->get('price');
    $file = $request->json()->get('file');
    $subscription = $request->json()->get('subscription');
    $plan = $request->json()->get('plan');
    $planPrice = $request->json()->get('planPrice');

    $product = Product::getById($id, $siteId);

    if($product == NULL) {

      Product::add($id, $name, $shipped, $price, $file, $subscription, $plan, $planPrice, $siteId);
      return response('Product added', 200);

    }
    else {
      return response('Product already exists', 400);
    }

  }

  /**
   * Edits the product
   *
   * @return Response
   */
  public static function edit(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get url, title and description
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');
    $shipped = $request->json()->get('shipped');
    $price = $request->json()->get('price');
    $file = $request->json()->get('file');
    $subscription = $request->json()->get('subscription');
    $plan = $request->json()->get('plan');
    $planPrice = $request->json()->get('planPrice');

    // retrieve product
    $product = Product::getById($id, $siteId);

    if($product != NULL) {

      // edit product
      $product->edit($name, $shipped, $price, $file, $subscription, $plan, $planPrice, $siteId);

      return response('Product updated', 200);

    }
    else {
      return response('Product not found', 400);
    }

  }

  /**
   * Removes the product
   *
   * @return Response
   */
  public static function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $id = $request->json()->get('id');

    // update order in file
    $product = Product::getById($id, $siteId);

    if($product != NULL) {

      // removes a product
      $product->remove($siteId);

      return response('Product Removed', 200);

    }
    else {
      return response('Product not found', 400);
    }

  }

}