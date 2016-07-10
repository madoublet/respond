<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;

use App\Respond\Libraries\Publish;

/**
 * Models a file
 */
class File {

  public $name;

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
   * Lists images for the site
   *
   * @param {sttring} $id
   */
  public static function ListImages($id) {

    $dir = app()->basePath().'/public/sites/'.$id.'/files';

    // list files
    $arr = Utilities::ListFiles($dir, $id,
            array('png', 'jpg', 'gif', 'svg'),
            array('files/thumb/',
                  'files/thumbs/'));

    return $arr;

  }

  /**
   * Lists files for the site
   *
   * @param {string} $id
   */
  public static function ListFiles($id) {

    $dir = app()->basePath().'/public/sites/'.$id.'/files';

    // list allowed types
    $exts = explode(',', env('ALLOWED_FILETYPES'));

    // list files
    $arr = Utilities::ListFiles($dir, $id,
            $exts,
            array('files/thumb/',
                  'files/thumbs/'));

    return $arr;

  }
  
  /**
   * Removes a file
   *
   * @param {string} $fileName
   * @return Response
   */
  public static function Remove($name, $id) {

    // remove the page and fragment
    $file = app()->basePath().'/public/sites/'.$id.'/files/'.$name;
    $thumb = app()->basePath().'/public/sites/'.$id.'/files/thumbs/'.$name;

    if(file_exists($file)) {
      unlink($file);
    }
    
    if(file_exists($thumb)) {
      unlink($thumb);
    }
    
    return TRUE;

  }

}