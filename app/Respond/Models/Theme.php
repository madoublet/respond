<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Theme;


/**
 * Models theme
 */
class Theme {


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
   * Gets a theme setting for a given $id
   *
   * @param {string} $id
   * @return {string}
   */
  public static function getById($id, $siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/theme.json';

    $settings = json_decode(file_get_contents($file), true);

    if(isset($settings[$id])) {
      return $settings[$id];
    }

    return NULL;

  }

  /**
   * lists all theme settings
   *
   * @param {string} siteId
   * @return {array}
   */
  public static function listAll($siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/theme.json';

    $settings = json_decode(file_get_contents($file), true);

    return $settings;

  }


  /**
   * Saves all theme settings
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function saveAll($settings, $user, $site) {

    // get file
    $file = app()->basePath().'/public/sites/'.$site->id.'/theme.json';

    // get settings
    if(file_exists($file)) {

      file_put_contents($file, json_encode($settings, JSON_PRETTY_PRINT, JSON_UNESCAPED_SLASHES));

      return TRUE;

    }

    return FALSE;

  }

}