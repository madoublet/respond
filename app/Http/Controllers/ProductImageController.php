<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Illuminate\Http\Response;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Product;

class ProductImageController extends Controller
{

  /**
   * Adds the image to a product
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
    $url = $request->json()->get('url');
    $thumb = $request->json()->get('thumb');
    $caption = $request->json()->get('caption');
    $productId = $request->json()->get('productId');

    $product = Product::getById($productId, $siteId);

    if($product != NULL) {

      $product->addImage($id, $name, $url, $thumb, $caption, $siteId);
      return response('Image added', 200);

    }
    else {
      return response('Product not found', 400);
    }


  }

  /**
   * Edits the product image
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
    $productId = $request->json()->get('productId');
    $caption = $request->json()->get('caption');

    // retrieve product
    $product = Product::getById($productId, $siteId);

    if($product != NULL) {

      // edit product
      $product->editImage($id, $caption, $siteId);

      return response('Image updated', 200);

    }
    else {
      return response('Product not found', 400);
    }

  }

  /**
   * Updates the order of images in the product
   *
   * @return Response
   */
  public static function updateOrder(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $productId = $request->json()->get('productId');
    $images = $request->json()->get('images');

    // update order in a gallery
    $product = Product::getById($productId, $siteId);

    if($productId != NULL) {

      $product->updateImageOrder($images, $siteId);


      return response('Ok', 200);
    }

    return response('Error', 400);

  }

  /**
   * Removes the product image
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
    $productId = $request->json()->get('productId');

    // update order in file
    $product = Product::getById($productId, $siteId);

    if($product != NULL) {

      // removes a product
      $product->removeImage($id, $siteId);

      return response('Image Removed', 200);

    }
    else {
      return response('Product not found. Product ID='.$productId, 400);
    }

  }

}