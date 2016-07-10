<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Gallery;

class GalleryController extends Controller
{

  /**
   * Lists all galleries for a site
   *
   * @return Response
   */
  public function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // list pages in the site
    $arr = Gallery::listAll($siteId);

    return response()->json($arr);

  }

  /**
   * Adds the gallery
   *
   * @return Response
   */
  public function add(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get url, title and description
    $name = $request->json()->get('name');

    // add a gallery
    $gallery = Gallery::add($name, $siteId);

    if($gallery !== NULL) {
     // return OK
     return response('OK, gallery added at = '.$gallery->name, 200);
    }

    return response('Gallery already exists', 400);

  }

  /**
   * Edits the gallery
   *
   * @return Response
   */
  public function edit(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get name
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');

    // update gallery
    $gallery = Gallery::getById($id, $siteId);

    if($gallery != NULL) {
      $gallery->name = $name;
      $gallery->save($siteId);

      return response('Ok', 200);
    }

    // return error
    return response('Error', 400);

  }

  /**
   * Removes the gallery
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get id
    $id = $request->json()->get('id');

    $gallery = Gallery::getById($id, $siteId);

    if($gallery !== NULL) {
      $gallery->remove($siteId);

      // return OK
      return response('OK, gallery removed at = '.$gallery->id, 200);
    }

    return response('Gallery not found', 400);

  }

}