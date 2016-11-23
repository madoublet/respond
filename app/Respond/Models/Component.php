<?php

namespace App\Respond\Models;

// Respond libraries
use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;
use App\Respond\Models\Site;
use App\Respond\Models\User;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

/**
 * Models a component
 */
class Component {

  public $title;
  public $url;

  public static $ISO8601 = "Y-m-d\TH:i:sO";

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
   * Adds a component
   *
   * @param {arr} $arr array containg page information
   * @param {site} $site object
   * @param {user} $user object
   * @return Response
   */
  public static function add($data, $site, $user, $content = NULL){

    // create a new page
    $component = new Component($data);

    // create a new snippet for the page
    $dest = app()->basePath().'/public/sites/'.$site->id;
    $name = $new_name = str_replace('/', '.', $component->url);

    // avoid dupes
    $x = 1;

    // update url
    $component->url = str_replace('.', '/', $new_name);
    $data['url'] = $component->url;

    // default fragemnt content
    $content = '';

    // get default html for a new page
    if($content == NULL) {

      // get template
      $template_file = app()->basePath().'/public/sites/'.$site->id.'/templates/default.html';

      // default (if all else fails)
      $content = '<html><head></head><body><p>You must specify default content in templates/default.html</p></body></html>';

      if(file_exists($template_file)) {

        // new page content
        $content = file_get_contents($template_file);

      }
      else { // fall back to the old .default.html file for backwards compatibility

        // get default content
        $default_content = app()->basePath().'/public/sites/'.$site->id.'/.default.html';

        // get default content
        if(file_exists($default_content)) {
          $content = file_get_contents($default_content);
        }

      }

      // replace
      $content = str_replace('{{page.title}}', "New Component", $content);
      $content = str_replace('{{page.description}}', "Description for a new component.", $content);

      // set location
      $location = $dest.'/'.$component->url.'.html';

      $dir = dirname($location);

      // make directory
      if(!file_exists($dir)){
  			mkdir($dir, 0777, true);
  		}

  		// parse HTML
      $dom = HtmlDomParser::str_get_html($content, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      // find fragment content
      $el = $dom->find('[role=main]', 0);

      // set main
      if(isset($el)) {
        file_put_contents($dest.'/'.$component->url.'.html', $el->innertext);
      }

    }

    // return the component
    return $component;

  }

  /**
   * Edits a component
   *
   * @param {arr} $arr array containg page information
   * @param {site} $site object
   * @param {user} $user object
   * @return Response
   */
  public static function edit($url, $changes, $site, $user){

    // get page
    $location = app()->basePath().'/public/sites/'.$site->id.'/'.$url.'.html';

    // get content
    $html = $changes[0]['html'];

    $timestamp = date("Y-m-d\TH:i:sO", time());

    $meta = array(
            'url' => $url,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'lastModifiedBy' => $user->email,
            'lastModifiedDate' => $timestamp
          );

    // inject plugins in the component
    $dom = Publish::injectPluginHTML($html, $user, $site, $meta);

    // save
    file_put_contents($location, $dom);

    return TRUE;
  }

  /**
   * Removes a component
   *
   * @param {id} $id
   * @return Response
   */
  public static function remove($url, $user, $site){

    // remove the page and fragment
    $component = app()->basePath().'/public/sites/'.$site->id.'/components/'.$url;

    if(file_exists($component)) {
      unlink($component);
    }

    return TRUE;

  }
  /**
   * Lists components
   *
   * @param {string} $siteId
   * @return Response
   */
  public static function listAll($siteId){

    // set dir
    $dir = app()->basePath().'/public/sites/'.$siteId.'/components';

    $arr = array();

    // make the directory if it does not exist
    if(!file_exists($dir)) {
      mkdir($dir);
    }

    // list files
    $files = Utilities::ListFiles($dir, $siteId,
            array('html'),
            array());


    foreach($files as $file) {

      $name = basename($file);
      $name = str_replace(".html", "", $name);
      $location = str_replace("components/", "", $file);

      array_push($arr, array(
        "title" => $name,
        "url" => $location,
      ));


    }

    return $arr;

  }


}