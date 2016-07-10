<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\GalleryImage;

/**
 * Models a gallery
 */
class Gallery {

  public $id;
  public $name;
  public $images;

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
   * @param {images} $data
   * @return {array}
   */
  public static function listAll($siteId) {

    $dir = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/';
    $exts = array('json');

    $arr = array();

    if(file_exists($dir)) {

      $files = Utilities::listFiles($dir, $siteId, $exts);
      $arr = array();

      foreach($files as $file) {

        $path = app()->basePath().'/public/sites/'.$siteId.'/'.$file;

        if(file_exists($path)) {

          $json = json_decode(file_get_contents($path), true);

          $id = str_replace('.json', '', $file);
          $id = str_replace('data/galleries/', '', $id);
          $id = str_replace('/', '', $id);

          array_push($arr, array(
            'id' => $id,
            'name' => $json['name']
            ));

        }

      }

    }

    return $arr;

  }

  /**
   * Lists all galleries and images
   *
   * @param {string} $siteId
   * @return {array}
   */
  public static function listExtended($siteId) {

    $galleries = Gallery::listAll($siteId);
    $i = 0;

    foreach($galleries as $gallery) {

      $galleries[$i]['images'] = GalleryImage::listAll($gallery['id'], $siteId);

      $i++;
    }

    return $galleries;

  }

  /**
   * Gets by id
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function getById($id, $siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$id.'.json';

    $items = array();

    if(file_exists($file)) {

      $json = json_decode(file_get_contents($file), true);

      return new Gallery($json);

    }

    return NULL;

  }

  /**
   * Adds a gallery
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function add($name, $siteId) {

    // build a name
	  $id = strtolower($name);

    // replaces all spaces with hyphens
    $id = str_replace(' ', '-', $id);

    // replaces all spaces with hyphens
    $id = $new_id =  preg_replace('/[^A-Za-z0-9\-]/', '', $id);

    // find a unique $id (e.g. myid, myid1, myid2, etc.)
    $x = 1;
    $folder = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$id.'.json';

    while(file_exists($folder) === TRUE) {

      // increment id and folder
      $new_id = $id.$x;
      $folder = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$new_id.'.json';
      $x++;

    }

    // set id to new_id
    $id = $new_id;

    // get file
    $dir = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/';
    $file = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$new_id.'.json';

    $items = array();

    if(!file_exists($file)) {

      // get form
      $gallery = new Gallery(array(
        'id' => $new_id,
        'name' => $name,
        'images' => array()
      ));

      // create gallery
      if(!file_exists($dir)) {
  			mkdir($dir, 0777, true);
  		}

      // add file
      file_put_contents($file, json_encode($gallery, JSON_PRETTY_PRINT));

      return $gallery;

    }

    return NULL;

  }

  /**
   * Saves a gallery
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public function save($siteId) {

    // get file
    $file = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$this->id.'.json';

    if(file_exists($file)) {

      file_put_contents($file, json_encode($this, JSON_PRETTY_PRINT));

      return TRUE;

    }

    return NULL;

  }


  /**
   * Removes a gallery
   *
   * @param {name} $name
   * @return Response
   */
  public function remove($siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/data/galleries/'.$this->id.'.json';

    if(file_exists($file)) {
      unlink($file);

      return TRUE;
    }

    return FALSE;

  }

}