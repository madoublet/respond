<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Site;
use App\Respond\Models\User;

use App\Respond\Models\Menu;
use App\Respond\Models\MenuItem;

class MenuItemController extends Controller
{

  /**
   * Lists all menu items for a site
   *
   * @return Response
   */
  public function listAll(Request $request, $id)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    $arr = array();

    // list items in the menu
    if($id != NULL) {
      $arr = MenuItem::listAll($id, $siteId);

      return response()->json($arr);
    }

    return response('Menu not found', 400);

  }

  /**
   * Adds the menu item
   *
   * @return Response
   */
  public function add(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // menu
    $menuId = $request->json()->get('id');

    // item
    $html = $request->json()->get('html');
    $cssClass = $request->json()->get('cssClass');
    $isNested = $request->json()->get('isNested');
    $url = $request->json()->get('url');
    $target = $request->json()->get('target');

    // set $isNested to boolean
    $isNested = boolval($isNested);

    // add a menu
    $item = MenuItem::add($html, $cssClass, $isNested, $url, $target, $menuId, $siteId);

    // get site and user
    $site = Site::getById($siteId);
    $user = User::getByEmail($email, $siteId);

    // re-publish plugins
    Publish::publishPlugins($user, $site);

    if($item !== NULL) {
     return response('OK, menu item added', 200);
    }

    return response('Error', 400);

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
    $menuId = $request->json()->get('id');
    $index = $request->json()->get('index');
    $html = $request->json()->get('html');
    $cssClass = $request->json()->get('cssClass');
    $isNested = $request->json()->get('isNested');
    $url = $request->json()->get('url');
    $target = $request->json()->get('target');

    // default
    if ($isNested != '') {
      $isNested = strtolower($isNested);
      $isNested = ($isNested == 'true' || $isNested == '1') ? true : false;
    }
    else {
      $isNested = false;
    }

    // update order in file
    $menu = Menu::getById($menuId, $siteId);

    if($menu != NULL) {

      // update the item at the index
      if($menu->items[$index] != NULL) {

        $menu->items[$index]['html'] = $html;
        $menu->items[$index]['cssClass'] = $cssClass;
        $menu->items[$index]['isNested'] = $isNested;
        $menu->items[$index]['url'] = $url;
        $menu->items[$index]['target'] = $target;

      }

      // save the menu
      $menu->save($siteId);

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
   * Updates the order of items in the list
   *
   * @return Response
   */
  public function updateOrder(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $menuId = $request->json()->get('id');
    $items = $request->json()->get('items');

    // update order in file
    $menu = Menu::getById($menuId, $siteId);

    if($menu != NULL) {

      // strip .html
      foreach($items as &$item) {
        $item['url'] = str_replace('.html', '', $item['url']);
      }

      $menu->items = $items;
      $menu->save($siteId);

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
   * Removes the menu item
   *
   * @return Response
   */
  public function remove(Request $request)
  {
    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // name, items
    $menuId = $request->json()->get('id');
    $index = $request->json()->get('index');

    // update order in file
    $menu = Menu::getById($menuId, $siteId);

    if($menu != NULL) {
      array_splice($menu->items, $index, 1);

      $menu->save($siteId);

      // get site and user
      $site = Site::getById($siteId);
      $user = User::getByEmail($email, $siteId);

      // re-publish plugins
      Publish::publishPlugins($user, $site);

      return response('Ok', 200);
    }


    return response('Menu Item not found', 400);

  }

}