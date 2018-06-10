<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Theme;

class ThemeController extends Controller
{

  /**
   * Lists all branding for a site
   *
   * @return Response
   */
  public function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // list settings for the theme
    $arr = Theme::listAll($siteId);

    return response()->json($arr);

  }

  /**
   * Edits the settings
   *
   * @return Response
   */
  public function edit(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get url, title and description
    $settings = $request->json()->get('settings');

    // get site and user
    $site = Site::getById($siteId);
    $user = User::getByEmail($email);

    // update order in file
    $success = Theme::saveAll($settings, $user, $site);

    if($success === TRUE) {

      // combine the CSS
      Publish::combineCSS($site);

      // re-publish the templates
      Publish::publishTemplates($user, $site);

      return response('Ok', 200);

    }
    else {
      // return error
      return response('Error', 400);
    }


  }

}