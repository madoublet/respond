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
  public $token;
  public $sysadmin;
  public $sites;

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

    if(isset($this->sysadmin) === FALSE) {
      $this->sysadmin = FALSE;
    }
  }

  /**
   * Adds a user
   *
   * @param {string} $email
   * @param {string} $password
   * @param {string} $firstName
   * @param {string} $lastName
   * @param {string} $language
   * @param {string} $siteId
   * @param {string} $role
   * @return {User}
   */
	public static function add($email, $password, $firstName, $lastName, $language, $siteId = NULL, $role = 'admin'){

  	// build sites array
  	$sites = array();

    if($siteId != NULL) {
    	$site = array(
        "id" => $siteId,
        "role" => 'admin'
      );

      array_push($sites, $site);
    }

    $user = new User(array(
      'email' => $email,
      'password' => password_hash($password, PASSWORD_DEFAULT),
      'firstName' => $firstName,
      'lastName' => $lastName,
      'language' => $language,
      'token' => '',
      'sites' => $sites
    ));

    // save the user
    $user->save();

    return $user;

	}

  /**
   * Gets a user for a givenemail
   *
   * @param {string} $id
   * @param {string} $email
   * @return {User}
   */
	public static function getByEmail($email){

    $arr = User::getAllUsers();

    foreach($arr as &$item) {

      if($item->email == $email) {
        return $item;
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
	public static function getByToken($token){

    $users = User::getAllUsers();

    foreach($users as $user) {

      if($user->token == $token) {
        return $user;
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
	public static function getByEmailPassword($email, $password){

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
   * Retrieves users for a given site
   *
   * @param {string} $siteId
   * @return {Site}
   */
	public static function getUsers($siteId) {

  	$file = app()->basePath().'/resources/sites/users.json';
  	$users = array();

    if(file_exists($file)) {

      $arr = json_decode(file_get_contents($file), true);

      foreach($arr as &$item) {

        $user = new User($item);

        foreach($user->sites as &$site) {

          if($site['id'] == $siteId) {
            array_push($users, $user);
          }

        }

      }

    }

    return $users;

	}

	/**
   * Retrieves all users
   *
   * @return {users[]}
   */
	public static function getAllUsers() {

  	$file = app()->basePath().'/resources/sites/users.json';
  	$users = array();

    if(file_exists($file)) {

      $arr = json_decode(file_get_contents($file), true);

      foreach($arr as &$item) {
        $user = new User($item);
        array_push($users, $user);
      }

    }

    return $users;

	}

	/**
   * Adds a site to a users
   *
   * @param {string} $siteId the ID of the site
   * @param {string} role the role of the user
   * @return void
   */
	public function addSite($siteId, $role) {

  	if($this->sites == NULL) {
    	$this->sites = array();
  	}

  	$site = array(
      "id" => $siteId,
      "role" => $role
    );

    // push site to sites array
    array_push($this->sites, $site);

    // save users
    $this->save();
	}

	/**
   * Edits the role of the user
   *
   * @param {string} $siteId the ID of the site
   * @param {string} role the role of the user
   * @return void
   */
	public function editRole($siteId, $role) {

  	if($this->sites == NULL) {
    	$this->sites = array();
  	}

    // walk through sites
  	foreach($this->sites as &$site) {

      // remove site from user
      if($site['id'] == $siteId) {
        $site['role'] = $role;
      }

    }

    // save users
    $this->save();
	}

	/**
   * Gets the users role for a site
   *
   * @param {string} $siteId the ID of the site
   * @return void
   */
	public function getRole($siteId) {

	  $role = 'contributor';

  	if($this->sites == NULL) {
    	$this->sites = array();
  	}

  	print_r($this->sites);

    // walk through sites
  	foreach($this->sites as &$site) {

      // rget role
      if($site['id'] == $siteId) {
        $role = $site['role'];
      }

    }

    return $role;
	}

	/**
   * Saves a user
   *
   * @param {string} $id the ID of the site
   * @return void
   */
  public function save() {

    // defaults
    $dir = app()->basePath().'/resources/sites/';
    $is_match = false;

    $users = User::getAllUsers();

    foreach($users as &$item) {

      // check email
      if($item->email == $this->email) {

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

    return;
  }

  /**
   * Removes a user
   *
   * @param {string} $siteId
   * @return Response
   */
  public function remove($siteId){

    // remove the user from JSON
    $json_file = app()->basePath().'/resources/sites/users.json';

    if(file_exists($json_file)) {

      $json = file_get_contents($json_file);

      // decode json file
      $users = json_decode($json, true);
      $i = 0;

      foreach($users as &$user){

        // remove page
        if($user['email'] == $this->email) {
          unset($users[$i]);

          $x = 0;

          foreach($this->sites as &$site) {

            // remove site from user
            if($site['id'] == $siteId) {
              unset($this->sites[$x]);

              // if user has no more sites, then remove the user
              if(count($this->sites) == 0) {
                unset($users[$i]);
              }
            }

            $x++;

          }


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
  public static function listAll($siteId){


    $users = User::getUsers($siteId);

    foreach($users as &$user) {

      $user->password = 'currentpassword';
      $user->retype = 'currentpassword';
      $user->role = 'admin';

      // walk through sites
    	foreach($user->sites as &$site) {

        // remove site from user
        if($site['id'] == $siteId) {
          $user->role = $site['role'];
        }

      }

    }

    return $users;

  }

	/**
   * Converts per site users to resources/sites/users.json
   *
   * @param {string} $id
   * @return {Site}
   */
	public static function convert() {

  	$arr = array();

    // list all sites
    $sites = Site::getSites();

    // walk through sites
    foreach($sites as &$site) {

      echo $site;

      // get base path for the site
      $json_file = app()->basePath().'/resources/sites/'.$site.'/users.json';

      if(file_exists($json_file)) {

        $json = file_get_contents($json_file);

        // decode json file
        $users = json_decode($json, true);

        foreach($users as &$user) {

          $has_match = false;

          // check for email match
          foreach($arr as &$item) {

            if($user['email'] == $item['email']) {

              $has_match = true;

              $this_site = array(
                "id" => $site,
                "role" => 'admin'
              );

              array_push($item['sites'], $this_site);

            }

          }

          // push a new user
          if($has_match == false){

            $this_site = array(
              "id" => $site,
              "role" => 'admin'
            );

            $this_sites = array();

            // push site to sites array
            array_push($this_sites, $this_site);

            $user['sites'] = $this_sites;

            unset($user['siteId']);
            unset($user['photo']);

            array_push($arr, $user);


          }

        }

      }

    }

    // prevent showing the index (e.g. "0":{})
    $arr = array_values($arr);

    // set users
    $json_file = app()->basePath().'/resources/sites/users.json';

    // save array
    file_put_contents($json_file, json_encode($arr, JSON_PRETTY_PRINT));

    echo 'success!';

	}

}
