<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Illuminate\Http\Response;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Page;

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
        'description' => $product->description,
        'url' => $product->url,
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

    // get site, user and timestamp
    $site = Site::getById($siteId);
    $user = User::getByEmail($email, $siteId);
    $timestamp = date('Y-m-d\TH:i:s.Z\Z', time());

    // get url, name and description
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');
    $url = $request->json()->get('url');
    $description = $request->json()->get('description');
    $shipped = $request->json()->get('shipped');
    $price = $request->json()->get('price');
    $file = $request->json()->get('file');
    $subscription = $request->json()->get('subscription');
    $plan = $request->json()->get('plan');
    $planPrice = $request->json()->get('planPrice');

    $product = Product::getById($id, $siteId);

    if($product == NULL) {

      // add product
      Product::add($id, $name, $url, $description, $shipped, $price, $file, $subscription, $plan, $planPrice, $siteId);

      // set page data
      $data = array(
        'title' => $name,
        'description' => $description,
        'text' => '',
        'keywords' => '',
        'tags' => '',
        'callout' => '',
        'url' => $url,
        'photo' => '',
        'thumb' => '',
        'language' => 'en',
        'direction' => 'ltr',
        'firstName' => $user->firstName,
        'lastName' => $user->lastName,
        'lastModifiedBy' => $user->email,
        'lastModifiedDate' => $timestamp,
        'template' => 'product'
      );

      $replace = array(
        '{{product.id}}' =>  $id
      );

      // add a page
      $page = Page::add($data, $site, $user, $replace);

      if($page != NULL) {

        // re-publish plugins
        Publish::publishPluginsForPage($page, $user, $site);

        // re-publish site map
        Publish::publishSiteMap($user, $site);

        // re-publish the settings
        Publish::publishSettings($user, $site);

        // return OK
        return response('Product added', 200);

      }
      else {
        return response('Product not created successfully', 400);
      }


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

    // get the site
    $site = Site::getById($siteId);
    $user = User::getByEmail($email, $siteId);

    // get url, title and description
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');
    $description = $request->json()->get('description');
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
      $product->edit($name, $description, $shipped, $price, $file, $subscription, $plan, $planPrice, $siteId);

      // update page
      if($product->url != '' && $product->url != NULL) {

        // update name and description in pages
        $page = Page::getByUrl($product->url, $siteId);

        if($page != NULL) {

          $selectors = array(
            '.page-title' => $name,
            '.page-description' => $description
          );

          $page->setContent($selectors, $siteId);

          // republish plugins for page
          Publish::publishPluginsForPage($page, $user, $site);
        }

      }

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

    // get the site
    $site = Site::getById($siteId);
    $user = User::getByEmail($email, $siteId);

    // name, items
    $id = $request->json()->get('id');

    // update order in file
    $product = Product::getById($id, $siteId);

    if($product != NULL) {

      // removes a product
      $product->remove($siteId);

      // update name and description in pages
      $page = Page::getByUrl($product->url, $siteId);

      if($page != NULL) {
        $page->remove($user, $site);

        // re-publish site map
        Publish::publishSiteMap($user, $site);
      }

      return response('Product Removed', 200);

    }
    else {
      return response('Product not found', 400);
    }

  }

}