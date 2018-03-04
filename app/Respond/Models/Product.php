<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Page;

/**
 * Models a product
 */
class Product {

  public $id;
  public $name;
  public $url;
  public $description;
  public $shipped;
  public $price;
  public $file;
  public $subscription;
  public $plan;
  public $planPrice;
  public $images;
  public $options;

  /**
   * Constructs a page from an array of data
   *
   * @param {arr} $data
   */
  function __construct(array $data) {
    foreach($data as $key => $val) {
      if(property_exists(__CLASS__,$key)) {
        $this->$key = $val;
      }
    }
  }

  /**
   * lists all products
   *
   * @param {files} $data
   * @return {array}
   */
  public static function listAll($siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';

    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }

    return $data;

  }


  /**
   * Gets a product by id
   *
   * @param {string} $id
   * @param {string} $siteId site id
   * @return {Product}
   */
  public static function getById($id, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';

    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }
    else {
      return NULL;
    }

    // get setting by id
    foreach((array)$data as $product) {

      if($product['id'] === $id) {
        return new Product($product);

      }

    }

    return NULL;

  }

  /**
   * Adds a product
   *
   * @param {arr} $data
   * @param {string} $siteId site id
   * @return Response
   */
  public static function add($id, $name, $url, $description, $shipped, $price, $file, $subscription, $plan, $planPrice, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';
    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }

    // push page to array
    array_push($data, array(
        'id' => $id,
        'name' => $name,
        'url' => $url,
        'description' => $description,
        'shipped' => $shipped,
        'price' => $price,
        'file' => $file,
        'subscription' => $subscription,
        'plan' => $plan,
        'planPrice' => $planPrice,
        'images' => array(),
        'options' => array()
      ));

    // save array
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

  /**
   * Edits a product
   *
   * @param {arr} $data
   * @param {string} $siteId site id
   * @return Response
   */
  public function edit($name, $description, $shipped, $price, $file, $subscription, $plan, $planPrice, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';

    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }

    // walk through data
    foreach($data as &$product) {

      // update the product with the given ID
      if($product['id'] == $this->id) {

        $product['name'] = $name;
        $product['description'] = $description;
        $product['shipped'] = $shipped;
        $product['price'] = $price;
        $product['file'] = $file;
        $product['subscription'] = $subscription;
        $product['plan'] = $plan;
        $product['planPrice'] = $planPrice;

      }

    }

    // save $data
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

  /**
   * Removes a product
   *
   * @param {string} $siteId ID of the site
   * @return Response
   */
  public function remove($siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';

    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }

    $i = 0;

    // walk through data
    foreach($data as $product) {

      // update the product with the given ID
      if($product['id'] == $this->id) {
        unset($data[$i]);
      }

      $i++;

    }

    // prevent showing the index (e.g. "0":{})
    $data = array_values($data);

    // save $data
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

  /**
   * Adds an image to a product
   *
   * @param {arr} $data
   * @param {string} $siteId site id
   * @return Response
   */
  public function addImage($id, $name, $url, $thumb, $caption, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';
    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }

    $image = array(
              'id' => $id,
              'name' => $name,
              'url' => 'files/'.$name,
              'thumb' => 'files/thumbs/'.$name,
              'caption' => $caption
              );


    // walk through data
    foreach($data as &$product) {

      // update the product with the given ID
      if($product['id'] == $this->id) {

        if($product['images'] == NULL) {
          $product['images'] = array();
        }

        array_push($product['images'], $image);

      }

    }

    // save array
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

  /**
   * Updates the image order for a product
   *
   * @param {arr} $data
   * @param {string} $siteId site id
   * @return Response
   */
  public function updateImageOrder($images, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';
    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }

    // walk through data
    foreach($data as &$product) {

      // update the product with the given ID
      if($product['id'] == $this->id) {
        $product['images'] = $images;
      }

    }

    // save array
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

  /**
   * Removes an image for a product
   *
   * @param {string} $id
   * @param {string} $siteId site id
   * @return Response
   */
  public function removeImage($id, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';
    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }


    // walk through data
    foreach($data as &$product) {

      // update the product with the given ID
      if($product['id'] == $this->id) {

        $i = 0;

        // walk through data
        foreach($product['images'] as $image) {

          // update the product with the given ID
          if($image['id'] == $id) {
            unset($product['images'][$i]);
          }

          $i++;

        }

        $product['images'] = array_values($product['images']);

      }

    }

    // prevent showing the index (e.g. "0":{})
    $json_arr = array_values($data);

    // save array
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

  /**
   * Edits an image for a product
   *
   * @param {string} $id
   * @param {string} $caption
   * @param {string} $siteId site id
   * @return Response
   */
  public function editImage($id, $caption, $siteId) {

    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/products.json';
    $data = array();

    if(file_exists($json_file)) {
      $json = file_get_contents($json_file);
      $data = json_decode($json, true);
    }


    // walk through data
    foreach($data as &$product) {

      // update the product with the given ID
      if($product['id'] == $this->id) {

        $i = 0;

        // walk through data
        foreach($product['images'] as $image) {

          // update the product with the given ID
          if($image['id'] == $id) {
            $product['images'][$i]['caption'] = $caption;
          }

          $i++;

        }

      }

    }

    // prevent showing the index (e.g. "0":{})
    $json_arr = array_values($data);

    // save array
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));

  }

}