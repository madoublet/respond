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
 * Models a page
 */
class Page {

  public $title;
  public $description;
  public $text;
  public $keywords;
  public $callout;
  public $url;
  public $photo;
  public $thumb;
  public $language;
  public $direction;
  public $firstName;
  public $lastName;
  public $lastModifiedBy;
  public $lastModifiedDate;

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
   * Adds a page
   *
   * @param {arr} $arr array containg page information
   * @param {site} $site object
   * @param {user} $user object
   * @return Response
   */
  public static function add($data, $site, $user, $content = NULL){

    // create a new page
    $page = new Page($data);

    // create a new snippet for the page
    $dest = app()->basePath().'/public/sites/'.$site->id;
    $name = $new_name = str_replace('/', '.', $page->url);
    $fragment = $dest . '/fragments/page/' . $name . '.html';

    // avoid dupes
    $x = 1;

    while(file_exists($fragment) === TRUE) {

      // increment id and folder
      $new_name = $name.$x;
      $fragment = $dest . '/fragments/page/' . $new_name . '.html';
      $x++;

    }

    // update url
    $page->url = str_replace('.', '/', $new_name);
    $data['url'] = $page->url;

    // default fragemnt content
    $fragment_content = '';

    // get default html for a new page
    if($content == NULL) {

      // get default content
      $default_content = app()->basePath().'/public/sites/'.$site->id.'/.default.html';

      if(file_exists($default_content)) {
        $content = file_get_contents($default_content);
      }
      else {
        $content = '<html><head></head><body><p>You must specify default content in .default.html</p></body></html>';
      }

      // replace
      $content = str_replace('{{page.title}}', $page->title, $content);
      $content = str_replace('{{page.description}}', $page->description, $content);

      // set location
      $location = $dest.'/'.$page->url.'.html';

      $dir = dirname($location);

      // make directory
      if(!file_exists($dir)){
  			mkdir($dir, 0777, true);
  		}

      // place content in the file
      file_put_contents($dest.'/'.$page->url.'.html', $content);

      // parse HTML
      $dom = HtmlDomParser::str_get_html($content, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      // find fragment content
      $el = $dom->find('[role=main]');

      // get the fragment content
      if(isset($el[0])) {
        $fragment_content = $el[0]->innertext;
      }

      // find body
      $els = $dom->find('body');

      // set timestamp in head
      if(isset($els[0])) {

        $timestamp = date('Y-m-d\TH:i:s.Z\Z', time());
        $els[0]->setAttribute('data-lastmodified', $timestamp);

      }

    }

    // get text
    $text = strip_tags($fragment_content);
    $text = preg_replace("/\s+/", " ", $text);
    $text = trim($text);
    $text = preg_replace('/[[:^print:]]/', '', $text);

    // set text
    $page->text = substr($text, 0, 200);
    $data['text'] = substr($text, 0, 200);

    // set text
    $page->text = $text;
    $data['text'] = $text;
    $data['html'] = $fragment_content;

    // get base path for the site
    $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/pages.json';

    // open json
    if(file_exists($json_file)) {

      $json = file_get_contents($json_file);

      // decode json file
      $pages = json_decode($json, true);

      // push page to array
      array_push($pages, $data);

      // save array
      file_put_contents($json_file, json_encode($pages, JSON_PRETTY_PRINT));

    }

    // return the page
    return $page;

  }

  /**
   * Edits a page
   *
   * @param {arr} $arr array containg page information
   * @param {site} $site object
   * @param {user} $user object
   * @return Response
   */
  public static function edit($url, $changes, $site, $user){

    // get a reference to the page object
    $page = Page::GetByUrl($url, $site->id);

    // get page
    $location = app()->basePath().'/public/sites/'.$site->id.'/'.$url.'.html';

    if($page != NULL && file_exists($location)) {

      // get html
      $html = file_get_contents($location);

      // load the parser
      $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      // content placeholder
      $main_content = '';

      // get content
      foreach($changes as $change) {

        $selector = $change['selector'];

        // set main content
        if($selector == '[role="main"]') {
          $main_content = $change['html'];
        }

        // apply changes to the document
        $els = $dom->find($selector);

        if(isset($els[0])) {
          $els[0]->innertext = $change['html'];
        }



      }

      // remove data-ref attributes
      foreach($dom->find('[data-ref]') as $el) {
        $el->removeAttr('data-ref');
      }

      // update the page
      file_put_contents($location, $dom);

      // get text from content
      $text = strip_tags($main_content);
      $text = preg_replace("/\s+/", " ", $text);
      $text = trim($text);
      $text = preg_replace('/[[:^print:]]/', '', $text);

      // set text to main_content
      $page->text = $text;

      // saves the page
      $page->save($site, $user);

      return TRUE;

    }
    else {

      return FALSE;

    }

  }

  /**
   * Edits the settings for a page
   *
   * @param {arr} $arr array containg page information
   * @param {site} $site object
   * @param {user} $user object
   * @return Response
   */
  public static function editSettings($data, $site, $user){

    $page = Page::getByUrl($data['url'], $site->id);

    $page->title = $data['title'];
    $page->description = $data['description'];
    $page->keywords = $data['keywords'];
    $page->callout = $data['callout'];
    $page->language = $data['language'];
    $page->direction = $data['direction'];

    $page->save($site, $user);

    return TRUE;

  }

  /**
   * Removes a page
   *
   * @param {id} $id
   * @return Response
   */
  public function remove($user, $site){

    // remove the page and fragment
    $page = app()->basePath().'/public/sites/'.$site->id.'/'.$this->url.'.html';

    if(file_exists($page)) {
      unlink($page);
    }

    // refresh the JSON file
    $arr = Page::refreshJSON($user, $site);

    return TRUE;

  }

  /**
   * Saves a page
   *
   * @param {string} $url url of page
   * @return Response
   */
  public function save($site, $user) {

    // set full file path
    $file = app()->basePath() . '/public/sites/' . $site->id . '/' . $this->url . '.html';

    $html = file_get_contents($file);

    if(!empty($html)) {

      // set parser
    $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      // set title
      $els = $dom->find('title');

      if(isset($els[0])) {
        $els[0]->innertext = $this->title;
      }

      // set description
      $els = $dom->find('meta[name=description]');

      if(isset($els[0])) {
        $els[0]->content = $this->description;
      }

      // set keywords
      $els = $dom->find('meta[name=keywords]');

      if(isset($els[0])) {
        $els[0]->content = $this->keywords;
      }

      // set language and direction
      $els = $dom->find('html');

      if(isset($els[0])) {
        $els[0]->lang = $this->language;
        $els[0]->dir = $this->direction;
      }

      // photos
      $photo = '';

      // get photo
      $photos = $dom->find('[role=main] img');

      if(isset($photos[0])) {
        $photo = $photos[0]->src;
      }

      // default thumb
      $thumb = '';

      // get thumb
      if ($photo === NULL || $photo === '') {
        $photo = '';
      }
      else {
        if (substr($photo, 0, 4) === "http") {
          $thumb = $photo;
        }
        else {
          $thumb = str_replace('files/', 'files/thumbs/', $photo);
          
          // handle if the thumb is already a thumb (for galleries)
          $thumb = str_replace('thumbs/thumbs', 'thumbs/', $thumb);
        }

      }

      // find body
      $els = $dom->find('body');

      // set timestamp in head
      if(isset($els[0])) {

        $timestamp = date('Y-m-d\TH:i:s.Z\Z', time());
        $els[0]->setAttribute('data-lastmodified', $timestamp);

      }

      // set photo and thumb
      $this->photo = $photo;
      $this->thumb = $thumb;

      // set html
      $html = $dom;

      // save page
      file_put_contents($file, $html);

    }

    // set timestamp
    $timestamp = date('Y-m-d\TH:i:s.Z\Z', time());

    // edit the json file
    $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/pages.json';

    // save
    if(file_exists($json_file)) {

      $json = file_get_contents($json_file);

      // decode json file
      $pages = json_decode($json, true);

      foreach($pages as &$page){

        // update page
        if($page['url'] == $this->url) {

          $page['title'] = $this->title;
          $page['description'] = $this->description;
          $page['text'] = $this->text;
          $page['keywords'] = $this->keywords;
          $page['callout'] = $this->callout;
          $page['photo'] = $this->photo;
          $page['thumb'] = $this->thumb;
          $page['language'] = $this->language;
          $page['direction'] = $this->direction;
          $page['lastModifiedBy'] = $user->email;
          $page['lastModifiedDate'] = $timestamp;

        }

      }

      // save pages
      file_put_contents($json_file, json_encode($pages, JSON_PRETTY_PRINT));

    }

  }

  /**
   * Retrieves page data based on a url
   *
   * @param {string} $url url of page
   * @return Response
   */
  public static function getByUrl($url, $id){

    // strip any trailing .html from url
    $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

    $file = app()->basePath().'/public/sites/'.$id.'/data/pages.json';

    if(file_exists($file)) {

      $json = file_get_contents($file);

      // decode json file
      $pages = json_decode($json, true);

      foreach($pages as $page){

        if($page['url'] == $url) {

          // create a new page
          return new Page($page);

        }

      }

    }

    return NULL;

  }

  /**
   * Lists pages
   *
   * @param {User} $user
   * @param {string} $id friendly id of site (e.g. site-name)
   * @return Response
   */
  public static function listAll($user, $site){

    $arr = array();

    // get base path for the site
    $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/pages.json';

    if(file_exists($json_file)) {

      // list the contents of the json file
      $json = file_get_contents($json_file);

      $arr = json_decode($json, true);
    }
    else {

      // refresh the JSON file
      $arr = Page::refreshJSON($user, $site);
    }

    // append .html for non-friendly URLs
    if(env('FRIENDLY_URLS') === false) {

      foreach($arr as &$page) {
        $page['url'] = $page['url'].'.html';
      }

    }
    
    // sort by last modified date
    usort($arr, function($a, $b) {
        $ts1 = strtotime($a['lastModifiedDate']);
        $ts2 = strtotime($b['lastModifiedDate']);
        return $ts2 - $ts1;
    });

    return $arr;

  }

  /**
   * Lists pages
   *
   * @param {User} $user
   * @param {string} $id friendly id of site (e.g. site-name)
   * @return Response
   */
  public static function listAllBySite($siteId){

    $arr = array();

    // get base path for the site
    $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/pages.json';

    if(file_exists($json_file)) {

      // list the contents of the json file
      $json = file_get_contents($json_file);

      $arr = json_decode($json, true);
    }

    return $arr;

  }

  /**
   * Refreshes the page JSON
   *
   * @param {User} $user
   * @param {string} $id friendly id of site (e.g. site-name)
   * @return Response
   */
  public static function refreshJSON($user, $site) {

    // get base path for the site
    $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/pages.json';

    // set dir
    $dir = app()->basePath().'/public/sites/'.$site->id;

    // list files
    $files = Utilities::ListFiles($dir, $site->id,
            array('html'),
            array('plugins/',
                  'components/',
                  'css/',
                  'data/',
                  'files/',
                  'js/',
                  'locales/',
                  'fragments/',
                  'themes/'));

    // setup arrays to hold data
    $arr = array();

    foreach ($files as $file) {

        // defaults
        $title       = '';
        $description = '';
        $keywords    = '';
        $callout     = '';
        $url         = $file;
        $text        = '';
        $html = '';
        $language = 'en';
        $direction = 'ltr';
        $photo = '';
        $thumb = '';
        $lastModifiedDate = date('Y-m-d\TH:i:s.Z\Z', time());

        // set full file path
        $file = app()->basePath() . '/public/sites/' . $site->id . '/' . $file;

        $file_modified_time = filemtime($file);

        // setup timestamp as JS date
        $timestamp = date('Y-m-d\TH:i:s.Z\Z', $file_modified_time);

        // set parser
        $dom = HtmlDomParser::str_get_html(file_get_contents($file), $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

        // get title
        $els = $dom->find('title');

        if(isset($els[0])) {
          $title = $els[0]->innertext;
        }

        // get els
        $els = $dom->find('body');

         // set timestamp in head
        if(isset($els[0])) {
          $lastModifiedDate = $els[0]->getAttribute('data-lastmodified');
        }


        // get description
        $els = $dom->find('meta[name=description]');

        if(isset($els[0])) {
          $description = $els[0]->content;
        }

        // get keywords
        $els = $dom->find('meta[name=keywords]');

        if(isset($els[0])) {
          $keywords = $els[0]->content;
        }

        // get text
        $els = $dom->find('[role=main]');

        if(isset($els[0])) {
          $main_content = $els[0]->innertext;
        }

        // get the text from the content
        $text = strip_tags($main_content);
        $text = preg_replace("/\s+/", " ", $text);
        $text = trim($text);
        $text = preg_replace('/[[:^print:]]/', '', $text);

        // get photo
        $photos = $dom->find('[role=main] img');

        if(isset($photos[0])) {
          $photo = $photos[0]->src;
        }
        $thumb = '';

        if ($photo === NULL || $photo === '') {
          $photo = '';
        }
        else {
          if (substr($photo, 0, 4) === "http") {
            $thumb = $photo;
          }
          else {
            $thumb = str_replace('files/', 'files/thumbs/', $photo);
            $thumb = str_replace('thumbs/thumbs', 'thumbs/', $thumb);
          }

        }

        // get language and direction
        $els = $dom->find('html');

        if(isset($els[0])) {
          $language = $els[0]->lang;
          $direction = $els[0]->dir;
        }

        // cleanup url
        $url = ltrim($url, '/');

        // strip any trailing .html from url
        $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

        // setup data
        $data = array(
            'title' => $title,
            'description' => $description,
            'text' => $text,
            'keywords' => $keywords,
            'callout' => $callout,
            'url' => $url,
            'photo' => $photo,
            'thumb' => $thumb,
            'language' => $language,
            'direction' => $direction,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'lastModifiedBy' => $user->email,
            'lastModifiedDate' => $timestamp
        );

        // push to array
        if(substr($url, 0, strlen('.default')) !== '.default') {
          array_push($arr, $data);
        }

    }

    // encode arr
    $content = json_encode($arr, JSON_PRETTY_PRINT);

    // update content
    file_put_contents($json_file, $content);

    return $arr;

  }


}