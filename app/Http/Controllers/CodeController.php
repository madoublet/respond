<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Alchemy\Zippy\Zippy;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Page;

// DOM parser
use KubAT\PhpSimple\HtmlDomParser;

class CodeController extends Controller
{
    /**
     * Lists all code for a given type
     *
     * @return Response
     */
    public function listFiles(Request $request)
    {

      // get request data
      $email = $request->input('auth-email');
      $siteId = $request->input('auth-id');

      // get dir
      $dir = $request->input('dir');

      // clear out dot files
      $dir = str_replace('.', '', $dir);

      // get site
      $site = Site::getById($siteId);

      $arr = array();

      // set dir
      $site_dir = app()->basePath().'/public/sites/'.$site->id.$dir;

      // get directory
      $paths = array_slice(scandir($site_dir), 2);

      foreach($paths as $path) {

        // get full path
        $full_path = $site_dir.'/'.$path;

        // get extension
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $ext = strtoupper($ext);

        // default is_editable
        $is_editable = FALSE;

        // determine if editable
        if($ext == 'CSS' || $ext == 'JS' || $ext == 'HTML' || $ext == 'HTACCESS' || $ext == 'JSON' || $ext == 'webmanifest' || $ext == 'MD' || $ext == 'TXT' || $ext == 'XML') {
          $is_editable = TRUE;
        }

        if(is_dir($full_path)) {

          array_push($arr, array(
            'path' => $path,
            'isFolder' => true,
            'isEditable' => $is_editable
          ));

        }
        else {
          array_push($arr, array(
            'path' => $path,
            'isFolder' => false,
            'isEditable' => $is_editable
          ));
        }

      }

      // return files
      return response()->json($arr);

    }


