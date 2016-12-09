<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Alchemy\Zippy\Zippy;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

class PluginController extends Controller
{

    /**
     * Lists all code for a given type
     *
     * @return Response
     */
    public function listAll(Request $request)
    {

      // get request data
      $email = $request->input('auth-email');
      $id = $request->input('auth-id');

      $site = Site::getById($id);

      // set dir
      $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/plugins.json';

      if(file_exists($json_file)) {

        $json = file_get_contents($json_file);

      }

      return response($json, 200)->header('Content-Type', 'application/json');

    }

    /**
     * Uploads a plugin
     *
     * @return Response
     */
    public function upload(Request $request)
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
  		$directory = app()->basePath().'/public/sites/'.$site->id.'/temp/';

  		if($ext == 'ZIP') {

        // move the file
        $file->move($directory, $filename);

        // load zippy
        $zippy = Zippy::load();

        echo("file: ".$directory.$filename);

        // open the file
        $archive = $zippy->open($directory.$filename);

        // iterate through members (https://zippy.readthedocs.io/en/latest/_static/API/)
        // extract zip: http://stackoverflow.com/questions/10420112/how-to-read-a-single-file-inside-a-zip-archive
        foreach ($archive as $member) {

          // get ext
          $arr = explode('.', $member);
          $ext = array_pop($arr);

          // get member filename
          $member_filename = basename($member);


          if (isset($ext)) {

            $ext = strtoupper($ext);

            if ($ext == 'CSS') {

              // get contents
              $result = file_get_contents('zip://'.$directory.$filename.'#'.$member);

              // get location
              $new_location = app()->basePath().'/public/sites/'.$site->id.'/css/'.$member_filename;

              file_put_contents($new_location, $result);

              // combine css
              Publish::combineCSS($site);
            }
            else if($ext == 'JS') {

              // get contents
              $result = file_get_contents('zip://'.$directory.$filename.'#'.$member);

              // get location
              $new_location = app()->basePath().'/public/sites/'.$site->id.'/js/'.$member_filename;

              file_put_contents($new_location, $result);

              // combine JS to site.all.js
              Publish::combineJS($site);

            }
            else if($ext == 'PHP' || $ext == 'HTML') {

              // get contents
              $result = file_get_contents('zip://'.$directory.$filename.'#'.$member);

              // get location
              $new_location = app()->basePath().'/public/sites/'.$site->id.'/plugins/'.$member_filename;

              file_put_contents($new_location, $result);

            }
            else if($ext == 'JSON') {

              // get contents
              $result = file_get_contents('zip://'.$directory.$filename.'#'.$member);

              // get json object
              $obj = json_decode($result);

              // set dir
              $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/plugins.json';

              if(file_exists($json_file)) {

                $json = file_get_contents($json_file);
                $json_arr = json_decode($json);

                array_push($json_arr, $obj);

                $json_text = json_encode($json_arr);

                file_put_contents($json_file, $json_text);

              }


            }

          }

        }

        // return 200
        return response('Ok', 200);

      }
      else {
        return response('Unauthorized', 401);
      }


    }

    /**
     * Lists all code for a given type
     *
     * @return Response
     */
    public function remove(Request $request)
    {

      // get request data
      $email = $request->input('auth-email');
      $id = $request->input('auth-id');

      $site = Site::getById($id);

      // get selector
      $selector = $request->json()->get('selector');

      // set dir
      $json_file = app()->basePath().'/public/sites/'.$site->id.'/data/plugins.json';

      if(file_exists($json_file)) {

        $json = file_get_contents($json_file);

        $json_arr = json_decode($json);

        $i=0;

        foreach($json_arr as $item) {

          if($selector == $item->selector) {
            unset($json_arr[$i]);
          }

          $i+=1;

        }

        $json_arr = array_values($json_arr);

        // re-encode json
        $json_text = json_encode($json_arr);

        // save
        file_put_contents($json_file, $json_text);

      }

      return response($json, 200)->header('Content-Type', 'application/json');

    }

}