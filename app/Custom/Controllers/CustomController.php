<?php

namespace App\Custom\Controllers;

use \Illuminate\Http\Request;

// include Respond Libraries / Models
// use App\Respond\Libraries\Utilities;
// use App\Respond\Models\Site;

class CustomController
{

  /**
    * Shows how to build an unauthenticated controller in response to a route
    *
    * @return Response
    */
  public static function example()
  {
    return response('Ok (route works!)', 200);
  }

  /**
    * Shows how to build an authenticated controller in response to a route
    *
    * @return Response
    */
  public static function authExample($request, $param)
  {

    // get authenticated user's email and the site ID
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    return response('Ok (route works! param='.$param.')', 200);
  }

  /**
    * Shows how to build an authenticated controller with a URL parameter in response to a route
    *
    * @return Response
    */
  public static function authExampleWithParameter($request, $param)
  {

    // get authenticated user's email and the site ID
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    return response('Ok (route works!)', 200);
  }

  /**
    * Shows how to build an authenticated controller with a URL parameter in response to a route
    *
    * @return Response
    */
  public static function corsExampleWithParameter($request, $param)
  {
    return response('Ok (route works! param='.$param.')', 200);
  }


}