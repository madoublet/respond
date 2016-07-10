<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\MenuItem;

/**
 * Models a menu
 */
class Menu {

  public $id;
  public $name;
  public $items;

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
   * lists all files
   *
   * @param {files} $data
   * @return {array}
   */
  public static function listAll($siteId) {

    $dir = app()->basePath().'/public/sites/'.$siteId.'/data/menus/';
    $exts = array('json');

    $files = Utilities::listFiles($dir, $siteId, $exts);
    $arr = array();

    foreach($files as $file) {

      $path = app()->basePath().'/public/sites/'.$siteId.'/'.$file;

      if(file_exists($path)) {

        $json = json_decode(file_get_contents($path), true);

        $id = str_replace('.json', '', $file);
        $id = str_replace('data/menus/', '', $id);
        $id = str_replace('/', '', $id);

        array_push($arr, array(
          'id' => $id,
          'name' => $json['name']
          ));

      }

    }

    return $arr;

  }

  /**
   * Lists all menus and items
   *
   * @param {string} $siteId
   * @return {array}
   */
  public static function listExtended($siteId) {

    $menus = Menu::listAll($siteId);
    $i = 0;

    foreach($menus as $menu) {

      $menus[$i]['items'] = MenuItem::listAll($menu['id'], $siteId);

      $i++;
    }

    return $menus;

  }



  /**
   * Gets by id
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function getById($id, $siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/data/menus/'.$id.'.json';

    $items = array();

    if(file_exists($file)) {

      $json = json_decode(file_get_contents($file), true);

      return new Menu($json);

    }

    return NULL;

  }

  /**
   * Adds a menu
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
    $folder = app()->basePath().'/public/sites/'.$siteId.'/data/menus/'.$id.'.json';

    while(file_exists($folder) === TRUE) {

      // increment id and folder
      $new_id = $id.$x;
      $folder = app()->basePath().'/public/sites/'.$siteId.'/data/menus/'.$new_id.'.json';
      $x++;

    }

    // set id to new_id
    $id = $new_id;

    // get file
    $dir = app()->basePath().'/public/sites/'.$siteId.'/data/menus/';
    $file = app()->basePath().'/public/sites/'.$siteId.'/data/menus/'.$new_id.'.json';

    $items = array();

    if(!file_exists($file)) {

      // get menu
      $menu = new Menu(array(
        'id' => $new_id,
        'name' => $name,
        'items' => array()
      ));

      // create gallery
      if(!file_exists($dir)) {
  			mkdir($dir, 0777, true);
  		}

      file_put_contents($file, json_encode($menu, JSON_PRETTY_PRINT));

      return $menu;

    }

    return NULL;

  }

  /**
   * Saves a menu
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public function save($siteId) {

    // get file
    $file = app()->basePath().'/public/sites/'.$siteId.'/data/menus/'.$this->id.'.json';

    if(file_exists($file)) {

      file_put_contents($file, json_encode($this, JSON_PRETTY_PRINT));


      return TRUE;

    }

    return NULL;

  }


  /**
   * Removes a menu
   *
   * @param {name} $name
   * @return Response
   */
  public function remove($siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/data/menus/'.$this->id.'.json';

    if(file_exists($file)) {
      unlink($file);

      return TRUE;
    }

    return FALSE;

  }

}