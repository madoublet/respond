<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Form;
use App\Respond\Models\FormField;

class FormFieldController extends Controller
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
      $arr = FormField::listAll($id, $siteId);

      return response()->json($arr);
    }

    return response('Form not found', 400);

  }

  /**
   * Adds the form field
   *
   * @return Response
   */
  public function add(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // form
    $formId = $request->json()->get('id');

    // params
    $label = $request->json()->get('label');
    $type = $request->json()->get('type');
    $required = $request->json()->get('required');
    $options = $request->json()->get('options');
    $helperText = $request->json()->get('helperText');
    $placeholder = $request->json()->get('placeholder');
    $cssClass = $request->json()->get('cssClass');
    
    // convert to string
    if(is_bool($required)) {
      $required = ($required) ? 'true' : 'false';
    }

    // build an id from the label
	  $id = strtolower($label);

    // replaces all spaces with hyphens
    $id = str_replace(' ', '-', $id);

    // remove special characters
    $id = preg_replace('/[^A-Za-z0-9\-]/', '', $id);

    // add a field
    $field = FormField::add($id, $label, $type, $required, $options, $helperText, $placeholder, $cssClass, $formId, $siteId);

    // get site and user
    $site = Site::getById($siteId);
    $user = User::getByEmail($email, $siteId);

    // re-publish plugins
    Publish::publishPlugins($user, $site);

    if($field !== NULL) {
     return response('OK, form field added', 200);
    }

    return response('Error', 400);

  }

  /**
   * Edits the form field
   *
   * @return Response
   */
  public function edit(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // form, index
    $formId = $request->json()->get('id');
    $index = $request->json()->get('index');

    // params
    $label = $request->json()->get('label');
    $type = $request->json()->get('type');
    $required = $request->json()->get('required');
    $options = $request->json()->get('options');
    $helperText = $request->json()->get('helperText');
    $placeholder = $request->json()->get('placeholder');
    $cssClass = $request->json()->get('cssClass');
    
    // convert to string
    if(is_bool($required)) {
      $required = ($required) ? 'true' : 'false';
    }
    
    // get form
    $form = Form::getById($formId, $siteId);

    if($form != NULL) {

      // update the item at the index
      if($form->fields[$index] != NULL) {

        $form->fields[$index]['label'] = $label;
        $form->fields[$index]['type'] = $type;
        $form->fields[$index]['required'] = $required;
        $form->fields[$index]['options'] = $options;
        $form->fields[$index]['helperText'] = $helperText;
        $form->fields[$index]['placeholder'] = $placeholder;
        $form->fields[$index]['cssClass'] = $cssClass;

      }

      // save the form
      $form->save($siteId);

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
   * Updates the order of fields in the form
   *
   * @return Response
   */
  public function updateOrder(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $formId = $request->json()->get('id');
    $fields = $request->json()->get('fields');

    // update order in file
    $form = Form::getById($formId, $siteId);

    if($form != NULL) {
      $form->fields = $fields;
      $form->save($siteId);

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
   * Removes the form field
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $formId = $request->json()->get('id');
    $index = $request->json()->get('index');

    // get form
    $form = Form::getById($formId, $siteId);

    if($form != NULL) {
      array_splice($form->fields, $index, 1);

      $form->save($siteId);

      // get site and user
      $site = Site::getById($siteId);
      $user = User::getByEmail($email, $siteId);

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      return response('Ok', 200);
    }


    return response('Form not found', 400);

  }

}