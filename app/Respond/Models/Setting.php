<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

/**
 * Models setting
 */
class Setting {

  public $id;
  public $label;
  public $description;
  public $type;
  public $value;

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
   * Gets a setting for a given $id
   *
   * @param {string} $id
   * @return {string}
   */
  public static function getById($id, $siteId) {

    $file = app()->basePath().'/resources/sites/'.$siteId.'/settings.json';

    $settings = json_decode(file_get_contents($file), true);

    // get setting by id
    foreach($settings as $setting) {

      if($setting['id'] === $id) {

        return $setting['value'];

      }

    }

    return NULL;

  }


  /**
   * lists all settings
   *
   * @param {files} $data
   * @return {array}
   */
  public static function listAll($siteId) {

    $file = app()->basePath().'/resources/sites/'.$siteId.'/settings.json';

    return json_decode(file_get_contents($file), true);

  }


  /**
   * Saves all settings
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function saveAll($settings, $user, $site) {

    // get file
    $file = app()->basePath().'/resources/sites/'.$site->id.'/settings.json';

    // get settings
    if(file_exists($file)) {

      file_put_contents($file, json_encode($settings, JSON_PRETTY_PRINT));

      // publish the settings for the user, site
      Publish::publishSettings($user, $site);

      return TRUE;


    }

    return FALSE;

  }

}