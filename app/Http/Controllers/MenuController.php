<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Menu;

class MenuController extends Controller
{

  /**
   * Lists all menus for a site
   *
   * @return Response
   */
  public function listAll(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // list pages in the site
    $arr = Menu::listAll($siteId);

    return response()->json($arr);

  }

  /**
   * Adds the menu
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

    // add a menu
    $menu = Menu::add($name, $siteId);

    if($menu !== NULL) {
     // return OK
     return response('OK, menu added at = '.$menu->name, 200);
    }

    return response('Menu already exists', 400);

  }
  
  /**
   * Edits the menu item
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
    
    // update order in file
    $menu = Menu::getById($id, $siteId);
    
    if($menu != NULL) {
      $menu->name = $name;
      $menu->save($siteId);
      
      return response('Ok', 200);
    }
    
    // return error
    return response('Error', 400);

  }

  /**
   * Removes the menu
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

    $menu = Menu::getById($id, $siteId);

    if($menu !== NULL) {
      $menu->remove($siteId);

      // return OK
      return response('OK, menu removed at = '.$menu->id, 200);
    }

    return response('Menu not found', 400);

  }

}