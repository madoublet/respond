<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Component;

class ComponentController extends Controller
{

  /**
   * Lists the components for given site
   *
   * @return Response
   */
  public function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get site and user
    $site = Site::getById($id);
    $user = User::getByEmail($email, $id);

    // list componentss in the site
    $arr = Component::listAll($site->id);

    return response()->json($arr);

  }

  /**
   * Adds the component
   *
   * @return Response
   */
  public function add(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get url, title and description
    $url = $request->json()->get('url');

    // get the site
    $site = Site::getById($id);
    $user = User::getByEmail($email, $id);

    // strip any leading slashes from url
    $url = ltrim($url, '/');

    // strip any trailing .html from url
    $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

    // set component data
    $data = array(
      'url' => $url
    );

    // add a component
    $component = Component::add($data, $site, $user);

    if($component != NULL) {
      // return OK
      return response('OK, component added at = '.$component->url, 200);

    }
    else {
      return response('Component not created successfully', 400);
    }

  }

  /**
   * Saves the component
   *
   * @return Response
   */
  public function save(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get url & changes
    $url = $request->json()->get('url');
    $changes = $request->json()->get('changes');

    // get site and user
    $site = Site::getById($id);
    $user = User::getByEmail($email, $id);

    // remove site and .html from url
    $url = str_replace($id.'/', '', $url);
    $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

    // edit the component
    $success = Component::edit($url, $changes, $site, $user);

    // show response
    if($success == TRUE) {

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      // return 200
      return response('OK', 200);
    }
    else {
      return response('Page not found', 400);
    }

  }

  /**
   * Removes the component
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get the site
    $site = Site::getById($id);
    $user = User::getByEmail($email, $id);

    // get url, title and description
    $url = $request->json()->get('url');

    Component::remove($url, $user, $site);

    // return OK
    return response('OK, component removed at = '.$url, 200);

  }

}