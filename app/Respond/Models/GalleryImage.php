<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Menu;

/**
 * Models a gallery image
 */
class GalleryImage {

  public $id;
  public $name;
  public $url;
  public $thumb;
  public $caption;

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
   * lists all images
   *
   * @param {files} $data
   * @return {array}
   */
  public static function listAll($id, $siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$id.'.json';

    $arr = array();

    if(file_exists($file)) {
      $json = json_decode(file_get_contents($file), true);

      $arr = $json['images'];
    }

    return $arr;

  }
  
  
  /**
   * Gets by id
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function getIndexById($id, $galleryId, $siteId) {

    $gallery = Gallery::getById($galleryId, $siteId);
    
    $i = 0;
    
    foreach($gallery->images as $image) {
      
      if($image['id'] === $id) {
        return $i;
      }
      
      $i++;
    }

    return $i;

  }
  

  /**
   * Adds a image
   *
   * @param {string} $id
   * @param {string} $name
   * @param {string} $caption
   * @param {string} $galleryId
   * @param {string} $siteId
   * @return {array}
   */
  public static function add($id, $name, $url, $thumb, $caption, $galleryId, $siteId) {

    $gallery = Gallery::getById($galleryId, $siteId);

    $image = array(
      'id' => $id,
      'name' => $name,
      'url' => $url,
      'thumb' => $thumb,
      'caption' => $caption
      );

    array_push($gallery->images, $image);

    $gallery->save($siteId);

    return $gallery;

  }

}