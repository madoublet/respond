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

      // update settings in the pages
      $arr = Page::listAll($user, $site);

      foreach($arr as $item) {

        // get page
        $page = new Page($item);

        $path = app()->basePath().'/public/sites/'.$site->id.'/'.$page->url.'.html';

        // fix double html
        $path = str_replace('.html.html', '.html', $path);

        // init css
        $set_css = false;
        $css = '';

        if(file_exists($path)) {

          // get contents of the page
          $html = file_get_contents($path);

          // parse HTML
          $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

          // walk through settings
          foreach($settings as $setting) {

            // handle sets
            if(isset($setting['sets'])) {

              // set attribute
              if(isset($setting['attribute'])) {

                // find setting
                $els = $dom->find('['.$setting['id'].']');

                // set attribute
                foreach($els as $el) {
                  $el->setAttribute($setting['attribute'], $setting['value']);
                }

              }

              // set css
              if(isset($setting['css'])) {

                // build css string
                $set_css = true;
                $css .= str_replace('config(--'.$setting['id'].')', $setting['value'], $setting['css']);

              }

            }

          }

          // remove existing inline styles
          $styles = $dom->find('[respond-settings]');

          foreach($styles as $style) {
             $style->outertext = '';
          }

          // append style to the dom
          $head = $dom->find('head', 0);

          if($head != NULL) {
            $head->innertext = $head->innertext() . '<style respond-settings>'.$css.'</style>';
          }

          // update contents
          file_put_contents($path, $dom);

        }

      }

      return TRUE;


    }

    return FALSE;

  }

}