<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Gallery;
use App\Respond\Models\GalleryImage;

class GalleryImageController extends Controller
{

  /**
   * Lists all form fields
   *
   * @return Response
   */
  public function listAll(Request $request, $id)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    $arr = array();

    // list fields in the form
    if($id != NULL) {
      $arr = GalleryImage::listAll($id, $siteId);

      return response()->json($arr);
    }

    return response('Gallery not found', 400);

  }

  /**
   * Adds the image
   *
   * @return Response
   */
  public function add(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // params
    $name = $request->json()->get('name');
    $url = $request->json()->get('url');
    $thumb = $request->json()->get('thumb');
    $caption = $request->json()->get('caption');
    $galleryId = $request->json()->get('galleryId');

    // fix thumb and url
    $thumb = str_replace('sites/'.$siteId.'/', '', $thumb);
    $url = str_replace('sites/'.$siteId.'/', '', $url);

    $id = $name;

    // get an image id
    $id = str_replace(' ', '-', $id);
    $id = str_replace('.', '-', $id);

    // replaces all spaces with hyphens
    $id =  preg_replace('/[^A-Za-z0-9\-]/', '', $id);

    // add a field
    $image = GalleryImage::add($id, $name, $url, $thumb, $caption, $galleryId, $siteId);

    // get site and user
    $site = Site::getById($siteId);
    $user = User::getByEmail($email, $siteId);

    // re-publish plugins
    Publish::publishPlugins($user, $site);

    if($image !== NULL) {
     return response('OK, image added', 200);
    }

    return response('Error', 400);

  }

  /**
   * Edits the image
   *
   * @return Response
   */
  public function edit(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // id
    $id = $request->json()->get('id');
    $caption = $request->json()->get('caption');
    $galleryId = $request->json()->get('galleryId');

    // get gallery
    $gallery = Gallery::getById($galleryId, $siteId);

    if($gallery != NULL) {

      $index = GalleryImage::getIndexById($id, $galleryId, $siteId);

      // update the item at the index
      if($gallery->images[$index] != NULL) {

        $gallery->images[$index]['caption'] = $caption;

      }

      // save the gallery
      $gallery->save($siteId);

      // get site and user
      $site = Site::getById($siteId);
      $user = User::getByEmail($email, $siteId);

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      return response('Ok', 200);
    }

    // return error
    return response('Error', 400);

  }

  /**
   * Updates the order of images in the gallery
   *
   * @return Response
   */
  public function updateOrder(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $galleryId = $request->json()->get('galleryId');
    $images = $request->json()->get('images');

    // update order in a gallery
    $gallery = Gallery::getById($galleryId, $siteId);

    if($gallery != NULL) {
      $gallery->images = $images;
      $gallery->save($siteId);

      // get site and user
      $site = Site::getById($siteId);
      $user = User::getByEmail($email, $siteId);

      // re-publish plugins
      Publish::publishPlugins($user, $site);


      return response('Ok', 200);
    }

    return response('Error', 400);

  }

  /**
   * Removes the gallery image
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // id, galleryId
    $id = $request->json()->get('id');
    $galleryId = $request->json()->get('galleryId');

    // get form
    $gallery = Gallery::getById($galleryId, $siteId);

    if($gallery != NULL) {

      $index = GalleryImage::getIndexById($id, $galleryId, $siteId);

      array_splice($gallery->images, $index, 1);

      $gallery->save($siteId);

      // get site and user
      $site = Site::getById($siteId);
      $user = User::getByEmail($email, $siteId);

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      return response('Ok', 200);
    }


    return response('Gallery not found', 400);

  }

}