<?php

namespace App\Respond\Models;

// Respond libraries
use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;
use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Setting;

// AMP
use Lullabot\AMP\AMP;
use Lullabot\AMP\Validate\Scope;

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
  public $tags;
  public $callout;
  public $url;
  public $photo;
  public $thumb;
  public $location;
  public $language;
  public $direction;
  public $customHeader;
  public $customFooter;
  public $firstName;
  public $lastName;
  public $lastModifiedBy;
  public $lastModifiedDate;
  public $template;

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

    // fallback for location
    if(isset($this->location) === false) {
      $this->location = '';
    }

    // fallback for tags
    if(isset($this->tags) === false) {
      $this->tags = '';
    }

    // fallback for customHeader
    if(isset($this->customHeader) === false) {
      $this->customHeader = '';
    }

    // fallback for customFooter
    if(isset($this->customFooter) === false) {
      $this->customFooter = '';
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

    // avoid dupes
    $x = 1;

    // update url
    $page->url = str_replace('.', '/', $new_name);
    $data['url'] = $page->url;

    // default fragemnt content
    $content = '';

    // get default html for a new page
    if($content == NULL) {

      // get template
      $template_file = app()->basePath().'/public/sites/'.$site->id.'/templates/'.$page->template.'.html';

      // default (if all else fails)
      $content = '<html><head></head><body><p>You must specify default content in .default.html</p></body></html>';

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

        // set template to blank
        $page->template = '';

      }

      // replace
      $content = str_replace('{{page.title}}', $page->title, $content);
      $content = str_replace('{{page.description}}', $page->description, $content);
      $content = str_replace('{{page.customHeader}}', $page->customHeader, $content);
      $content = str_replace('{{page.customFooter}}', $page->customFooter, $content);

      // set location
      $location = $dest.'/'.$page->url.'.html';

      $dir = dirname($location);

      // make directory
      if(!file_exists($dir)){
  			mkdir($dir, 0777, true);
  		}

      // parse HTML
      $dom = HtmlDomParser::str_get_html($content, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      // find fragment content
      $el = $dom->find('[role=main]');

      // get the component content
      if(isset($el[0])) {
        $content = $el[0]->innertext;
      }

      // find body
      $els = $dom->find('body');

      // set timestamp in head
      if(isset($els[0])) {

        $timestamp = date(Page::$ISO8601, time());
        $els[0]->setAttribute('data-lastmodified', $timestamp);
        $els[0]->setAttribute('data-template', $page->template);
      }

      // update base
      $base = $dom->find('base', 0);

      if(isset($base)) {

        $new_base = '';

        $dir_count = substr_count($page->url, '/');

        for($x=0; $x<$dir_count; $x++) {
          $new_base .= '../';
        }

        $base->setAttribute('href', $new_base);
      }


      // place content in the file
      file_put_contents($dest.'/'.$page->url.'.html', $dom);

    }

    // get text
    $text = strip_tags($content);
    $text = preg_replace("/\s+/", " ", $text);
    $text = trim($text);
    $text = preg_replace('/[[:^print:]]/', '', $text);

    // set text
    $page->text = substr($text, 0, 200);
    $data['text'] = substr($text, 0, 200);

    // set text
    $page->text = $text;
    $data['text'] = $text;

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

      // check for body
      $el = $dom->find('body', 0);

      // determine if it is a component
      if(isset($el)) {

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

        // update the page
        file_put_contents($location, $dom);

        // get text from content
        $text = strip_tags($main_content);
        $text = preg_replace("/\s+/", " ", $text);
        $text = trim($text);
        $text = preg_replace('/[[:^print:]]/', '', $text);

        // set text to main_content
        $page->text = $text;

      }
      else {

        // for components, save the change out to the file
        if(isset($changes[0])) {

          $content = $changes[0]['html'];

          file_put_contents($location, $content);

        }

      }

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
    $page->tags = $data['tags'];
    $page->callout = $data['callout'];
    $page->language = $data['language'];
    $page->direction = $data['direction'];
    $page->template = $data['template'];
    $page->customHeader = $data['customHeader'];
    $page->customFooter = $data['customFooter'];
    $page->photo = $data['photo'];
    $page->thumb = $data['thumb'];
    $page->location = $data['location'];

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
    $page_location = app()->basePath().'/public/sites/'.$site->id.'/'.$this->url.'.html';

    if(file_exists($page_location)) {
      unlink($page_location);
    }

    // get base path for the site
    $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/pages.json';

    if (file_exists($json_file)) {

      $json = file_get_contents($json_file);
      $pages = json_decode($json);

      $i = 0;

      foreach($pages as $page) {

        if($this->url == $page->url) {
          unset($pages[$i]);
        }

        $i+=1;

      }

      // prevent showing the index (e.g. "0":{})
      $json_arr = array_values($pages);

      // re-encode json
      $json_text = json_encode($json_arr);

      file_put_contents($json_file, $json_text);

    }

    return TRUE;

  }

  /**
   * True-up the HTML with the template
   *
   * @param {string} $url url of page
   * @return Response
   */
  public function injectTemplate($page_html, $site, $user) {

    $template_file = $dir = app()->basePath().'/public/sites/'.$site->id.'/templates/'.$this->template.'.html';

    if(file_exists($template_file)) {

      // get template html
      $template_html = file_get_contents($template_file);

      // default full_url
      $full_url = $this->url;

      // try to get url setting
      $site_url = Setting::getById('url', $site->id);

      if(isset($site_url)) {

        // build page url
        $full_url = $site_url.'/'.$this->url;

        // append .html for non friendlly urls
        if($site->supportsFriendlyUrls === false) {
          $full_url .= '.html';
        }

      }

      $full_photo_url = $this->photo;

      if(isset($site_url)) {

        // build page url
        $full_photo_url = $site_url.'/'.$this->photo;

      }

      $full_thumb_url = $this->thumb;

      if(isset($site_url)) {

        // build page url
        $full_thumb_url = $site_url.'/'.$this->photo;

      }

      // replace name and description
      $template_html = str_replace('{{page.title}}', $this->title, $template_html);
      $template_html = str_replace('{{page.description}}', $this->description, $template_html);
      $template_html = str_replace('{{page.keywords}}', $this->keywords, $template_html);
      $template_html = str_replace('{{page.language}}', $this->language, $template_html);
      $template_html = str_replace('{{page.direction}}', $this->direction, $template_html);
      $template_html = str_replace('{{page.tags}}', $this->tags, $template_html);
      $template_html = str_replace('{{page.callout}}', $this->callout, $template_html);
      $template_html = str_replace('{{page.url}}', $this->url, $template_html);
      $template_html = str_replace('{{page.fullUrl}}', $full_url, $template_html);
      $template_html = str_replace('{{page.photoUrl}}', $this->photo, $template_html);
      $template_html = str_replace('{{page.fullPhotoUrl}}', $full_photo_url, $template_html);
      $template_html = str_replace('{{page.thumbUrl}}', $this->thumb, $template_html);
      $template_html = str_replace('{{page.fullThumbUrl}}', $full_thumb_url, $template_html);
      $template_html = str_replace('{{page.customHeader}}', $this->customHeader, $template_html);
      $template_html = str_replace('{{page.customFooter}}', $this->customFooter, $template_html);
      $template_html = str_replace('{{page.location}}', $this->location, $template_html);

      // set parser
      $page_dom = HtmlDomParser::str_get_html($page_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      // find main content
      $el = $page_dom->find('[role=main]');
      $main_content = '';

      // get the main content
      if(isset($el[0])) {
        $main_content = $el[0]->innertext;
      }

      // get template dom
      $template_dom = HtmlDomParser::str_get_html($template_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

      $el = $template_dom->find('[role=main]');

      if(isset($el[0])) {
        $el[0]->innertext = $main_content;
      }

      return $template_dom;

    }
    else {
      return NULL;
    }

  }


  /**
   * Saves a page
   *
   * @param {string} $url url of page
   * @return Response
   */
  public function save($site, $user) {

    // set full file path
    $file = app()->basePath() . '/public/sites/' . $site->id . '/' . $this->url;

    // strip .html
    $file = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file);

    // add .html
    $file = $file.'.html';

    $html = file_get_contents($file);

    // true-up the HTML by injecting the template back into it
    $combined_html = $this->injectTemplate($html, $site, $user);

    if($combined_html != NULL) {
      $html = $combined_html->save();
    }

    if(!empty($html)) {

      // set parser
      $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);


      // find body
      $els = $dom->find('body');

      // set timestamp, template, tags in head
      if(isset($els[0])) {

        $timestamp = date(Page::$ISO8601, time());
        $els[0]->setAttribute('data-lastmodified', $timestamp);

        if(isset($this->template)) {
          $els[0]->setAttribute('data-template', $this->template);
        }

        if(isset($this->tags)) {
          $els[0]->setAttribute('data-tags', $this->tags);
        }

      }

      // update base
      $base = $dom->find('base', 0);

      if(isset($base)) {

        $new_base = '';

        $dir_count = substr_count($this->url, '/');

        for($x=0; $x<$dir_count; $x++) {
          $new_base .= '../';
        }

        $base->setAttribute('href', $new_base);
      }

      // set html
      $html = $dom;

      // save page
      file_put_contents($file, $html);

    }

    // set timestamp
    $timestamp = date(Page::$ISO8601, time());

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

          $template = "";
          if(isset($this->template)) {
            $template = $this->template;
          }

          $page['title'] = $this->title;
          $page['description'] = $this->description;
          $page['text'] = $this->text;
          $page['keywords'] = $this->keywords;
          $page['tags'] = $this->tags;
          $page['callout'] = $this->callout;
          $page['photo'] = $this->photo;
          $page['thumb'] = $this->thumb;
          $page['location'] = $this->location;
          $page['language'] = $this->language;
          $page['direction'] = $this->direction;
          $page['lastModifiedBy'] = $user->email;
          $page['lastModifiedDate'] = $timestamp;
          $page['template'] = $template;
          $page['customHeader'] = $this->customHeader;
          $page['customFooter'] = $this->customFooter;

        }

      }

      // save pages
      file_put_contents($json_file, json_encode($pages, JSON_PRETTY_PRINT));

    }

    // republish settings
    Publish::publishSettingsForPage($this, $user, $site);

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
    if($site->supportsFriendlyUrls === false) {

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
   * Lists pages extended
   *
   * @param {User} $user
   * @param {string} $id friendly id of site (e.g. site-name)
   * @return Response
   */
  public static function listExtended($user, $site){

    $arr = Page::listAll($user, $site);

    $base_url = app()->basePath().'/public/sites/'.$site->id.'/';

    foreach($arr as &$page) {

      $file_url = $base_url.$page['url'];

      // strip any trailing .html from url
      $file_url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file_url);

      // add html
      $file_url .= '.html';

      $html = '';

      // check if file exists
      if(file_exists($file_url)) {

        // get dom
        $dom = HtmlDomParser::str_get_html(file_get_contents($file_url), $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

        // fix 500 error
        if($dom != NULL){

          // search for [role=main]
          $els = $dom->find('[role=main]');

          // get contents of [role=main]
          if(isset($els[0])) {
            $html = $els[0]->innertext;
          }

        }
      }

      $page['html'] = $html;

    }

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
                  'templates/',
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
        $tags = '';
        $callout     = '';
        $url         = $file;
        $text        = '';
        $html = '';
        $language = 'en';
        $direction = 'ltr';
        $photo = '';
        $thumb = '';
        $location = '';
        $lastModifiedDate = date(Page::$ISO8601, time());
        $template = 'default';

        // set full file path
        $file = app()->basePath() . '/public/sites/' . $site->id . '/' . $file;

        $file_modified_time = filemtime($file);

        // setup timestamp as JS date
        $timestamp = date(Page::$ISO8601, $file_modified_time);

        // set parser
        $dom = HtmlDomParser::str_get_html(file_get_contents($file), $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

        // get title
        $els = $dom->find('title');

        if(isset($els[0])) {
          $title = $els[0]->innertext;
        }

        // get els
        $els = $dom->find('body');

        // default
        $lastModifiedDate = date("Y-m-d\TH:i:sO", time());

        // get timestamp in body [data-lastmodified]
        if(isset($els[0])) {
          $attr = $els[0]->getAttribute('data-lastmodified');

          if($attr !== FALSE) {
            $lastModifiedDate = $attr;
          }
        }

        // get template
        if(isset($els[0])) {

          // try to get the template attribute
          if($els[0]->getAttribute('data-template') !== FALSE) {
            $template = $els[0]->getAttribute('data-template');
          }
          else {
            $template = app()->basePath().'/public/sites/'.$site->id.'/templates/default.html';

            // set template to default
            if(file_exists($template)) {
              $template = 'default';
            }

          }
        }

        // get tags
        if(isset($els[0])) {
          $attr = $els[0]->getAttribute('data-tags');

          if($attr !== FALSE) {
            $tags = $attr;
          }
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
        $text = '';

        $els = $dom->find('[role=main]');

        if(isset($els[0])) {
          $main_content = $els[0]->innertext;

          // get the text from the content
          $text = strip_tags($main_content);
          $text = preg_replace("/\s+/", " ", $text);
          $text = trim($text);
          $text = preg_replace('/[[:^print:]]/', '', $text);
        }

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

          $thumb_file = app()->basePath() . '/public/sites/' . $site->id . '/'.$thumb;

          // check to see if it exists
          if(!file_exists($thumb_file)) {
            $thumb = '';
          }

        }

        // get map
        $maps = $dom->find('[type=map]');
        $location = "";

        // get address
        if(isset($maps[0])) {
          if(isset($maps[0]->address)) {
            $location = $maps[0]->address;
          }
        }

        // get language and direction
        $els = $dom->find('html');

        if(isset($els[0])) {
          $language = $els[0]->lang;
          $direction = $els[0]->dir;
        }

        // check for body tag
        $els = $dom->find('body');

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
            'tags' => $tags,
            'callout' => $callout,
            'url' => $url,
            'photo' => $photo,
            'thumb' => $thumb,
            'location' => $location,
            'language' => $language,
            'direction' => $direction,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'lastModifiedBy' => $user->email,
            'lastModifiedDate' => $lastModifiedDate,
            'template' => $template
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