    /**
     * Retrieves code to edit
     *
     * @return Response
     */
    public function retrieve(Request $request)
    {

      // get request data
      $email = $request->input('auth-email');
      $id = $request->input('auth-id');
      $isPage = false;

      // get url
      $url = $request->input('url');

      // trim leading slash
      $url = ltrim($url,'/');

      // get path
      $path = app()->basePath('public/sites/'.$id.'/'.$url);
      $ext = pathinfo($path, PATHINFO_EXTENSION);
      $ext = strtoupper($ext);

      // treat as a a page
      if($ext == 'HTML' && substr($url, 0, strlen("components/")) !== "components/" && substr($url, 0, strlen("templates/")) !== "templates/" && substr($url, 0, strlen("plugins/")) !== "plugins/") {
        $isPage = true;
      }

      if($isPage == true) {

        // strip any trailing .html from url
        $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

        // add .html back in
        $url .= '.html';

        // build path
        $path = app()->basePath('public/sites/'.$id.'/'.$url);

         // return OK
        if(file_exists($path) == true) {

          $code = file_get_contents($path);

          // set parser
          $dom = HtmlDomParser::str_get_html($code, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

          // find main content
          $main = $dom->find('[role=main]');
          $content = '';

          // remove inner part of contents
          $els = $dom->find('div');

          // clear out the contents of the plugin
          foreach($els as $el) {
            if(isset($el->{'respond-plugin'})) {
              $el->innertext = '';
            }
          }

          // get the main content
          if(isset($main[0])) {
            $content = $main[0]->innertext;
          }


          return response($content, 200);
        }
        else {
          return response('File does not exist', 400);
        }

      }
      else {
        // build path
        $path = app()->basePath('public/sites/'.$id.'/'.$url);

         // return OK
        if(file_exists($path) == true) {

          $code = file_get_contents($path);

          return response($code, 200);
        }
        else {
          return response('File does not exist', 400);
        }

      }

      return response('Retrieve error', 400);

    }

    /**
     * Saves code
     *
     * @return Response
     */
    public function save(Request $request)
    {

      // get request data
      $email = $request->input('auth-email');
      $id = $request->input('auth-id');

      // get site and user
      $site = Site::getById($id);
      $user = User::getByEmail($email);

      // get url and type
      $value = $request->json()->get('value');
      $url = $request->json()->get('url');

      // trim leading slash
      $url = ltrim($url,'/');

      // get path and extension
      $path = app()->basePath('public/sites/'.$id.'/'.$url);
      $ext = pathinfo($path, PATHINFO_EXTENSION);
      $ext = strtoupper($ext);

      // figure out the type
      $type = "unknown";

      if($ext == 'HTML' && substr($url, 0, strlen("components/")) !== "components/" && substr($url, 0, strlen("templates/")) !== "templates/" && substr($url, 0, strlen("plugins/")) !== "plugins/") {
        $type = "page";
      }
      else if ( $ext == 'HTML' && substr($url, 0, strlen("components/")) === "components/"){
        $type = "component";
      }
      else if ( $ext == 'HTML' && substr($url, 0, strlen("templates/")) === "templates/"){
        $type = "template";
      }
      else if ( ($ext == 'HTML' || $ext == 'PHP') && substr($url, 0, strlen("plugins/")) === "plugins/"){
        $type = "plugin";
      }
      else if ( ($ext == 'CSS' || $ext == 'PHP') && substr($url, 0, strlen("css/")) === "css/"){
        $type = "stylesheet";
      }
      else if ( ($ext == 'JS' || $ext == 'PHP') && substr($url, 0, strlen("js/")) === "js/"){
        $type = "script";
      }

      // save a page
      if($type == "page") {

        // strip any trailing .html from url
        $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

        // add .html back in
        $url .= '.html';

        // get a reference to the page object
        $page = Page::GetByUrl($url, $site->id);

        // get page
        $location = app()->basePath().'/public/sites/'.$site->id.'/'.$url;

        if($page != NULL && file_exists($location)) {

          // get html
          $html = file_get_contents($location);

          // load the parser
          $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

          // check for body
          $el = $dom->find('body', 0);

          // find body
          if(isset($el)) {

            // apply changes to the document
            $els = $dom->find('[role="main"]');

            if(isset($els[0])) {
              $els[0]->innertext = $value;
            }

            // get text from content
            $text = strip_tags($value);
            $text = preg_replace("/\s+/", " ", $text);
            $text = trim($text);
            $text = preg_replace('/[[:^print:]]/', '', $text);

            // set text to main_content
            $page->text = $text;

            // save html
            file_put_contents($location, $dom);

            // save the page
            $page->save($site, $user);

            // re-publish plugins
            Publish::publishPluginsForPage($page, $user, $site);

            // return 200
            return response('Ok', 200);
         }
         else {
           return response('Page is not valid', 400);
         }


        }
        else {
          return response('File does not exist', 400);
        }

      }
      else if($type == "plugin") {

         // return OK
        if(file_exists($path) == true) {

          // save to file
          file_put_contents($path, $value);

          // re-publish plugins
          Publish::publishPlugins($user, $site);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File does not exist', 400);
        }
      }
      else if($type == "component") {

         // return OK
        if(file_exists($path) == true) {

          $timestamp = date("Y-m-d\TH:i:sO", time());

          $meta = array(
            'url' => $url,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'lastModifiedBy' => $user->email,
            'lastModifiedDate' => $timestamp
          );

          // inject code into component
          $dom = Publish::injectPluginHTML($value, $user, $site, $meta);

          // save to file
          file_put_contents($path, $dom);

          // re-publish plugins
          Publish::publishPlugins($user, $site);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File does not exist', 400);
        }
      }
      else if($type == "template") {

         // return OK
        if(file_exists($path) == true) {

          // get template name
          $template = basename($path);

          // strip any trailing .html from url
          $template = preg_replace('/\\.[^.\\s]{3,4}$/', '', $template);

          // save to file
          file_put_contents($path, $value);

          // re-publish template
          Publish::publishTemplate($template, $user, $site);

          // re-publish plugins
          Publish::publishPlugins($user, $site);

          // re-publish the settings
          Publish::publishSettings($user, $site);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File does not exist', 400);
        }
      }
      else if($type == "stylesheet") {

         // return OK
        if(file_exists($path) == true) {

          // save to file
          file_put_contents($path, $value);

          // combine css
          Publish::combineCSS($site);

           // re-publish the templates to update date/time stamp
          Publish::publishTemplates($user, $site);

          // re-publish plugins
          Publish::publishPlugins($user, $site);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File does not exist', 400);
        }

      }
      else if($type == "script") {

        // return OK
        if(file_exists($path) == true) {

          // save to file
          file_put_contents($path, $value);

          // combine JS to site.all.js
          Publish::combineJS($site);

          // re-publish the templates to update date/time stamp
          Publish::publishTemplates($user, $site);

          // re-publish plugins
          Publish::publishPlugins($user, $site);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File does not exist', 400);
        }

      }
      else {

         // return OK
        if(file_exists($path) == true) {

          // save to file
          file_put_contents($path, $value);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File does not exist', 400);
        }
      }

      return response('File does not exist', 400);
    }

    /**
     * Add code
     *
     * @return Response
     */
    public function add(Request $request)
    {

      // get request data
      $email = $request->input('auth-email');
      $id = $request->input('auth-id');

      // get site and user
      $site = Site::getById($id);
      $user = User::getByEmail($email);

      // get url and type
      $type = $request->json()->get('type');
      $name = $request->json()->get('name');

      // save a page
      if ($type == "plugin") {

        // check for extension
        if (strpos($name, '.html') === false && strpos($name, '.php') === false) {
          $name = $name.'.php';
        }

        // build path
        $path = app()->basePath('public/sites/'.$id.'/plugins/'.$name);

         // return OK
        if(file_exists($path) == false) {

          // create file
          file_put_contents($path, '');

          // return 200
          return response('Ok', 200);

        }
        else {
          return response('File already exists', 400);
        }
      }
      else if ($type == "template") {

        // strip extension
        $name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $name);
        $name = str_replace('.html', '', $name);

        // build path
        $path = app()->basePath('public/sites/'.$id.'/templates/'.$name.'.html');

         // return OK
        if (file_exists($path) == false) {

          // create file
          file_put_contents($path, '');

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File already exists', 400);
        }

      }
      else if ($type == "stylesheet") {

        // strip extension
        $name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $name);
        $name = str_replace('.css', '', $name);

        // build path
        $path = app()->basePath('public/sites/'.$id.'/css/'.$name.'.css');

         // return OK
        if (file_exists($path) == false) {

          // create file
          file_put_contents($path, '');

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File already exists', 400);
        }

      }
      else if ($type == "script") {

        // strip extension
        $name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $name);
        $name = str_replace('.js', '', $name);

