<?php

namespace App\Http\Controllers;

use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Page;
use App\Respond\Models\Setting;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;
use App\Respond\Libraries\S3;

class SiteController extends Controller
{

  /**
  * Retrieve the user for the given ID.
  *
  * @return Response
  */
  public function test()
  {

    return '[Respond] API works!';

  }

  /**
   * Lists all sites for a user
   *
   * @return Response
   */
  public static function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get user
    $user = User::getByEmail($email);

    // setup array
    $arr = array();

    // list all sites
    if(strtoupper($user->sysadmin) == TRUE) {

      $sites = Site::getSites();

      foreach($sites as &$item) {
        $site = Site::getById($item);
        array_push($arr, $site);
      }

    }
    else { // get sites for user

      foreach($user->sites as &$item) {

        $site = Site::getById($item['id']);
        array_push($arr, $site);

      }

    }

    return response()->json($arr);

  }

  /**
   * Creates the site
   *
   * @return Response
   */
  public function create(Request $request)
  {

    // get request
    $name = $request->json()->get('name');
    $theme = $request->json()->get('theme');
    $email = $request->json()->get('email');
    $password = $request->json()->get('password');
    $passcode = $request->json()->get('passcode');
    $gRecaptchaResponse = $request->json()->get('recaptchaResponse');

    // handle reCAPTCHA
    if(isset($gRecaptchaResponse)) {

      $secret = env('RECAPTCHA_SECRET_KEY');

      // check if secret is set
      if(isset($secret)) {

        // do not check if secret is empty
        if($secret != '') {

          $recaptcha = new \ReCaptcha\ReCaptcha($secret);
          $remoteIp = $request->ip();

          $resp = $recaptcha->verify($gRecaptchaResponse, $remoteIp);

          if ($resp->isSuccess()) {
            // verified! continue
          } else {
              $errors = $resp->getErrorCodes();
              return response('reCAPTCHA invalid', 401);
          }

        }

      }
      else {
        return response('reCAPTCHA error no secret', 401);
      }

    }

    if($passcode == env('PASSCODE')) {

      // try to get user
      $user = User::getByEmail($email);

    	if($user == NULL) {

      	$firstName = 'New';
      	$lastName = 'User';
      	$language = 'en';

      	// add user
      	$user = User::add($email, $password, $firstName, $lastName, $language);
    	}

      // do not add the sysadmin to the site
      $add_user_to_site = true;

      // create a site
      $arr = Site::create($name, $theme, $user, $add_user_to_site);

      // send email
      $to = $email;
      $from = env('EMAILS_FROM');
      $fromName = env('EMAILS_FROM_NAME');
      $subject = env('CREATE_SUBJECT', 'New Site');
      $file = app()->basePath().'/resources/emails/create-site.html';

      // create strings to replace
      $loginUrl = Utilities::retrieveAppURL();
      $siteUrl = str_replace('{{siteId}}', $arr['id'],  Utilities::retrieveSiteURL());

      $replace = array(
        '{{brand}}' => env('BRAND'),
        '{{reply-to}}' => env('EMAILS_FROM'),
        '{{new-site-url}}' => $siteUrl,
        '{{login-url}}' => $loginUrl
      );

      // send email from file
      Utilities::sendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);

      return response()->json($arr);
    }
    else {
      return response('Passcode invalid', 401);
    }

  }

  /**
   * Adds a site
   *
   * @return Response
   */
  public function add(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get user
    $user = User::getByEmail($email);

    // get request
    $name = $request->json()->get('name');
    $theme = $request->json()->get('theme');

    // only enabled for a sysadmin
    if($user->sysadmin == TRUE) {

      // do not add the sysadmin to the site
      $add_user_to_site = false;

      // create a site
      $arr = Site::create($name, $theme, $user, $add_user_to_site);

      return response()->json($arr);
    }
    else {
      return response('Passcode invalid', 401);
    }

  }


  /**
   * Updates the site
   *
   * @return Response
   */
  public function update(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get user
    $user = User::getByEmail($email);

    // get request
    $id = $request->json()->get('id');
    $name = $request->json()->get('name');
    $email = $request->json()->get('email');
    $status = $request->json()->get('status');
    $messageColor = $request->json()->get('messageColor');
    $messageText = $request->json()->get('messageText');
    $messageLink = $request->json()->get('messageLink');

    // only enabled for a sysadmin
    if($user->sysadmin == TRUE) {

      // update the site
      $site = Site::getById($id);
      $site->update($name, $email, $status, $messageColor, $messageText, $messageLink);

      return response('Ok', 200);
    }
    else {
      return response('Passcode invalid', 401);
    }

  }

  /**
   * Activates the site
   *
   * @return Response
   */
  public function active(Request $request)
  {

    // get request
    $siteId = $request->input('id');
    $key = $request->input('key');

    if($key == env('APP_KEY')) {

      $site = Site::getById($siteId);
      $site->activate();

      return response('Ok', 200);
    }
    else {
      return response('Passcode invalid', 401);
    }

  }

  /**
   * Reloads system files for sites (e.g. plugins)
   *
   * @return Response
   */
  public function reload(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get site
    $site = Site::getById($siteId);

    // get user
    $user = User::getByEmail($email);

    // publish plugins
    Publish::publishPlugins($user, $site);

    return response('Ok', 200);

  }

  /**
   * Republishes templates and pushed the change to pages that inherit from it
   *
   * @return Response
   */
  public function republishTemplates(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get site
    $site = Site::getById($siteId);

    // get user
    $user = User::getByEmail($email);

    // migrate site
    Publish::publishTemplates($user, $site);

    // re-publish plugins
    Publish::publishPlugins($user, $site);

    // re-publish site map
    Publish::publishSiteMap($user, $site);

    // re-publish the settings
    Publish::publishSettings($user, $site);

    return response('Ok', 200);

  }

  /**
   * Republishes templates and pushed the change to pages that inherit from it
   *
   * @return Response
   */
  public function updatePlugins(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get site
    $site = Site::getById($siteId);

    // get user
    $user = User::getByEmail($email);

    // update plugins
    Publish::updatePlugins($site);

    // re-publish plugins
    Publish::publishPlugins($user, $site);

    return response('Ok', 200);

  }

  /**
   * Generates a sitemap.xml for the site
   *
   * @return Response
   */
  public function generateSitemap(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get site
    $site = Site::getById($siteId);

    // get user
    $user = User::getByEmail($email);

    // publish site map
    Publish::publishSiteMap($user, $site);

    return response('Ok', 200);

  }

  /**
   * Re-index pages (updates JSON, republishes sitemap)
   *
   * @return Response
   */
  public function reindexPages(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get site
    $site = Site::getById($siteId);

    // get user
    $user = User::getByEmail($email);

    // refresh JSON
    Page::refreshJSON($user, $site);

    // publish site map
    Publish::publishSiteMap($user, $site);

    return response('Ok', 200);

  }

  /**
   * Lists the templates for a given site
   *
   * @return Response
   */
  public function listTemplates(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    $site = Site::getById($id);

    // set dir
    $dir = app()->basePath().'/public/sites/'.$site->id.'/templates';

    // list files
    $files = Utilities::ListFiles($dir, $site->id,
            array('html'),
            array());


    // get template
    foreach($files as &$file) {

      $file = basename($file);
      $file = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file);

    }

    return response()->json($files);

  }


  /**
   * Publishes site to external provider
   *
   * @return Response
   */
  public static function sync(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get site
    $site = Site::getById($siteId);

    $has_synced = S3::sync($site);

    if($has_synced == true) {
      return response('Ok', 200);
    }
    else {
      return response('Cannot sync. Double check your settings.', 400);
    }

  }

  /**
   * Switches to a new site
   *
   * @return Response
   */
  public function switchSites(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get new site id
    $new_siteId = $request->json()->get('id');
    $role = 'contributor';

    // get user
    $user = User::getByEmail($email);

    // determine if the user can switch
    $can_switch = FALSE;

    if($user->sysadmin == TRUE) {
      $can_switch = TRUE;
    }
    else {

      foreach($user->sites as &$site) {

        if($site['id'] == $new_siteId) {
          $can_switch = TRUE;
          $role = $site['role'];
        }
      }

    }

    // switch
    if($can_switch == TRUE) {

      // get site
      $site = Site::getById($new_siteId);

      if($site != NULL) {

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
        return response('Site does not exist.', 400);
      }

    }
    else {
      return response('Cannot switch sites. Check to make sure you have permission.', 400);
    }

  }


}