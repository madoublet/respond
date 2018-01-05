<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

// Encrypt/Decrypt
use Illuminate\Support\Facades\Crypt;

/**
 * Models setting
 */
class Setting {

  public $id;
  public $label;
  public $description;
  public $type;
  public $value;
  const CRYPT_PLACEHOLDER = '********';

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

        $value = $setting['value'];

        // check for encryption
        if(isset($setting['encrypted'])) {

          if($setting['encrypted'] == true && $value != '') {
            $value = Crypt::decrypt($value);
          }

        }

        return $value;

      }

    }

    return NULL;

  }


  /**
   * lists all settings as an associative array with name, value
   *
   * @param {string} siteId
   * @return {array}
   */
  public static function listAllAsAssoc($siteId) {

    $file = app()->basePath().'/resources/sites/'.$siteId.'/settings.json';

    $settings = json_decode(file_get_contents($file), true);
    $arr = array();

    foreach($settings as $setting) {

      $value = $setting['value'];

      // for encrypted settings, just return ******** when listed (this value is only decrypted in getById)
      if(isset($setting['encrypted'])) {

        if($setting['encrypted'] == true && trim($value) != '') {
          $value = Setting::CRYPT_PLACEHOLDER;
        }

      }

      $arr[$setting['id']] = $value;

    }

    return $arr;


  }

  /**
   * lists all settings
   *
   * @param {string} siteId
   * @return {array}
   */
  public static function listAll($siteId) {

    $file = app()->basePath().'/resources/sites/'.$siteId.'/settings.json';


    $settings = json_decode(file_get_contents($file), true);
    $arr = array();

    foreach($settings as &$setting) {

      $value = $setting['value'];

      // for encrypted settings, just return ******** when listed (this value is only decrypted in getById)
      if(isset($setting['encrypted'])) {

        if($setting['encrypted'] == true && trim($value) != '') {
          $setting['value'] = Setting::CRYPT_PLACEHOLDER;
        }

      }

      array_push($arr, $setting);

    }

    return $arr;

  }


  /**
   * Saves all settings
   *
   * @param {string} $name
   * @param {string} $siteId site id
   * @return Response
   */
  public static function saveAll($settings, $user, $site) {

    // encrypt new setttings that are marked to be encrypted
    foreach($settings as &$setting) {

      // check for encryption flag
      if(isset($setting['encrypted'])) {

        if($setting['encrypted'] == true && $setting['value'] != Setting::CRYPT_PLACEHOLDER) {  // encrypt new setting
          $setting['value'] = Crypt::encrypt($setting['value']);
        }
        else { // save old encrypted value

          $current_value = Setting::getById($setting['id'], $site->id);

          $setting['value'] = Crypt::encrypt($current_value);
        }

      }

    }


    // get file
    $file = app()->basePath().'/resources/sites/'.$site->id.'/settings.json';

    // get settings
    if(file_exists($file)) {

      file_put_contents($file, json_encode($settings, JSON_PRETTY_PRINT, JSON_UNESCAPED_SLASHES));

      // publish the settings for the user, site
      Publish::publishSettings($user, $site);

      return TRUE;


    }

    return FALSE;

  }

}