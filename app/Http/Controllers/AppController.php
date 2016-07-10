<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;

class AppController extends Controller
{

  /**
   * Settings
   *
   * @return Response
   */
  public function settings(Request $request)
  {
  
    $has_passcode = true;
    
    if(env('PASSCODE') === '') {
      $has_passcode = false;
    }
  
    // return app settings
    $settings = array(
      'hasPasscode' => $has_passcode,
      'siteUrl' => Utilities::retrieveSiteURL()
    );
  
    return response()->json($settings);

  }

  /**
   * Lists the themes available for the app
   *
   * @return Response
   */
  public function listThemes(Request $request)
  {

    // list pages in the site
    $dir = app()->basePath().'/'.env('THEMES_LOCATION');

    // list files
    $arr = Utilities::listSpecificFiles($dir, 'theme.json');

    $result = array();

    foreach ($arr as $item) {

      // get contents of file
      $json = json_decode(file_get_contents($item));

      // get location of theme
      $temp = explode('public/themes/', $item);
      $location = substr($temp[1], 0, strpos($temp[1], '/theme.json'));

      $json->location = $location;

      array_push($result, $json);

    }

    return response()->json($result);

  }
  
  /**
   * Lists the languages available for the app
   *
   * @return Response
   */
  public function listLanguages(Request $request)
  {

    // list pages in the site
    $file = app()->basePath().'/public/i18n/languages.json';
    
    $result = array();

    if(file_exists($file)) {
      
      $json = file_get_contents($file);
      $result = json_decode($json);
      
    }

    return response()->json($result);

  }


}