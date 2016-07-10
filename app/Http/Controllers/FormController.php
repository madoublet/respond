<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Form;

class FormController extends Controller
{

  /**
   * Lists all forms for a site
   *
   * @return Response
   */
  public function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // list pages in the site
    $arr = Form::listAll($siteId);

    return response()->json($arr);

  }

  /**
   * Adds the form
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
    $cssClass = $request->json()->get('cssClass');

    // add a menu
    $form = Form::add($name, $cssClass, $siteId);

    if($form !== NULL) {
     // return OK
     return response('OK, form added at = '.$form->name, 200);
    }

    return response('Form already exists', 400);

  }

  /**
   * Edits the form
   *
   * @return Response
   */
  public function edit(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get url, title and description
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');
    $cssClass = $request->json()->get('cssClass');

    // update order in file
    $form = Form::getById($id, $siteId);

    if($form != NULL) {
      $form->name = $name;
      $form->cssClass = $cssClass;
      $form->save($siteId);

      return response('Ok', 200);
    }

    // return error
    return response('Error', 400);

  }

  /**
   * Removes the form
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

    $form = Form::getById($id, $siteId);

    if($form !== NULL) {
      $form->remove($siteId);

      // return OK
      return response('OK, form removed at = '.$form->id, 200);
    }

    return response('Form not found', 400);

  }

}