        // build path
        $path = app()->basePath('public/sites/'.$id.'/js/'.$name.'.js');

         // return OK
        if (file_exists($path) == false) {

          // create file
          file_put_contents($path, '');

          // combine JS to site.all.js
          Publish::combineJS($site);

          // return 200
          return response('Ok', 200);
        }
        else {
          return response('File already exists', 400);
        }

      }

      return response('File does not exist', 400);

    }

  /**
   * Uploads a file to code
   *
   * @return Response
   */
  public function upload(Request $request, $type)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get site
    $site = Site::getById($id);

    // get file
    $file = $request->file('file');

    // get file info
    $filename = $file->getClientOriginalName();
		$contentType = $file->getMimeType();
		$size = intval($file->getClientSize()/1024);

		// get the extension
		$ext = strtoupper($file->getClientOriginalExtension());

		// set allowed
		$is_allowed = false;
		$directory = app()->basePath().'/public/sites/'.$site->id.'/resources/';

    if ($type == 'plugin') {

      if ($ext == 'HTML' || $ext == 'PHP') {
        $directory = app()->basePath().'/public/sites/'.$site->id.'/plugins/';
        $is_allowed = true;
      }

    }
    else if ($type == 'template') {

      if ($ext == 'HTML') {
        $directory = app()->basePath().'/public/sites/'.$site->id.'/templates/';
        $is_allowed = true;
      }

    }
    else if ($type == 'stylesheet') {

      if ($ext == 'CSS') {
        $directory = app()->basePath().'/public/sites/'.$site->id.'/css/';
        $is_allowed = true;
      }

    }
    else if ($type == 'script') {

      if ($ext == 'JS') {
        $directory = app()->basePath().'/public/sites/'.$site->id.'/js/';
        $is_allowed = true;
      }

    }

    // save file if it is allowed
		if($is_allowed == true){

      // move the file
      $file->move($directory, $filename);

      // set url
      $arr = array(
        'filename' => $filename,
        'fullUrl' => $directory.$filename,
        'extension' => $ext
        );

    }
    else{

      return response('Unauthorized', 401);

    }

    // return OK
    return response()->json($arr);

  }

}