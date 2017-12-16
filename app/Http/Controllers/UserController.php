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
    $id = $request->json()->get('id');

    // lookup site id for user
    if(isset($id) == false || $id == '') {

      $arr = User::lookupUserByEmail($email);

      // set site id
      if(sizeof($arr) == 1) {
        $id = $arr[0];
      }
      else if(sizeof($arr) == 0) {
        return response('The email and password combination is invalid', 401);
      }
      else {
        return response('You have multiple sites registered with this email.  Key the name of the site above to login. You can speed up the process in the future by navigating to login/site-name.', 409);
      }

    }

    // get site by its friendly id
    $site = Site::getById($id);

    if ($site != NULL) {

      // get the user from the credentials
      $user = NULL;

      // if LDAP is being used, check for @ to determine how to authenticate user
      if(strpos($email, '@') === false && !empty(env('LDAP_SERVER'))){
        //authenticate against LDAP, on success get user by 'email'
        $ldap = ldap_connect(env('LDAP_SERVER'));
        if($bind = ldap_bind($ldap, env('LDAP_DOMAIN') . '\\' . $email)) {
          $user = User::getByEmail($email, $site->id);
        }
      }
      else {
        // get the user from the credentials
        $user = User::getByEmailPassword($email, $password, $site->id);
      }

      if($user != NULL) {

        // get the photoURL
        $fullPhotoUrl = '';

      	// set photo url
      	if($user->photo != '' && $user->photo != NULL){

      		// set images URL
          $imagesURL = $site->domain;

        	$fullPhotoUrl = $imagesURL.'/files/thumbs/'.$user->photo;

      	}

      	$activationUrl = '';

      	if(env('ACTIVATION_URL') != NULL) {
        	$activationUrl = env('ACTIVATION_URL');

        	$activationUrl = str_replace('{{site}}', $site->id, $activationUrl);
      	}

      	// determine if a customer has an account
      	$hasAccount = false;

      	if($site->status == 'Active' && $site->customerId != '') {
        	$hasAccount = true;
      	}

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

        // return a subset of the user array
        $returned_user = array(
        	'email' => $user->email,
        	'firstName' => $user->firstName,
        	'lastName' => $user->lastName,
        	'photo' => $user->photo,
        	'fullPhotoUrl' => $fullPhotoUrl,
        	'language' => $user->language,
        	'siteId' => $site->id,
        	'status' => $site->status,
        	'hasAccount' => $hasAccount,
        	'days'=> $site->daysRemaining(),
        	'activationUrl'=> $activationUrl
        );

        // send token
        $params = array(
        	'user' => $returned_user,
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
    $id = $request->json()->get('id');

    // lookup site id for user
    if(isset($id) == false || $id == '') {

      $arr = User::lookupUserByEmail($email);

      // set site id
      if(sizeof($arr) == 1) {
        $id = $arr[0];
      }
      else if(sizeof($arr) == 0) {
        return response('Unauthorized', 401);
      }
      else {
        return response('Specify site', 409);
      }

    }

    // get site
    $site = Site::getById($id);

    if($site != NULL) {

      // get user
      $user = User::getByEmail($email, $site->id);

      if($user != NULL) {

        $user->token = uniqid();

        // save user
        $user->save($site->id);

        // send email
        $to = $user->email;
        $from = env('EMAILS_FROM');
        $fromName = env('EMAILS_FROM_NAME');
        $subject = env('RESET_SUBJECT', 'Reset Password');
        $file = app()->basePath().'/resources/emails/reset-password.html';

        // create strings to replace
        $resetUrl = Utilities::retrieveAppURL().'/reset/'.$site->id.'/'.$user->token;

        $replace = array(
          '{{brand}}' => env('BRAND'),
          '{{reply-to}}' => env('EMAILS_FROM'),
          '{{reset-url}}' => $resetUrl
        );

        // send email from file
        Utilities::sendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);

        return response('OK', 200);

      }

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
    $id = $request->json()->get('id');

    $site = Site::getById($id);

    if($site != NULL) {

      // get the user from the credentials
      $user = User::getByToken($token, $site->id);

      if($user!=null){

        // update the password
        $user->password = password_hash($password, PASSWORD_DEFAULT);
        $user->token = '';

        $user->save($site->id);

        // return a successful response (200)
        return response('OK', 200);

      }
      else{

        // return a bad request
        return response('Token invalid', 400);

      }

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
    $id = $request->input('auth-id');

    // get url & changes
    $email = $request->json()->get('email');
    $firstName = $request->json()->get('firstName');
    $lastName = $request->json()->get('lastName');
    $password = $request->json()->get('password');
    $language = $request->json()->get('language');

    $user = User::getByEmail($email, $id);

    if($user != NULL) {

      $user->firstName = $firstName;
      $user->lastName = $lastName;
      $user->language = $language;

      if($password !== 'currentpassword') {
        $user->password = password_hash($password, PASSWORD_DEFAULT);
      }

      $user->save($id);

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
    $id = $request->input('auth-id');

    // get url & changes
    $email = $request->json()->get('email');
    $firstName = $request->json()->get('firstName');
    $lastName = $request->json()->get('lastName');
    $password = $request->json()->get('password');
    $language = $request->json()->get('language');

    $user = User::getByEmail($email, $id);

    // make sure the email doesn't exist already
    if($user === NULL) {

      // create the user
      $user = new User(array(
          'email' => $email,
          'password' => password_hash($password, PASSWORD_DEFAULT),
          'firstName' => $firstName,
          'lastName' => $lastName,
          'language' => $language,
          'photo' => '',
          'token' => ''
        ));

      // save the user
      $user->save($id);

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
    $id = $request->input('auth-id');

    // get url, title and description
    $email = $request->json()->get('email');

    $user = User::getByEmail($email, $id);

    $user->remove($id);

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
    $id = $request->input('auth-id');

    // list pages in the site
    $arr = User::listAll($id);

    return response()->json($arr);

  }

}