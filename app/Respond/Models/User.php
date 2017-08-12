<?php

namespace App\Respond\Models;

use App\Respond\Models\Site;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Webhooks;

/**
 * Models a user
 */
class User {

  public $email;
  public $password;
  public $firstName;
  public $lastName;
  public $language;
  public $photo;
  public $token;
  public $siteId;

  /**
   * Constructs a page from an array of data
   *
   * @param {arr} $data
   */
  function __construct(array $data) {
    foreach($data as $key => $val) {
      if(property_exists(__CLASS__,$key)) {
        $this->$key = $val;
      }
    }
  }

  /**
   * Gets a user for a given id, email
   *
   * @param {string} $id
   * @param {string} $email
   * @return {User}
   */
	public static function getByEmail($email, $id){

    $users = User::getUsers($id);

    foreach($users as $user) {

      if($user['email'] == $email) {

        return new User($user);

      }

    }

    return NULL;

	}
	
	/**
   * Gets a user for a given id, email
   *
   * @param {string} $email
   * @return {User}
   */
	public static function getByEmailWithoutSite($email){

    $users = User::getAllUsers();

    foreach($users as $user) {

      if($user['email'] == $email) {

        return new User($user);

      }

    }

    return NULL;

	}
	
	/**
   * Gets a user by email and password
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
	public static function getByEmailPasswordWithoutSite($email, $password){

    $users = User::getAllUsers();

    foreach($users as $user) {

      if($user['email'] == $email) {

        $user = new User($user);

        $hash = $user->password;

        if(password_verify($password, $hash)) {
            return $user;
        }
        else {
            return NULL;
        }

      }

    }

    return NULL;

	}

	/**
   * Gets a user for a given id, token
   *
   * @param {string} $id
   * @param {string} $token
   * @return {User}
   */
	public static function getByToken($token, $id){

    $users = User::getUsers($id);

    foreach($users as $user) {

      if($user['token'] == $token) {

        return new User($user);

      }

    }

    return NULL;

	}

	/**
   * Gets a user by email and password
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
	public static function getByEmailPassword($email, $password, $id){

    $users = User::getUsers($id);

    foreach($users as $user) {

      if($user['email'] == $email) {

        $user = new User($user);

        $hash = $user->password;

        if(password_verify($password, $hash)) {
            return $user;
        }
        else {
            return NULL;
        }

      }

    }

    return NULL;

	}

	/**
   * Retrieves users for a given site
   *
   * @param {string} $id
   * @return {Site}
   */
	public static function getUsers($id) {

  	$file = app()->basePath().'/resources/sites/'.$id.'/users.json';

    if(file_exists($file)) {

      $arr = json_decode(file_get_contents($file), true);
      return $arr;

    }
    else {
      return array();
    }

	}
	
	
	/**
   * Saves a user
   *
   * @param {string} $id the ID of the site
   * @return void
   */
  public function save($id) {

    // defaults
    $dir = app()->basePath().'/resources/sites/'.$id.'/';
    $is_match = false;

    $users = User::getUsers($id);

    foreach($users as &$item) {

      // check email
      if($item['email'] == $this->email) {

        // update user
        $is_match = true;
        $item = (array)$this;

        // encode users
        $json = json_encode($users, JSON_PRETTY_PRINT);

        // save users.json
        Utilities::saveContent($dir, 'users.json', $json);

        return;

      }

    }

    // push user
    array_push($users, (array)$this);

    // save users
    $json = json_encode($users, JSON_PRETTY_PRINT);

    // save users.json
    Utilities::saveContent($dir, 'users.json', $json);

    // Assemble data for webhook
    $wh_data = clone $this;
    $wh_data->siteId = $id;

    // send new user hook
    Webhooks::NewUser($wh_data);

    return;
  }

  /**
   * Removes a user
   *
   * @param {id} $id
   * @return Response
   */
  public function remove($id){

    // remove the user from JSON
    $json_file = app()->basePath().'/resources/sites/'.$id.'/users.json';

    if(file_exists($json_file)) {

      $json = file_get_contents($json_file);

      // decode json file
      $users = json_decode($json, true);
      $i = 0;

      foreach($users as &$user){

        // remove page
        if($user['email'] == $this->email) {
          unset($users[$i]);
        }

        $i++;

      }

      $json_arr = array_values($users);

      // save pages
      file_put_contents($json_file, json_encode($json_arr, JSON_PRETTY_PRINT));

    }

    return TRUE;

  }


  /**
   * Lists all users
   *
   * @param {string} $id id of site (e.g. site-name)
   * @return Response
   */
  public static function listAll($id){

    $arr = array();

    // get base path for the site
    $json_file = app()->basePath().'/resources/sites/'.$id.'/users.json';


    if(file_exists($json_file)) {

      $json = file_get_contents($json_file);

      // decode json file
      $arr = json_decode($json, true);

      foreach($arr as &$item) {
        $item['password'] = 'currentpassword';
        $item['retype'] = 'currentpassword';
      }

    }

    return $arr;

  }
  
  /**
   * Returns a list of sites that the user is a part of
   *
   * @param {string} $id
   * @return {Site}
   */
	public static function lookupUserByEmail($email) {
  	
  	$arr = array();
    
    // list all sites
    $sites = Site::getSites();
    
    // walk through sites
    foreach($sites as &$site) {
      
      // get base path for the site
      $json_file = app()->basePath().'/resources/sites/'.$site.'/users.json';
  
      if(file_exists($json_file)) {
  
        $json = file_get_contents($json_file);
  
        // decode json file
        $users = json_decode($json, true);
        
        foreach($users as &$user) {
          
          if($user['email'] == $email) {
            array_push($arr, $site);
          }
          
        }
        
  
      }
      
    }
    
    return $arr;
  	
	}

}
