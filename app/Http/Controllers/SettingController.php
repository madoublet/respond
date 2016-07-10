<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Setting;

class SettingController extends Controller
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

    // list settings for the site
    $arr = Setting::listAll($siteId);

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
    $user = User::getByEmail($email, $siteId);

    // update order in file
    $success = Setting::saveAll($settings, $user, $site);

    if($success === TRUE) {

      return response('Ok', 200);

    }
    else {
      // return error
      return response('Error', 400);
    }


  }

}