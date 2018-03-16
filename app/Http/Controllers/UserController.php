<?php

namespace App\Http\Controllers;

use App\Respond\Models\User;
use App\Respond\Models\Site;
use App\Respond\Models\Setting;
use App\Respond\Libraries\Utilities;
use \Illuminate\Http\Request;

class UserController extends Controller
{

  /**
   * Test the auth
   *
   * @return Response
   */
  public function auth(Request $request)
  {
    return response('OK', 200);
  }

  /**
   * Logs the user into the application
   *
   * @return Response
   */
  public function login(Request $request)
  {

    $email = $request->json()->get('email');
    $password = $request->json()->get('password');
    $siteId = NULL;
    $role = 'contributor';

    // lookup site id for user
    if(isset($id) == false || $id == '') {

      $user = User::getByEmail($email);

      if($user == NULL) {
        return response('The email and password combination is invalid', 401);
      }
      else {
        if(count($user->sites) == 0) {
          return response('The email and password is not associated with a site', 401);
        }
        else {
          $siteId = $user->sites[0]['id'];
          $role = $user->sites[0]['role'];
        }
      }

    }

    // get site by its friendly id
    $site = Site::getById($siteId);

    if ($site != NULL) {

      if($user != NULL) {

      	// determine if site can be synced
      	$can_sync = false;
      	$sync_type = '';

      	$sync = Setting::getById('sync', $site->id);

        // make sure sync is set
        if($sync != NULL) {

          // ... and check to make sure it is not empty
          if($sync != '') {
            $can_sync = true;
            $sync_type = $sync;
          }
        }

        if($user->sysadmin == TRUE) {
          $role = 'admin';
        }

        // return a subset of the user array
        $returned_user = array(
        	'email' => $user->email,
        	'firstName' => $user->firstName,
        	'lastName' => $user->lastName,
        	'language' => $user->language,
        	'sysadmin' => $user->sysadmin,
        	'sites' => $user->sites,
        	'siteId' => $site->id,
        	'role' => $role
        );

        // message to show to user
        $message = array(
        	'status' => $site->status,
          'color' => $site->messageColor,
          'text' => $site->messageText,
          'link' => $site->messageLink
        );

        // send token
        $params = array(
        	'user' => $returned_user,
        	'message' => $message,
        	'sync' => array(
          	'canSync' => $can_sync,
          	'syncType' => $sync_type
        	),
        	'token' => Utilities::createJWTToken($user->email, $site->id)
        );

        // return a json response
        return response()->json($params);

      }
      else {
        return response('Unauthorized', 401);
      }


    }
    else {
      return response('Unauthorized', 401);
    }

  }

  /**
   * Creates a token to reset the password for the user
   *
   * @return Response
   */
  public function forgot(Request $request)
  {

    $email = $request->json()->get('email');

    $user = User::getByEmail($email);

    if($user != NULL) {

      $user->token = uniqid();

      // save user
      $user->save();

      // send email
      $to = $user->email;
      $from = env('EMAILS_FROM');
      $fromName = env('EMAILS_FROM_NAME');
      $subject = env('RESET_SUBJECT', 'Reset Password');
      $file = app()->basePath().'/resources/emails/reset-password.html';

      // create strings to replace
      $resetUrl = Utilities::retrieveAppURL().'/reset/'.$user->token;

      $replace = array(
        '{{brand}}' => env('BRAND'),
        '{{reply-to}}' => env('EMAILS_FROM'),
        '{{reset-url}}' => $resetUrl
      );

      // send email from file
      Utilities::sendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);

      return response('OK', 200);

    }

    return response('Unauthorized', 401);

  }

  /**
   * Resets the password
   *
   * @return Response
   */
  public function reset(Request $request)
  {

    $token = $request->json()->get('token');
    $password = $request->json()->get('password');

    // get the user from the credentials
    $user = User::getByToken($token);

    if($user != NULL){

      // update the password
      $user->password = password_hash($password, PASSWORD_DEFAULT);
      $user->token = '';

      $user->save();

      // return a successful response (200)
      return response('OK', 200);

    }
    else {
      // return a bad request
      return response('Token invalid', 400);
    }

  }

  /**
   * Edits the user
   *
   * @return Response
   */
  public function edit(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get url & changes
    $email = $request->json()->get('email');
    $role = $request->json()->get('role');
    $firstName = $request->json()->get('firstName');
    $lastName = $request->json()->get('lastName');
    $password = $request->json()->get('password');
    $language = $request->json()->get('language');

    $user = User::getByEmail($email, $siteId);

    if($user != NULL) {

      $user->firstName = $firstName;
      $user->lastName = $lastName;
      $user->language = $language;

      if($password !== 'currentpassword') {
        $user->password = password_hash($password, PASSWORD_DEFAULT);
      }

      $user->save();

      // edit role
      $user->editRole($siteId, $role);

      // return a successful response (200)
      return response('OK', 200);

    }
    else {
      // return a bad request
      return response('Token invalid', 400);
    }

  }

  /**
   * Adds the user
   *
   * @return Response
   */
  public function add(Request $request)
  {
    // get request data
    $siteId = $request->input('auth-id');

    // get url & changes
    $email = $request->json()->get('email');
    $role = $request->json()->get('role');
    $firstName = $request->json()->get('firstName');
    $lastName = $request->json()->get('lastName');
    $password = $request->json()->get('password');
    $language = $request->json()->get('language');

    $user = User::getByEmail($email, $siteId);

    // make sure the email doesn't exist already
    if($user === NULL) {

      // create the user
      $user = new User(array(
          'email' => $email,
          'password' => password_hash($password, PASSWORD_DEFAULT),
          'firstName' => $firstName,
          'lastName' => $lastName,
          'language' => $language,
          'token' => ''
        ));


      // save the user
      $user->save();

      // add to site
      $user->addSite($siteId, $role);

      // return a successful response (200)
      return response('OK', 200);

    }
    else {
      // return a bad request
      return response('Duplicate user', 400);
    }

  }

  /**
   * Removes a user
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $siteId = $request->input('auth-id');

    // get url, title and description
    $email = $request->json()->get('email');

    $user = User::getByEmail($email, $siteId);

    $user->remove($siteId);

    // return OK
    return response('OK, user removed at = '.$user->email, 200);

  }


  /**
   * Lists all users for a site
   *
   * @return Response
   */
  public function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // list pages in the site
    $arr = User::listAll($siteId);

    return response()->json($arr);

  }


  /**
   * Converts all users to a users.json
   *
   * @return Response
   */
  public function convert(Request $request)
  {

    // list pages in the site
    $arr = User::convert();

    return response()->json($arr);

  }

}