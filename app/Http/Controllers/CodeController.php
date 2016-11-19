<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

class CodeController extends Controller
{

    /**
     * Lists all code for a given type
     *
     * @return Response
     */
    public function listAll(Request $request, $id)
    {

      // get request data
      $email = $request->input('auth-email');
      $siteId = $request->input('auth-id');

      $site = Site::getById($siteId);

      $arr = array();

      // list items in the menu
      if($id != NULL) {

        if($id == 'page') {

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

          return response()->json($files);

        }
        else if($id == 'template') {

          // set dir
          $dir = app()->basePath().'/public/sites/'.$site->id.'/templates';

          // list files
          $files = Utilities::ListFiles($dir, $site->id,
                  array('html'),
                  array());

          return response()->json($files);

        }
        else if($id == 'stylesheet') {

          // set dir
          $dir = app()->basePath().'/public/sites/'.$site->id.'/css';

          // list files
          $files = Utilities::ListFiles($dir, $site->id,
                  array('css'),
                  array());

          return response()->json($files);

        }
        else if($id == 'script') {

          // set dir
          $dir = app()->basePath().'/public/sites/'.$site->id.'/js';

          // list files
          $files = Utilities::ListFiles($dir, $site->id,
                  array('js'),
                  array());

          return response()->json($files);

        }
        else if($id == 'plugin') {

          // set dir
          $dir = app()->basePath().'/public/sites/'.$site->id.'/plugins';

          // list files
          $files = Utilities::ListFiles($dir, $site->id,
                  array('html', 'php'),
                  array());

          return response()->json($files);

        }

      }

      return response('Code not found', 400);

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

      // get url
      $url = $request->input('url');
      $type = $request->input('type');

      if($type == 'page'){
        // strip any trailing .html from url
        $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

        // add .html back in
        $url .= '.html';

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
      $user = User::getByEmail($email, $id);

      // get url and type
      $value = $request->json()->get('value');
      $url = $request->json()->get('url');
      $type = $request->json()->get('type');

      // save a page
      if($type == "page") {

        // strip any trailing .html from url
        $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

        // add .html back in
        $url .= '.html';

        // build path
        $path = app()->basePath('public/sites/'.$id.'/'.$url);

         // return OK
        if(file_exists($path) == true) {

          // save to file
          file_put_contents($path, $value);

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
      else if($type == "plugin") {
        // build path
        $path = app()->basePath('public/sites/'.$id.'/'.$url);

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
      else if($type == "template") {

        // build path
        $path = app()->basePath('public/sites/'.$id.'/'.$url);

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

        // build path
        $path = app()->basePath('public/sites/'.$id.'/'.$url);

         // return OK
        if(file_exists($path) == true) {

          // save to file
          file_put_contents($path, $value);

          // set dir
          $dir = app()->basePath().'/public/sites/'.$id.'/css';

          // list css files
          $files = Utilities::ListFiles($dir, $id,
                  array('css'),
                  array());

          $all_css = "";

          // walk through files
          foreach($files as $file) {

            $path = app()->basePath('public/sites/'.$id.'/'.$file);

            // get css
            $css_file_name = basename($path);

            // read, minify, and combine css
            if($css_file_name != 'site.min.css') {

              $css = file_get_contents($path);

              // compress css
              $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
              $css = str_replace(': ', ':', $css);
              $css = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $css);

              // save to all css
              $all_css .= $css;
            }

          }

          // save to site.min.css
          $min_path = app()->basePath('public/sites/'.$id.'/css/site.min.css');

          // save
          file_put_contents($min_path, $all_css);

          // return 200
          return response('Ok', 200);
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

}