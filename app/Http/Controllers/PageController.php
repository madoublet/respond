<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Page;

class PageController extends Controller
{

  /**
   * Lists the pages for given site
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

    // list pages in the site
    $arr = Page::listAll($user, $site);

    // sort by last modified date
    usort($arr, function($a, $b) {
        $ts1 = strtotime($a['lastModifiedDate']);
        $ts2 = strtotime($b['lastModifiedDate']);
        return $ts2 - $ts1;
    });


    return response()->json($arr);

  }

  /**
   * Lists the routes for given site
   *
   * @return Response
   */
  public function listRoutes(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get base path for the site
    $dir = $file = app()->basePath().'/public/sites/'.$id;

    $arr = array_merge(array('/'), Utilities::listRoutes($dir, $id));

    return response()->json($arr);

  }


  /**
   * Saves the page and the fragment
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

    // edit the page
    $success = Page::edit($url, $changes, $site, $user);

    // show response
    if($success == TRUE) {

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      // re-publish site map
      Publish::publishSiteMap($user, $site);

      // return 200
      return response('OK', 200);
    }
    else {
      return response('Page not found', 400);
    }

  }

  /**
   * Saves the page settings
   *
   * @return Response
   */
  public function settings(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $id = $request->input('auth-id');

    // get url & changes
    $url = $request->json()->get('url');
    $title = $request->json()->get('title');
    $description = $request->json()->get('description');
    $keywords = $request->json()->get('keywords');
    $tags = $request->json()->get('tags');
    $callout = $request->json()->get('callout');
    $language = $request->json()->get('language');
    $direction = $request->json()->get('direction');
    $template = $request->json()->get('template');
    $customHeader = $request->json()->get('customHeader');
    $customFooter = $request->json()->get('customFooter');
    $photo = $request->json()->get('photo');
    $thumb = $request->json()->get('thumb');
    $location = $request->json()->get('location');
    $timestamp = gmdate('D M d Y H:i:s O', time());

    $data = array(
      'title' => $title,
      'description' => $description,
      'keywords' => $keywords,
      'tags' => $tags,
      'callout' => $callout,
      'url' => $url,
      'language' => $language,
      'direction' => $direction,
      'template' => $template,
      'customHeader' => $customHeader,
      'customFooter' => $customFooter,
      'photo' => $photo,
      'thumb' => $thumb,
      'location' => $location,
      'lastModifiedBy' => $email,
      'lastModifiedDate' => $timestamp
    );

    // get site and user
    $site = Site::getById($id);
    $user = User::getByEmail($email, $id);

    // edit the page
    $success = Page::editSettings($data, $site, $user);

    // show response
    if($success == TRUE) {
      return response('OK', 200);
    }
    else {
      return response('Page not found', 400);
    }

  }

  /**
   * Adds the page
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
    $title = $request->json()->get('title');
    $description = $request->json()->get('description');
    $template = $request->json()->get('template');
    $timestamp = date('Y-m-d\TH:i:s.Z\Z', time());

    // get the site
    $site = Site::getById($id);
    $user = User::getByEmail($email, $id);

    // strip any leading slashes from url
    $url = ltrim($url, '/');

    // strip any trailing .html from url
    $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

    // set page data
    $data = array(
      'title' => $title,
      'description' => $description,
      'text' => '',
      'keywords' => '',
      'tags' => '',
      'callout' => '',
      'url' => $url,
      'photo' => '',
      'thumb' => '',
      'language' => 'en',
      'direction' => 'ltr',
      'firstName' => $user->firstName,
      'lastName' => $user->lastName,
      'lastModifiedBy' => $user->email,
      'lastModifiedDate' => $timestamp,
      'template' => $template
    );

    // add a page
    $page = Page::add($data, $site, $user);

    if($page != NULL) {

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      // re-publish site map
      Publish::publishSiteMap($user, $site);

      // re-publish the settings
      Publish::publishSettings($user, $site);

      // return OK
      return response('OK, page added at = '.$page->url, 200);

    }
    else {
      return response('Page not created successfully', 400);
    }

  }

  /**
   * Removes the page
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

    $page = Page::getByUrl($url, $id);

    $page->remove($user, $site);

    // re-publish site map
    Publish::publishSiteMap($user, $site);

    // return OK
    return response('OK, page removed at = '.$page->url, 200);

  }

}